import { readFile, writeFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const photos = JSON.parse(await readFile("data/generated/product-photos.json", "utf8"));
const covers = JSON.parse(await readFile("data/generated/catalog-covers.json", "utf8"));

const PAGES = {
  "haier-as25s2sf2fa": ["https://www.bosch-home.com/de/de/product/AS25S2SF2FA"],
  "electrolux-eacs-12hat": ["https://e-catalog.co.uk/ELECTROLUX-EACS-12HAT-N3.htm"],
  "xiaomi-smart-air-purifier-4-pro": [
    "https://www.mi.com/uk/product/xiaomi-smart-air-purifier-4-pro/",
    "https://www.mi.com/global/product/xiaomi-smart-air-purifier-4-pro/",
  ],
  "xiaomi-smart-humidifier-2": ["https://www.mi.com/uk/product/xiaomi-smart-humidifier-2/"],
  "xiaomi-tv-a-50-2025": ["https://www.mi.com/uk/product/xiaomi-tv-a-2025/"],
  "lg-oled77c4": ["https://www.lg.com/uk/tvs/lg-oled77c4/"],
  "bosch-gsn36ai3p": ["https://www.bosch-home.com/de/de/product/GSN36AI3P"],
  "siemens-hb675g0s1": [
    "https://www.siemens-home.bsh-group.com/de/product/HB675G0S1",
    "https://www.siemens-home.bsh-group.com/gb/en/product/HB675G0S1",
    "https://e-catalog.co.uk/SIEMENS-HB675G0S1.htm",
  ],
  "electrolux-eoe8p31wx": ["https://e-catalog.co.uk/ELECTROLUX-EOE8P31WX.htm"],
  "siemens-ex877lyv5e": ["https://www.siemens-home.bsh-group.com/de/de/product/EX877LYV5E"],
  "bosch-dwk97jq60": ["https://www.bosch-home.com/de/de/product/DWK97JQ60"],
  "electrolux-lft766x": ["https://e-catalog.co.uk/ELECTROLUX-LFT766X.htm"],
  "bosch-wgb256a40": ["https://www.bosch-home.com/de/de/product/WGB256A40"],
  "miele-wwg660": ["https://www.miele.de/haushalt/waschmaschinen-1554.htm?model=WWG660"],
  "haier-hw90-b14ig": ["https://www.haier-europe.com/en_GB/washing-machines/HW90-B14IG/"],
  "bosch-wtx87mh0by": [
    "https://www.bosch-home.com/de/de/product/WTX87MH0",
    "https://e-catalog.co.uk/BOSCH-WTX87MH0BY.htm",
  ],
  "samsung-dv90t8240sh": ["https://e-catalog.co.uk/SAMSUNG-DV90T8240SH.htm"],
  "bosch-ctl636es6": ["https://www.bosch-home.com/de/de/product/CTL636ES6"],
  "xiaomi-kettle-2-pro": ["https://www.mi.com/uk/product/xiaomi-smart-kettle-2-pro/"],
  "bork-b780": ["https://www.bork.kz/eShop/Blenders/b780/"],
  "bosch-mfq36400": ["https://www.bosch-home.com/de/de/product/MFQ36400"],
  "samsung-vs20b95923n": ["https://e-catalog.co.uk/SAMSUNG-VS20B95923N.htm"],
  "samsung-vr50t95735w": ["https://e-catalog.co.uk/SAMSUNG-VR50T95735W.htm"],
  "bork-k811": ["https://www.hausdorf.ru/catalog/kettles/bork/chaynik-bork-k811.html"],
  "philips-hr3652": [],
};

const KEEP =
  /Product_Shots|jpg_zoom|produktbild|appmifile\.com\/(?:mi-com-product\/fly-birds|webfile)|hausdorf\.ru\/upload\/iblock|st\.bork\.kz\/(?:components|original)|cloudfront\.net\/PDP|images\.icecat\.biz\/img\/gallery|media\.miele\.com\/dam/i;

const SKIP =
  /logo|icon|sprite|favicon|maskable|award|pwa|thumb\/|energy.?label|150x\/|Line_Drawings|Movies_Animations|Feature_Icons|Documents\//;

function unique(list) {
  const out = [];
  for (const item of list) if (item && !out.includes(item)) out.push(item);
  return out;
}

function normalize(url) {
  return url.replace(/\\\//g, "/").replace(/\\u002F/g, "/").split("?")[0];
}

function fromHtml(html) {
  const text = html.replace(/\\\//g, "/").replace(/\\u002F/g, "/");
  return unique(
    [...text.matchAll(/https?:\/\/[^"'\\\s<>]+\.(?:jpe?g|png|webp)/gi)].map((match) => normalize(match[0])),
  ).filter((url) => KEEP.test(url) && !SKIP.test(url));
}

function variants(url) {
  const extra = [];
  const zoom = url.match(/\/jpg_zoom(\d+)\/(\d+)\.jpg$/i);
  if (zoom) {
    for (let n = 1; n <= 8; n += 1) extra.push(url.replace(/\/jpg_zoom\d+\//, `/jpg_zoom${n}/`));
  }
  if (/\/s\d+_produktbild_gross\//.test(url)) {
    for (let n = 1; n <= 8; n += 1) extra.push(url.replace(/\/s\d+_produktbild_gross\//, `/s${n}_produktbild_gross/`));
  }
  if (/\/desktop\/\d+\.jpg/.test(url)) {
    for (let n = 1; n <= 8; n += 1) extra.push(url.replace(/\/desktop\/\d+\.jpg/, `/desktop/${n}.jpg`));
  }
  const iblock = url.match(/^(https:\/\/www\.hausdorf\.ru\/upload\/iblock\/[a-z0-9]+\/.+_)(\d+)(\.jpe?g)$/i);
  if (iblock) {
    for (let n = 1; n <= 6; n += 1) extra.push(`${iblock[1]}${n}${iblock[3]}`);
  }
  return unique(extra);
}

async function fetchText(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: AbortSignal.timeout(14000),
    });
    if (!res.ok) return "";
    const type = res.headers.get("content-type") || "";
    if (!/html|xml|json|text/i.test(type)) return "";
    return res.text();
  } catch {
    return "";
  }
}

async function alive(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA, Range: "bytes=0-400" },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    const type = res.headers.get("content-type") || "";
    return (res.ok || res.status === 206) && /image|octet-stream|jpeg|png|webp/i.test(type);
  } catch {
    return false;
  }
}

const claimed = new Set(Object.values(photos).flat());
const thin = Object.entries(photos).filter(([, list]) => list.length < 4);

for (const [id, current] of thin) {
  const cover = covers[id];
  const code = String(cover?.model ?? "").split(/[\s/]/)[0];
  const pages = [...(PAGES[id] ?? [])];
  if (cover?.brand === "Bosch" && code) pages.push(`https://www.bosch-home.com/de/de/product/${code}`);
  if (cover?.brand === "Siemens" && code) {
    pages.push(`https://www.siemens-home.bsh-group.com/de/de/product/${code}`);
  }

  const found = [...current];
  for (const page of unique(pages)) {
    const html = await fetchText(page);
    if (html) found.push(...fromHtml(html));
  }

  const candidates = unique([...found, ...found.flatMap(variants)]).filter((url) => !claimed.has(url) || current.includes(url));
  const extras = candidates.filter((url) => !current.includes(url));
  const checks = [];
  for (const url of extras.slice(0, 12)) {
    checks.push((await alive(url)) ? url : null);
  }

  const next = unique([...current, ...checks.filter(Boolean)]).slice(0, 6);
  for (const url of next) claimed.add(url);
  photos[id] = next;
  console.log(`${id} ${current.length} -> ${next.length}`);
}

await writeFile("data/generated/product-photos.json", JSON.stringify(photos, null, 2));
const sizes = Object.values(photos).map((list) => list.length);
console.log("avg", (sizes.reduce((a, b) => a + b, 0) / sizes.length).toFixed(1));
console.log("thin", sizes.filter((n) => n < 3).length);
