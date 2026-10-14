import { readFile, writeFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const FILE = "data/generated/product-photos.json";
const MAX = 6;

const PAGES = {
  "bosch-gsn36ai3p": ["https://www.bosch-home.com/de/de/product/GSN36AI3P"],
  "siemens-hb675g0s1": [
    "https://www.siemens-home.bsh-group.com/de/product/HB675G0S1",
    "https://www.siemens-home.bsh-group.com/gb/en/product/HB675G0S1",
  ],
  "siemens-ex877lyv5e": ["https://www.siemens-home.bsh-group.com/de/de/product/EX877LYV5E"],
  "bosch-dwk97jq60": ["https://www.bosch-home.com/de/de/product/DWK97JQ60"],
  "bosch-wgb256a40": ["https://www.bosch-home.com/de/de/product/WGB256A40"],
  "bosch-wtx87mh0by": [
    "https://www.bosch-home.com/de/de/product/WTX87MH0",
    "https://www.bosch-home.com/de/de/product/WTX87MH0BY",
  ],
  "bosch-ctl636es6": ["https://www.bosch-home.com/de/de/product/CTL636ES6"],
  "miele-wwg660": [
    "https://www.miele.de/houseofmiele/de-de/shop/waschmaschinen/wwg660-wcs-12561770-p",
    "https://www.miele.com/en-de/shop/washing-machines/wwg660-wcs-12561770-p",
  ],
  "samsung-vs20b95923n": [
    "https://www.samsung.com/uk/vacuum-cleaners/stick/jet-90-complete-vs20b95923n/",
    "https://www.samsung.com/de/vacuum-cleaners/stick/vs20b95923n/",
  ],
  "samsung-dv90t8240sh": [
    "https://www.samsung.com/uk/washers-and-dryers/tumble-dryers/dv90t8240sh/",
    "https://www.samsung.com/de/washers-and-dryers/tumble-dryers/dv90t8240sh/",
  ],
  "xiaomi-tv-a-50-2025": [
    "https://www.mi.com/uk/product/xiaomi-tv-a-2025/",
    "https://www.mi.com/global/product/xiaomi-tv-a-2025/",
  ],
  "haier-as25s2sf2fa": [
    "https://www.haier-europe.com/en_GB/air-conditioners/as25s2sf2fa-g/",
    "https://www.haier.com/uk/",
  ],
  "electrolux-eacs-12hat": ["https://www.electrolux.com/en/kitchen/air-conditioners/"],
  "electrolux-eoe8p31wx": [
    "https://www.electrolux.com/en/kitchen/ovens/eoe8p31wx/",
    "https://www.electrolux.de/kitchen/backoefen/eoe8p31wx/",
  ],
  "haier-hw90-b14ig": ["https://www.haier-europe.com/en_GB/washing-machines/HW90-B14IG/"],
  "electrolux-lft766x": ["https://www.electrolux.com/en/kitchen/hoods/lft766x/"],
};

const SKIP =
  /logo|icon|sprite|favicon|maskable|award|pwa|thumb\/|energy.?label|150x\/|Line_Drawings|Movies_Animations|Feature_Icons|Documents\/|wikimedia|placeholder|badge|mastercard|paypal|sepa|iconinfo|Energy_Class|69x44|92x92|promo_|Image3for2|aktivkohlefilter|kompatibel|techtek-akku|vhbw-/i;

const KEEP =
  /Product_Shots|media3\.bsh-group\.com\/Images\/(?!150x)|jpg_zoom|produktbild_gross|appmifile\.com\/(?:mi-com-product\/fly-birds|webfile)|hausdorf\.ru\/upload\/iblock|st\.bork\.kz\/(?:components|original)|cloudfront\.net\/PDP|images\.icecat\.biz\/img\/gallery|media\.miele\.com\/dam\/|images\.samsung\.com\/is\/image|samsung\.com\/is\/image|aemassets\.lg\.com|lg\.com\/.+\/images\//;

const photos = JSON.parse(await readFile(FILE, "utf8"));
const CODES = {
  "bosch-gsn36ai3p": "GSN36AI3P",
  "siemens-hb675g0s1": "HB675G0S1",
  "siemens-ex877lyv5e": "EX877LYV5E",
  "bosch-dwk97jq60": "DWK97JQ60",
  "bosch-wgb256a40": "WGB256A40",
  "bosch-wtx87mh0by": "WTX87MH0",
  "bosch-ctl636es6": "CTL636ES6",
  "miele-wwg660": "WWG660",
  "samsung-vs20b95923n": "VS20B95923N",
  "samsung-dv90t8240sh": "DV90T8240SH",
  "xiaomi-tv-a-50-2025": "tv-a-2025",
  "haier-as25s2sf2fa": "AS25S2SF2FA",
  "electrolux-eacs-12hat": "EACS-12HAT",
  "electrolux-eoe8p31wx": "EOE8P31WX",
  "haier-hw90-b14ig": "HW90-B14IG",
  "electrolux-lft766x": "LFT766X",
};

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function abortAfter(ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  if (typeof timer.unref === "function") timer.unref();
  return { signal: ctrl.signal, done: () => clearTimeout(timer) };
}

function normalize(url) {
  let out = url.replace(/\\\//g, "/").replace(/\\u002F/g, "/").split("?")[0];
  if (out.startsWith("//")) out = `https:${out}`;
  if (out.startsWith("Product_Shots/")) out = `https://media3.bsh-group.com/${out}`;
  if (out.startsWith("Images/") && !out.includes("150x")) out = `https://media3.bsh-group.com/${out}`;
  return out;
}

function fromHtml(html, code) {
  const text = html.replace(/\\\//g, "/").replace(/\\u002F/g, "/");
  const raw = unique(
    [...text.matchAll(/(?:https?:)?\/\/[^"'\\\s<>]+\.(?:jpe?g|png|webp)|(?:Product_Shots|Images)\/[A-Za-z0-9._%-]+\.(?:jpe?g|png|webp)/gi)].map(
      (m) => normalize(m[0]),
    ),
  );
  const needle = String(code || "").replace(/[^A-Za-z0-9]/g, "").toLowerCase();
  return raw.filter((url) => {
    if (!KEEP.test(url) || SKIP.test(url)) return false;
    if (/Product_Shots/.test(url) && needle && !url.replace(/[^A-Za-z0-9]/g, "").toLowerCase().includes(needle)) {
      return false;
    }
    return true;
  });
}

async function fetchText(url) {
  const t = abortAfter(12000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
      redirect: "follow",
      signal: t.signal,
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  } finally {
    t.done();
  }
}

async function alive(url) {
  const t = abortAfter(7000);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA, Range: "bytes=0-400" },
      redirect: "follow",
      signal: t.signal,
    });
    const type = res.headers.get("content-type") || "";
    return (res.ok || res.status === 206) && /image|octet-stream|jpeg|png|webp/i.test(type);
  } catch {
    return false;
  } finally {
    t.done();
  }
}

async function persist() {
  await writeFile(FILE, JSON.stringify(photos, null, 2) + "\n");
}

for (const [id, pages] of Object.entries(PAGES)) {
  const current = photos[id] ?? [];
  if (current.length >= 4) continue;
  const found = [];
  for (const page of pages) {
    const html = await fetchText(page);
    if (html) found.push(...fromHtml(html, CODES[id]));
  }
  const extras = [];
  const pending = unique(found).filter((url) => !current.includes(url));
  for (let i = 0; i < pending.length && current.length + extras.length < MAX; i += 4) {
    const chunk = pending.slice(i, i + 4);
    const checks = await Promise.all(chunk.map(async (url) => ((await alive(url)) ? url : null)));
    for (const url of checks) {
      if (url && !extras.includes(url) && current.length + extras.length < MAX) extras.push(url);
    }
  }
  if (!extras.length) {
    console.log(`${id} 0 from ${pending.length} candidates`);
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
