import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const photos = JSON.parse(await readFile("data/generated/product-photos.json", "utf8"));
const items = [];
for (const [id, list] of Object.entries(photos)) {
  for (const [index, url] of list.entries()) {
    if (index === 0) continue;
    items.push({ id, index, url });
  }
}

function abortAfter(ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  if (typeof timer.unref === "function") timer.unref();
  return { signal: ctrl.signal, done: () => clearTimeout(timer) };
}

async function check(url, ms) {
  const t = abortAfter(ms);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Range: "bytes=0-1023" },
      redirect: "follow",
      signal: t.signal,
    });
    const type = res.headers.get("content-type") || "";
    const ok = (res.ok || res.status === 206) && /image|octet-stream|jpeg|png|webp|avif/i.test(type);
    return { url, ok, status: res.status, type: type.slice(0, 60) };
  } catch (error) {
    return { url, ok: false, status: 0, type: String(error.message || error).slice(0, 80) };
  } finally {
    t.done();
  }
}

const bad = [];
for (let i = 0; i < items.length; i += 4) {
  const chunk = items.slice(i, i + 4);
  const rows = await Promise.all(
    chunk.map(async (item) => {
      let row = await check(item.url, 18000);
      if (!row.ok && row.status === 0) row = await check(item.url, 35000);
      return { ...item, ...row };
    }),
  );
  for (const row of rows) {
    if (!row.ok) {
      console.log(`BAD ${row.id}#${row.index} ${row.status} ${row.type} ${row.url}`);
      bad.push(row);
    }
  }
  if ((i + 4) % 20 === 0 || i + 4 >= items.length) {
    console.log(`checked ${Math.min(i + 4, items.length)}/${items.length}`);
  }
}

const out = join(tmpdir(), "brixon-extras.json");
await writeFile(out, JSON.stringify({ total: items.length, bad }, null, 2));
console.log("extraTotal", items.length, "bad", bad.length, "out", out);
