import { readFile, writeFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const FILE = "data/generated/product-photos.json";
const MAX = 6;

const PAGES = {
  "haier-as25s2sf2fa": [
    "https://e-catalog.co.uk/HAIER-AS25S2SF2FA-G.htm",
    "https://e-catalog.co.uk/HAIER-AS25S2SF2FA.htm",
  ],
  "electrolux-eacs-12hat": ["https://e-catalog.co.uk/ELECTROLUX-EACS-12HAT-N3.htm"],
  "xiaomi-smart-air-purifier-4-pro": [
    "https://www.mi.com/uk/product/xiaomi-smart-air-purifier-4-pro/",
    "https://www.mi.com/global/product/xiaomi-smart-air-purifier-4-pro/",
  ],
  "xiaomi-tv-a-50-2025": [
    "https://e-catalog.co.uk/XIAOMI-TV-A-50-2025.htm",
    "https://www.mi.com/uk/product/xiaomi-tv-a-2025/",
  ],
  "lg-oled77c4": [
    "https://e-catalog.co.uk/LG-OLED77C44LA.htm",
    "https://e-catalog.co.uk/LG-OLED77C4.htm",
    "https://www.lg.com/uk/tvs/oled-evo/oled77c44la/",
  ],
  "bosch-gsn36ai3p": [
    "https://e-catalog.co.uk/BOSCH-GSN36AI3P.htm",
    "https://www.bosch-home.com/de/de/product/GSN36AI3P",
  ],
  "siemens-hb675g0s1": ["https://e-catalog.co.uk/SIEMENS-HB675G0S1.htm"],
  "electrolux-eoe8p31wx": ["https://e-catalog.co.uk/ELECTROLUX-EOE8P31WX.htm"],
  "siemens-ex877lyv5e": [
    "https://e-catalog.co.uk/SIEMENS-EX877LYV5E.htm",
    "https://www.siemens-home.bsh-group.com/de/de/product/EX877LYV5E",
  ],
  "bosch-dwk97jq60": ["https://e-catalog.co.uk/BOSCH-DWK97JQ60.htm"],
  "electrolux-lft766x": ["https://e-catalog.co.uk/ELECTROLUX-LFT766X.htm"],
  "bosch-wgb256a40": [
    "https://e-catalog.co.uk/BOSCH-WGB256A40.htm",
    "https://www.bosch-home.com/de/de/product/WGB256A40",
  ],
  "miele-wwg660": [
    "https://e-catalog.co.uk/MIELE-WWG660.htm",
    "https://e-catalog.co.uk/MIELE-WWG-660-WCS.htm",
  ],
  "haier-hw90-b14ig": ["https://e-catalog.co.uk/HAIER-HW90-B14IG.htm"],
  "bosch-wtx87mh0by": ["https://e-catalog.co.uk/BOSCH-WTX87MH0BY.htm"],
  "samsung-dv90t8240sh": ["https://e-catalog.co.uk/SAMSUNG-DV90T8240SH.htm"],
  "bork-b780": ["https://www.bork.kz/eShop/Blenders/b780/"],
  "bosch-mfq36400": [
    "https://e-catalog.co.uk/BOSCH-MFQ36400.htm",
    "https://www.bosch-home.com/de/de/product/MFQ36400",
  ],
  "samsung-vs20b95923n": ["https://e-catalog.co.uk/SAMSUNG-VS20B95923N.htm"],
  "samsung-vr50t95735w": ["https://e-catalog.co.uk/SAMSUNG-VR50T95735W.htm"],
  "bosch-ctl636es6": [
    "https://e-catalog.co.uk/BOSCH-CTL636ES6.htm",
    "https://www.bosch-home.com/de/de/product/CTL636ES6",
  ],
  "bork-k811": ["https://www.hausdorf.ru/catalog/kettles/bork/chaynik-bork-k811.html"],
  "philips-hr3652": [
    "https://e-catalog.co.uk/PHILIPS-HR3652.htm",
    "https://e-catalog.co.uk/PHILIPS-HR3652-00.htm",
  ],
  "haier-h2f-220waa": ["https://e-catalog.co.uk/HAIER-H2F-220WAA.htm"],
  "bosch-sms8yci01e": [
    "https://e-catalog.co.uk/BOSCH-SMS8YCI01E.htm",
    "https://www.bosch-home.com/de/de/product/SMS8YCI01E",
  ],
};

const KEEP =
  /Product_Shots|jpg_zoom|produktbild|appmifile\.com\/(?:mi-com-product\/fly-birds|webfile)|hausdorf\.ru\/upload\/iblock|st\.bork\.kz\/(?:components|original)|cloudfront\.net\/PDP|images\.icecat\.biz\/img\/gallery|media\.miele\.com\/dam\/i|lg\.com\/.+\/images\/|samsung\.com\/is\/image/;

const SKIP =
  /logo|icon|sprite|favicon|maskable|award|pwa|thumb\/|energy.?label|150x\/|Line_Drawings|Movies_Animations|Feature_Icons|Documents\/|wikimedia|placeholder|badge/;

const photos = JSON.parse(await readFile(FILE, "utf8"));

function unique(list) {
  const out = [];
  for (const item of list) if (item && !out.includes(item)) out.push(item);
  return out;
}

function normalize(url) {
  return url.replace(/\\\//g, "/").replace(/\\u002F/g, "/").split("?")[0];
}

function abortAfter(ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  if (typeof timer.unref === "function") timer.unref();
  return { signal: ctrl.signal, done: () => clearTimeout(timer) };
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
  const bork = url.match(/^(https:\/\/st\.bork\.kz\/components\/product\/.+\/)preview-mobile\/([^/]+)\.jpg$/i);
  if (bork) {
    extra.push(`${bork[1]}preview/${bork[2]}.jpg`);
    extra.push(`${bork[1]}gallery/1.jpg`);
    extra.push(`${bork[1]}gallery/2.jpg`);
    extra.push(`${bork[1]}gallery/3.jpg`);
    extra.push(`${bork[1]}gallery/4.jpg`);
    extra.push(`${bork[1]}gallery/5.jpg`);
    extra.push(`https://st.bork.kz/original/product/${bork[2]}/${bork[2]}.jpg`);
    extra.push(`https://st.bork.kz/original/product/${bork[2]}/1.jpg`);
    extra.push(`https://st.bork.kz/original/product/${bork[2]}/2.jpg`);
    extra.push(`https://st.bork.kz/original/product/${bork[2]}/3.jpg`);
  }
  return unique(extra);
}

function fromHtml(html) {
  const text = html.replace(/\\\//g, "/").replace(/\\u002F/g, "/");
  return unique(
    [...text.matchAll(/https?:\/\/[^"'\\\s<>]+\.(?:jpe?g|png|webp)/gi)].map((match) => normalize(match[0])),
  ).filter((url) => KEEP.test(url) && !SKIP.test(url));
}

async function fetchText(url) {
  const t = abortAfter(8000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: t.signal,
    });
    if (!res.ok) return "";
    const type = res.headers.get("content-type") || "";
    if (!/html|xml|json|text/i.test(type)) return "";
    return await res.text();
  } catch {
    return "";
  } finally {
    t.done();
  }
}

async function alive(url) {
  const t = abortAfter(6000);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA, Range: "bytes=0-400" },
      redirect: "follow",
      signal: t.signal,
    });
    const type = res.headers.get("content-type") || "";
    const size = Number(res.headers.get("content-length") || res.headers.get("content-range")?.split("/")[1] || 0);
    return (res.ok || res.status === 206) && (/image|octet-stream|jpeg|png|webp/i.test(type) || size > 4000);
  } catch {
    return false;
  } finally {
    t.done();
  }
}

async function persist() {
  await writeFile(FILE, JSON.stringify(photos, null, 2) + "\n");
}

async function keepAlive(urls, already) {
  const extras = [];
  const pending = urls.filter((url) => !already.includes(url));
  const batch = 4;
  for (let i = 0; i < pending.length && already.length + extras.length < MAX; i += batch) {
    const chunk = pending.slice(i, i + batch);
    const checks = await Promise.all(chunk.map(async (url) => ((await alive(url)) ? url : null)));
    for (const url of checks) {
      if (url && !extras.includes(url) && already.length + extras.length < MAX) extras.push(url);
    }
  }
  return extras;
}

const thin = () => Object.entries(photos).filter(([, list]) => list.length < 4);

console.log("pass 1: sequential variants");
for (const [id, current] of thin()) {
  const candidates = unique(current.flatMap((url) => [url, ...variants(url)])).filter((url) => !current.includes(url));
  if (!candidates.length) continue;
  const extras = await keepAlive(candidates, current);
  if (!extras.length) {
    console.log(`${id} variants 0`);
    continue;
  }
  photos[id] = unique([...current, ...extras]).slice(0, MAX);
  await persist();
  console.log(`${id} ${current.length} -> ${photos[id].length}`);
}

console.log("pass 2: product pages");
for (const [id, current] of thin()) {
  const pages = PAGES[id] ?? [];
  if (!pages.length) continue;
  const found = [];
  for (const page of pages) {
    const html = await fetchText(page);
    if (html) found.push(...fromHtml(html));
  }
  const candidates = unique([...found, ...found.flatMap(variants)]).filter((url) => !current.includes(url));
  const extras = await keepAlive(candidates.slice(0, 16), current);
  if (!extras.length) {
    console.log(`${id} pages 0`);
    continue;
  }
  photos[id] = unique([...current, ...extras]).slice(0, MAX);
  await persist();
  console.log(`${id} ${current.length} -> ${photos[id].length}`);
}

const sizes = Object.values(photos).map((list) => list.length);
console.log("avg", (sizes.reduce((a, b) => a + b, 0) / sizes.length).toFixed(1));
console.log("thin", sizes.filter((n) => n < 3).length, "/", sizes.length);
for (const [id, list] of Object.entries(photos)) {
  if (list.length < 3) console.log(`still ${list.length}\t${id}`);
}
