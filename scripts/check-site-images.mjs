import { readFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const photos = JSON.parse(await readFile("data/generated/product-photos.json", "utf8"));
const media = await readFile("data/media.ts", "utf8");
const cats = await readFile("data/categories.ts", "utf8");

const urls = new Set();
for (const [id, list] of Object.entries(photos)) {
  if (!Array.isArray(list) || !list.length) {
    console.log("EMPTY", id);
    continue;
  }
  for (const url of list) urls.add(url);
}
for (const match of media.matchAll(/https:\/\/images\.unsplash\.com\/[^"'\s]+/g)) urls.add(match[0]);
for (const match of cats.matchAll(/photo-[a-z0-9-]+/gi)) {
  urls.add(`https://images.unsplash.com/${match[0]}?auto=format&fit=crop&w=1600&q=80`);
}

function abortAfter(ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  if (typeof timer.unref === "function") timer.unref();
  return { signal: ctrl.signal, done: () => clearTimeout(timer) };
}

async function check(url) {
  const t = abortAfter(10000);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA, Range: "bytes=0-400" },
      redirect: "follow",
      signal: t.signal,
    });
    const type = res.headers.get("content-type") || "";
    const ok = (res.ok || res.status === 206) && /image|octet-stream|jpeg|png|webp/i.test(type);
    return { url, ok, status: res.status, type: type.slice(0, 40) };
  } catch (error) {
    return { url, ok: false, status: 0, type: String(error.message || error).slice(0, 80) };
  } finally {
    t.done();
  }
}

const list = [...urls];
const bad = [];
for (let i = 0; i < list.length; i += 8) {
  const chunk = await Promise.all(list.slice(i, i + 8).map(check));
  for (const row of chunk) {
    if (!row.ok) {
      console.log(`BAD ${row.status} ${row.type} ${row.url}`);
      bad.push(row);
    }
  }
  process.stdout.write(`checked ${Math.min(i + 8, list.length)}/${list.length}\n`);
}

console.log("total", list.length, "bad", bad.length, "products", Object.keys(photos).length);
