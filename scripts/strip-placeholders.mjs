import { readFile, writeFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const path = "data/generated/product-photos.json";
const photos = JSON.parse(await readFile(path, "utf8"));

function abortAfter(ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  if (typeof timer.unref === "function") timer.unref();
  return { signal: ctrl.signal, done: () => clearTimeout(timer) };
}

async function sizeOf(url) {
  const t = abortAfter(20000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, signal: t.signal });
    const buf = Buffer.from(await res.arrayBuffer());
    return { ok: res.ok, status: res.status, bytes: buf.length };
  } catch {
    return { ok: false, status: 0, bytes: 0 };
  } finally {
    t.done();
  }
}

const idealo = [];
for (const [id, list] of Object.entries(photos)) {
  for (const url of list) {
    if (url.includes("cdn.idealo.com")) idealo.push({ id, url });
  }
}

const drop = new Set();
for (let i = 0; i < idealo.length; i += 4) {
  const chunk = idealo.slice(i, i + 4);
  const rows = await Promise.all(
    chunk.map(async (item) => ({ ...item, ...(await sizeOf(item.url)) })),
  );
  for (const row of rows) {
    const placeholder = row.ok && row.bytes > 0 && row.bytes < 4000;
    if (placeholder) {
      drop.add(row.url);
      console.log(`DROP ${row.id} ${row.bytes} ${row.url}`);
    } else {
      console.log(`KEEP ${row.id} ${row.status} ${row.bytes} ${row.url.slice(-48)}`);
    }
  }
}

let removed = 0;
for (const [id, list] of Object.entries(photos)) {
  const next = list.filter((url) => !drop.has(url));
  removed += list.length - next.length;
  if (!next.length) {
    console.log("KEEP COVER", id);
    photos[id] = list.slice(0, 1);
  } else {
    photos[id] = next;
  }
}

await writeFile(path, JSON.stringify(photos, null, 2) + "\n");
console.log("removed", removed, "dropSet", drop.size);
