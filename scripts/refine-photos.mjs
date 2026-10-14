import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const covers = JSON.parse(await readFile(path.join(ROOT, "data/generated/catalog-covers.json"), "utf8"));
const current = JSON.parse(await readFile(path.join(ROOT, "data/generated/product-photos.json"), "utf8"));

const JUNK =
  /award|maskable|\/pwa\/|\/thumb\/|energy_class|92x92|92x70|iconinfo|some_|\/mobile\/|^http:\/\/|k600/i;

function unique(list) {
  const out = [];
  for (const item of list) if (item && !out.includes(item)) out.push(item);
  return out;
}

function codes(model) {
  const raw = String(model).toUpperCase();
  const parts = raw.match(/[A-Z0-9]*[A-Z]{2,}[A-Z0-9-]*\d[A-Z0-9-]*/g) ?? [];
  return unique([raw.split(/\s+/)[0], raw.replace(/[^A-Z0-9]/g, ""), ...parts].filter((item) => item.length >= 5));
}

function foreign(url, model) {
  const name = decodeURIComponent(url.split("/").pop() ?? "")
    .toUpperCase()
    .replace(/MCSA\d+/g, "")
    .replace(/MCIM\d+/g, "");
  const found = name.match(/[A-Z]{3,}\d[A-Z0-9]{3,}/g) ?? [];
  const ours = codes(model).map((item) => item.replace(/[^A-Z0-9]/g, ""));
  return found.some((code) => {
    const compact = code.replace(/[^A-Z0-9]/g, "");
    if (compact.length < 6) return false;
    return !ours.some((own) => own.includes(compact) || compact.includes(own));
  });
}

function keep(url, model, cover) {
  if (!url || JUNK.test(url)) return false;
  if (url === cover) return true;
  if (url.includes("images.icecat.biz")) return true;
  if (url.includes("cdn.idealo.com") && url.includes("produktbild")) return true;
  if (url.includes("e-catalog.co.uk/jpg_zoom")) return true;
  if (/appmifile\.com\/(?:mi-com-product\/fly-birds|webfile\/globalimg)/i.test(url)) return true;
  if (url.includes("cloudfront.net") && /\/desktop\/\d+\.(?:jpe?g|png|webp)$/i.test(url)) return true;
  if (url.includes("hausdorf.ru/upload/iblock/")) return true;
  if (url.includes("media.miele.com")) return true;
  if (foreign(url, model)) return false;
  if (url.includes("/Product_Shots/")) return true;
  if (url.includes("/Images/") && /FHI_.*\.webp$/i.test(url)) return true;
  if (url.includes("appmifile.com") && /fly-birds|webfile\/globalimg/i.test(url)) return true;
  if (url.includes("hausdorf.ru/upload/iblock/")) return true;
  if (url.includes("st.bork.kz") && !url.includes("photos_resized")) return true;
  if (url.includes("cloudfront.net") && /\/desktop\/\d+\.(?:jpe?g|png|webp)$/i.test(url)) return true;
  if (url.includes("media.miele.com")) return true;
  return false;
}

async function alive(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA, Range: "bytes=0-200" },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    const type = res.headers.get("content-type") || "";
    return (res.ok || res.status === 206) && /image|octet-stream|jpeg|png|webp/i.test(type);
  } catch {
    return false;
  }
}

async function numbered(base, count) {
  const urls = Array.from({ length: count }, (_, index) => `${base}${index + 1}.jpg`);
  const checks = await Promise.all(urls.map(async (url) => ((await alive(url)) ? url : null)));
  return checks.filter(Boolean);
}

const extras = {
  "sony-k-65xr90": await numbered(
    "https://d1ncau8tqf99kp.cloudfront.net/PDP/TVandVIDEO/Televisions/XR90/desktop/",
    6,
  ),
  "sony-ht-a8000": await numbered(
    "https://d1ncau8tqf99kp.cloudfront.net/PDP/Audio/Soundbars/HT-A8000/desktop/",
    6,
  ),
  "sony-k-85s30": await numbered(
    "https://d1ncau8tqf99kp.cloudfront.net/PDP/TVandVIDEO/Televisions/S30/desktop/",
    6,
  ),
};

const claimed = new Set();
const next = {};
for (const [id, cover] of Object.entries(covers)) {
  const model = cover.model;
  const pool = unique([cover.url, ...(extras[id] ?? []), ...(current[id] ?? [])]);
  const chosen = [];
  for (const url of pool) {
    if (!keep(url, model, cover.url) || claimed.has(url)) continue;
    chosen.push(url);
    if (chosen.length === 6) break;
  }
  for (const url of chosen) claimed.add(url);
  next[id] = chosen;
  console.log(`${id} ${chosen.length}`);
}

await writeFile(path.join(ROOT, "data/generated/product-photos.json"), JSON.stringify(next, null, 2));
