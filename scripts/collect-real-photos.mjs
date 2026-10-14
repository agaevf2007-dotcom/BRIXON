import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const covers = JSON.parse(await readFile(path.join(ROOT, "data/generated/catalog-covers.json"), "utf8"));
const icecat = JSON.parse(await readFile(path.join(ROOT, "data/generated/icecat.json"), "utf8"));

const EXTRA_PAGES = {
  "electrolux-eacs-12hat": ["https://e-catalog.co.uk/ELECTROLUX-EACS-12HAT-N3.htm"],
  "xiaomi-smart-air-purifier-4-pro": [
    "https://www.mi.com/global/product/xiaomi-smart-air-purifier-4-pro/",
    "https://www.mi.com/uk/product/xiaomi-smart-air-purifier-4-pro/",
  ],
  "xiaomi-smart-humidifier-2": [
    "https://www.mi.com/global/product/xiaomi-smart-humidifier-2/",
    "https://www.mi.com/uk/product/xiaomi-smart-humidifier-2/",
  ],
  "xiaomi-tv-a-50-2025": [
    "https://www.mi.com/global/product/xiaomi-tv-a-2025/",
    "https://www.mi.com/uk/product/xiaomi-tv-a-2025/",
  ],
  "sony-k-85s30": ["https://www.sony.com/electronics/televisions/k-85s30"],
  "sony-ht-a8000": ["https://electronics.sony.com/audio/soundbars/all-soundbars/p/hta8000"],
  "samsung-rb38c7b5b12": ["https://www.samsung.com/de/search/?searchvalue=RB38C7B5B12"],
  "haier-htw7720enmp": ["https://www.haier-europe.com/en_GB/search/?text=HTW7720ENMP"],
  "miele-g7160": ["https://www.miele.de/f/de/search.html?text=G7160"],
  "electrolux-eoe8p31wx": [
    "https://www.electrolux.de/kueche/kochen/backoefen/eoe8p31wx/",
    "https://e-catalog.co.uk/ELECTROLUX-EOE8P31WX.htm",
  ],
  "bosch-dwk97jq60": ["https://e-catalog.co.uk/BOSCH-DWK97JQ60.htm"],
  "electrolux-lft766x": [
    "https://www.electrolux.de/kueche/kochen/dunstabzugshauben/lft766x/",
    "https://e-catalog.co.uk/ELECTROLUX-LFT766X.htm",
  ],
  "haier-hw90-b14ig": ["https://www.haier-europe.com/en_GB/washing-machines/HW90-B14IG/"],
  "miele-wwg660": ["https://www.miele.de/f/de/search.html?text=WWG660"],
  "bosch-wtx87mh0by": ["https://e-catalog.co.uk/BOSCH-WTX87MH0BY.htm"],
  "samsung-dv90t8240sh": ["https://e-catalog.co.uk/SAMSUNG-DV90T8240SH.htm"],
  "siemens-hb675g0s1": ["https://e-catalog.co.uk/SIEMENS-HB675G0S1.htm"],
  "delonghi-ecam22064": ["https://www.delonghi.com/en-gb/p/magnifica-start-ecam220.60.b/ECAM220.60.B.html"],
  "bork-k811": ["https://www.hausdorf.ru/catalog/kettles/bork/chaynik-bork-k811.html"],
  "xiaomi-kettle-2-pro": ["https://www.mi.com/global/product/xiaomi-smart-kettle-2-pro/"],
  "bork-b780": ["https://www.bork.kz/eShop/Blenders/b780/"],
  "dyson-v15-detect": ["https://www.dyson.com/vacuum-cleaners/cordless/v15/detect-absolute"],
  "samsung-vs20b95923n": ["https://e-catalog.co.uk/SAMSUNG-VS20B95923N.htm"],
  "xiaomi-x20-plus": ["https://www.mi.com/de/product/xiaomi-robot-vacuum-x20-plus/"],
  "samsung-vr50t95735w": ["https://e-catalog.co.uk/SAMSUNG-VR50T95735W.htm"],
  "haier-as25s2sf2fa": ["https://www.haier-europe.com/en_GB/search/?text=AS25S2SF2FA"],
  "sony-k-65xr90": ["https://electronics.sony.com/tv-video/televisions/all-tvs/p/k65xr90"],
};

const BAD =
  /logo|icon|sprite|favicon|placeholder|energy.?label|150x\/|92x70|69x44|mastercard|paypal|sepa|banner|pixel|tracking|wikimedia|line_drawing|feature_icons|documents\/|movies_animations|avatar|flag|thumb\.wikimedia/i;

function unique(list) {
  const out = [];
  for (const item of list) {
    if (item && !out.includes(item)) out.push(item);
  }
  return out;
}

function icecatImages(id) {
  const row = icecat[id];
  if (!row?.images) return [];
  return row.images.filter((url) => url.includes("images.icecat.biz") && !BAD.test(url));
}

function productCode(model) {
  const token = String(model).split(/\s+/)[0];
  return token.replace(/[^A-Za-z0-9-]/g, "");
}

function pagesFor(id, cover) {
  const pages = [...(EXTRA_PAGES[id] ?? [])];
  const code = productCode(cover.model);
  if (code.length >= 6 && cover.brand === "Bosch") {
    pages.push(`https://www.bosch-home.com/de/de/product/${code}`);
  }
  if (code.length >= 6 && cover.brand === "Siemens") {
    pages.push(`https://www.siemens-home.bsh-group.com/de/de/product/${code}`);
  }
  return unique(pages);
}

function siblings(url) {
  const extra = [];
  if (/\/s\d+_produktbild_gross\//.test(url)) {
    for (let n = 1; n <= 6; n += 1) {
      extra.push(url.replace(/\/s\d+_produktbild_gross\//, `/s${n}_produktbild_gross/`));
    }
  }
  if (/\/desktop\/\d+\.jpg/.test(url)) {
    for (let n = 1; n <= 6; n += 1) {
      extra.push(url.replace(/\/desktop\/\d+\.jpg/, `/desktop/${n}.jpg`));
    }
  }
  return unique(extra.filter((item) => item !== url));
}

function fromHtml(html) {
  const text = html.replace(/\\\//g, "/").replace(/\\u002F/g, "/");
  const urls = [
    ...text.matchAll(/https?:\/\/[^"'\\\s<>]+\.(?:jpe?g|png|webp)/gi),
  ].map((match) => match[0].split("?")[0]);
  const shots = [];
  const features = [];
  for (const url of unique(urls)) {
    if (BAD.test(url)) continue;
    if (url.includes("/Product_Shots/")) shots.push(url);
    else if (
      /media3\.bsh-group\.com\/Images\/|media\.miele\.com|cdn\.idealo\.com|e-catalog\.co\.uk\/jpg_zoom|appmifile\.com|cloudfront\.net\/PDP|hausdorf\.ru|bork\.kz|images\.samsung\.com|images\.philips\.com|dyson\.com\/.+\.(?:jpe?g|png|webp)|images\.icecat\.biz/i.test(
        url,
      )
    ) {
      features.push(url);
    }
  }
  return [...shots, ...features];
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
    redirect: "follow",
    signal: AbortSignal.timeout(14000),
  });
  if (!res.ok) return "";
  const type = res.headers.get("content-type") || "";
  if (!/html|xml|json|text/i.test(type)) return "";
  return res.text();
}

async function alive(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA, Range: "bytes=0-1023" },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    if (!(res.ok || res.status === 206)) return false;
    const type = res.headers.get("content-type") || "";
    return /image|octet-stream|webp|jpeg|png/i.test(type) || type === "";
  } catch {
    return false;
  }
}

async function pool(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: limit }, run));
  return results;
}

const claimed = new Set();
const photos = {};

function claim(id, urls) {
  const chosen = [];
  for (const raw of urls) {
    if (!raw) continue;
    const url = raw.split("?")[0];
    if (BAD.test(url) || claimed.has(url) || chosen.includes(url)) continue;
    chosen.push(url);
    if (chosen.length === 6) break;
  }
  for (const url of chosen) claimed.add(url);
  photos[id] = chosen;
  return chosen.length;
}

const rich = [];
const thin = [];
for (const [id, cover] of Object.entries(covers)) {
  const official = icecatImages(id);
  const seed = unique([cover.url, ...official].filter(Boolean));
  if (official.length >= 4) rich.push({ id, cover, seed });
  else thin.push({ id, cover, seed });
}

for (const item of rich) {
  const count = claim(item.id, item.seed);
  console.log(`${item.id} icecat ${count}`);
}

const scraped = await pool(thin, 4, async (item) => {
  const found = [...item.seed];
  const pages = pagesFor(item.id, item.cover);
  for (const page of pages) {
    try {
      const html = await fetchText(page);
      if (!html) continue;
      found.push(...fromHtml(html));
    } catch {
      // next page
    }
  }
  const extra = [];
  for (const url of found) extra.push(...siblings(url));
  const unchecked = unique(extra).filter((url) => !found.includes(url)).slice(0, 8);
  const checks = await Promise.all(unchecked.map(async (url) => ((await alive(url)) ? url : null)));
  return { ...item, found: unique([...found, ...checks.filter(Boolean)]) };
});

for (const item of scraped) {
  const count = claim(item.id, item.found);
  console.log(`${item.id} scraped ${count}`);
}

const missing = Object.entries(photos).filter(([, list]) => !list.length).map(([id]) => id);
if (missing.length) {
  console.error("Missing photos:", missing.join(", "));
  process.exitCode = 1;
}

const out = path.join(ROOT, "data/generated/product-photos.json");
await writeFile(out, JSON.stringify(photos, null, 2));
const hosts = new Set();
for (const list of Object.values(photos)) {
  for (const url of list) hosts.add(new URL(url).hostname);
}
console.log("\nhosts", [...hosts].sort().join(", "));
console.log(`saved ${Object.keys(photos).length} products`);
