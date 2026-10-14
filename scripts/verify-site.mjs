import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const ORIGIN = "http://localhost:3000";
const OUT = join(tmpdir(), "brixon-verify.json");

const photos = JSON.parse(await readFile("data/generated/product-photos.json", "utf8"));
const media = await readFile("data/media.ts", "utf8");
const cats = await readFile("data/categories.ts", "utf8");
const productSources = await Promise.all(
  ["kitchen", "laundry", "small", "climate", "electronics"].map((name) =>
    readFile(`data/products/${name}.ts`, "utf8"),
  ),
);

const slugs = [
  ...new Set(
    [...productSources.join("\n").matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]),
  ),
];
const categorySlugs = [...cats.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

const marketing = [];
for (const match of media.matchAll(/https:\/\/images\.unsplash\.com\/[^"'`\s]+/g)) {
  if (!match[0].includes("${")) marketing.push(match[0]);
}
for (const match of cats.matchAll(/photo-[a-z0-9-]+/gi)) {
  marketing.push(`https://images.unsplash.com/${match[0]}?auto=format&fit=crop&w=1600&q=80`);
}

function abortAfter(ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  if (typeof timer.unref === "function") timer.unref();
  return { signal: ctrl.signal, done: () => clearTimeout(timer) };
}

function looksLikeImage(buf, type) {
  if (/image|octet-stream|jpeg|png|webp|avif|gif/i.test(type || "")) return true;
  if (!buf || buf.length < 12) return false;
  if (buf[0] === 0xff && buf[1] === 0xd8) return true;
  if (buf[0] === 0x89 && buf[1] === 0x50) return true;
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return true;
  if (buf.toString("ascii", 0, 4) === "<svg") return true;
  return false;
}

async function fetchOnce(url, ms = 25000) {
  const t = abortAfter(ms);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA },
      redirect: "follow",
      signal: t.signal,
    });
    const type = res.headers.get("content-type") || "";
    const buf = Buffer.from(await res.arrayBuffer().catch(() => new ArrayBuffer(0)));
    return { url, status: res.status, type, ok: res.ok, buf };
  } catch (error) {
    return { url, status: 0, type: String(error.message || error), ok: false, buf: Buffer.alloc(0) };
  } finally {
    t.done();
  }
}

async function checkImage(url, retries = 2) {
  let last;
  for (let i = 0; i <= retries; i++) {
    last = await fetchOnce(url, i === 0 ? 20000 : 35000);
    const image = looksLikeImage(last.buf, last.type);
    if ((last.ok || last.status === 206) && image) {
      return { url, ok: true, status: last.status, type: last.type.slice(0, 60), bytes: last.buf.length };
    }
    if (last.status >= 400 && last.status !== 429 && last.status !== 503) {
      return { url, ok: false, status: last.status, type: last.type.slice(0, 80), bytes: last.buf.length };
    }
  }
  return { url, ok: false, status: last.status, type: last.type.slice(0, 80), bytes: last.buf.length };
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
  return out;
}

const pages = [
  "/",
  "/catalog",
  "/categories",
  "/about",
  "/contacts",
  "/cart",
  "/wishlist",
  "/delivery",
  "/service",
  ...categorySlugs.map((s) => `/catalog/${s}`),
  ...slugs.slice(0, 12).map((s) => `/product/${s}`),
];

console.log("checking pages", pages.length);
const pageRows = [];
for (const path of pages) {
  const url = ORIGIN + path;
  const started = Date.now();
  const row = await fetchOnce(url, 30000);
  const html = row.buf.toString("utf8");
  const overlay =
    html.includes("Unhandled Runtime Error") ||
    html.includes("nextjs-portal") && html.includes("error") && html.includes("Hydration");
  const hydration = /hydration|Hydration/i.test(html) && /error/i.test(html);
  pageRows.push({
    path,
    status: row.status,
    ms: Date.now() - started,
    ok: row.ok && row.status === 200,
    overlay,
    hydration,
    len: html.length,
  });
  const mark = row.status === 200 && !overlay ? "OK" : "FAIL";
  console.log(`${mark} ${row.status} ${path} ${Date.now() - started}ms`);
}

const covers = Object.entries(photos).map(([id, list]) => ({ id, url: list[0], count: list.length }));
console.log("checking covers", covers.length);
const coverRows = await pool(covers, 3, async (item) => {
  const result = await checkImage(item.url);
  console.log(`${result.ok ? "COVER OK" : "COVER BAD"} ${item.id} ${result.status} ${item.url}`);
  return { ...item, ...result };
});

const extraUrls = [];
for (const [id, list] of Object.entries(photos)) {
  for (const url of list.slice(1)) extraUrls.push({ id, url });
}
console.log("checking extras", extraUrls.length);
const extraRows = await pool(extraUrls, 3, async (item) => {
  const result = await checkImage(item.url, 1);
  if (!result.ok) console.log(`EXTRA BAD ${item.id} ${result.status} ${result.type} ${item.url}`);
  return { ...item, ...result };
});

console.log("checking marketing", marketing.length);
const marketingRows = await pool([...new Set(marketing)], 3, async (url) => {
  const result = await checkImage(url, 1);
  if (!result.ok) console.log(`MKT BAD ${result.status} ${url}`);
  return result;
});

const hosts = new Set();
for (const list of Object.values(photos)) {
  for (const url of list) {
    try {
      hosts.add(new URL(url).hostname);
    } catch {
      /* ignore */
    }
  }
}

const result = {
  pages: pageRows,
  covers: coverRows,
  extras: extraRows.filter((r) => !r.ok),
  extraOk: extraRows.filter((r) => r.ok).length,
  extraTotal: extraRows.length,
  marketing: marketingRows.filter((r) => !r.ok),
  marketingOk: marketingRows.filter((r) => r.ok).length,
  hosts: [...hosts].sort(),
  emptyProducts: Object.entries(photos)
    .filter(([, list]) => !list.length)
    .map(([id]) => id),
  slugs: slugs.length,
};

await writeFile(OUT, JSON.stringify(result, null, 2));
console.log("wrote", OUT);
console.log(
  "summary pages",
  pageRows.filter((p) => !p.ok).length,
  "coverBad",
  coverRows.filter((c) => !c.ok).length,
  "extraBad",
  extraRows.filter((e) => !e.ok).length,
  "mktBad",
  marketingRows.filter((m) => !m.ok).length,
  "hosts",
  [...hosts].join(","),
);
