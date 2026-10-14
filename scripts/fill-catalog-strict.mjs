import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "data", "generated", "catalog-covers.json");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const ACCESSORY =
  /kompatibel|compatible|akku|batterie|battery|filter|vhbw|techtek|ersatz|zubeh[oö]r|adapter|kabel|hose|beutel|patrone|kartusche|aktivkohle|ladeger[aä]t|charger|standfu[sß]|wallmount|wandhalter/i;

const BRAND_ALIAS = {
  "De'Longhi": "DeLonghi",
  BORK: "Bork",
};

const EXTRA_CODES = {
  "electrolux-eacs-12hat": ["EACS-12HAT/N3", "EACS-12HAT", "EACS12HATN3"],
  "xiaomi-smart-air-purifier-4-pro": ["AC-M15-SC", "BHR5062EU", "33664", "Mi Air Purifier 4 Pro"],
  "xiaomi-smart-humidifier-2": ["BHR6026EU", "CJXJSQ02ZM"],
  "xiaomi-tv-a-50-2025": ["L50MA-ASEU", "L50M8-A2EU", "TV A 50 2025"],
  "sony-k-85s30": ["K-85S30", "K-85S30BAEP", "XR85S30", "K85S30"],
  "sony-ht-a8000": ["HT-A8000", "HTA8000", "HT-A8000.CEL"],
  "samsung-rb38c7b5b12": ["RB38C7B5B12", "RB38C7B5B12/EF", "RB38C7B5B12U1"],
  "siemens-hb675g0s1": ["HB675G0S1"],
  "electrolux-eoe8p31wx": ["EOE8P31WX"],
  "bosch-dwk97jq60": ["DWK97JQ60"],
  "electrolux-lft766x": ["LFT766X"],
  "haier-hw90-b14ig": ["HW90-B14IG", "HW90-B14IG3", "HW90B14IG", "HW90-B14IGITU1"],
  "bosch-wtx87mh0by": ["WTX87MH0BY", "WTX87MH0"],
  "samsung-dv90t8240sh": ["DV90T8240SH", "DV90T8240SH/EU"],
  "delonghi-ecam22064": ["ECAM220.64.B", "ECAM22064B", "ECAM 220.64.B"],
  "bork-k811": ["K811"],
  "xiaomi-kettle-2-pro": ["BHR4198EU", "MJDSH04YM", "Smart Kettle 2 Pro"],
  "bork-b780": ["B780"],
  "samsung-vs20b95923n": ["VS20B95923N", "VS20B95923N/GE"],
  "xiaomi-x20-plus": ["BHR8124EU", "X20+", "Robot Vacuum X20+"],
  "samsung-vr50t95735w": ["VR50T95735W", "VR50T95735W/GE"],
};

const PRODUCT_PAGES = {
  "electrolux-eacs-12hat": [
    "https://e-catalog.co.uk/ELECTROLUX-EACS-12HAT-N3.htm",
    "https://ek.ua/ua/ELECTROLUX-EACS-12HAT-N3.htm",
    "https://www.eldorado.ru/cat/detail/split-sistema-electrolux-eacs-12hat-n3/",
  ],
  "xiaomi-smart-air-purifier-4-pro": [
    "https://www.mi.com/uk/product/xiaomi-smart-air-purifier-4-pro/",
    "https://www.mi.com/global/product/xiaomi-smart-air-purifier-4-pro/",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Xiaomi+Smart+Air+Purifier+4+Pro",
  ],
  "xiaomi-smart-humidifier-2": [
    "https://www.mi.com/uk/product/xiaomi-smart-humidifier-2/",
    "https://www.mi.com/global/product/xiaomi-smart-humidifier-2/",
  ],
  "xiaomi-tv-a-50-2025": [
    "https://www.mi.com/uk/product/xiaomi-tv-a-2025/",
    "https://www.mi.com/global/product/xiaomi-tv-a-2025/",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Xiaomi+TV+A+50+2025",
  ],
  "sony-k-85s30": [
    "https://www.sony.co.uk/electronics/tv/k-85s30",
    "https://electronics.sony.com/tv-video/televisions/all-tvs/p/k85s30",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Sony+K-85S30",
  ],
  "sony-ht-a8000": [
    "https://electronics.sony.com/audio/soundbars/all-soundbars/p/hta8000",
    "https://www.sony.co.uk/electronics/soundbars/ht-a8000",
    "https://www.idealo.de/preisvergleich/OffersOfProduct/205619030_-bravia-theatre-bar-8-einzel-sony.html",
  ],
  "samsung-rb38c7b5b12": [
    "https://www.samsung.com/ru/refrigerators/rb38c7b5b12/",
    "https://www.samsung.com/uk/search/?searchvalue=RB38C7B5B12",
    "https://www.mvideo.ru/products/holodilnik-samsung-rb38c7b5b12-400138123",
    "https://www.dns-shop.ru/search/?q=RB38C7B5B12",
  ],
  "siemens-hb675g0s1": [
    "https://www.siemens-home.bsh-group.com/de/product/HB675G0S1",
    "https://www.siemens-home.bsh-group.com/gb/en/product/HB675G0S1",
    "https://www.siemens-home.bsh-group.com/at/de/product/HB675G0S1",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Siemens+HB675G0S1",
  ],
  "electrolux-eoe8p31wx": [
    "https://www.electrolux.ru/kitchen/cooking/ovens/oven/eoe8p31wx/",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Electrolux+EOE8P31WX",
    "https://ek.ua/ua/ELECTROLUX-EOE8P31WX.htm",
  ],
  "bosch-dwk97jq60": [
    "https://www.bosch-home.com/de/de/product/DWK97JQ60",
    "https://www.bosch-home.com/gb/en/product/DWK97JQ60",
    "https://www.bosch-home.com/at/de/product/DWK97JQ60",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Bosch+DWK97JQ60",
  ],
  "electrolux-lft766x": [
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Electrolux+LFT766X+Dunstabzugshaube",
    "https://ek.ua/ua/ELECTROLUX-LFT766X.htm",
    "https://www.electrolux.de/kitchen/cooking/hoods/lft766x/",
  ],
  "haier-hw90-b14ig": [
    "https://www.haier-europe.com/en_GB/washing-machines/HW90-B14IG/",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Haier+HW90-B14IG",
    "https://ek.ua/ua/HAIER-HW90-B14IG.htm",
  ],
  "bosch-wtx87mh0by": [
    "https://www.bosch-home.com/by/ru/product/WTX87MH0BY",
    "https://www.bosch-home.com/de/de/product/WTX87MH0",
    "https://www.bosch-home.com/gb/en/product/WTX87MH0BY",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Bosch+WTX87MH0BY",
  ],
  "samsung-dv90t8240sh": [
    "https://www.samsung.com/uk/washers-and-dryers/tumble-dryers/dv90t8240sh/",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Samsung+DV90T8240SH",
    "https://ek.ua/ua/SAMSUNG-DV90T8240SH.htm",
  ],
  "delonghi-ecam22064": [
    "https://www.delonghi.com/en-gb/p/magnifica-start-ecam220.64.b/ECAM220.64.B.html",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=DeLonghi+ECAM220.64.B",
    "https://ek.ua/ua/DELONGHI-ECAM-220-64-B.htm",
  ],
  "bork-k811": [
    "https://www.bork.ru/eShop/Kettles/k811/",
    "https://www.bork.ru/search/?q=K811",
  ],
  "xiaomi-kettle-2-pro": [
    "https://www.mi.com/uk/product/xiaomi-smart-kettle-2-pro/",
    "https://www.mi.com/global/product/xiaomi-smart-kettle-2-pro/",
  ],
  "bork-b780": [
    "https://www.bork.ru/eShop/Blenders/b780/",
    "https://www.bork.ru/search/?q=B780",
  ],
  "samsung-vs20b95923n": [
    "https://www.samsung.com/uk/vacuum-cleaners/bespoke-jet/vs20b95923n/",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Samsung+VS20B95923N",
    "https://ek.ua/ua/SAMSUNG-VS20B95923N.htm",
  ],
  "xiaomi-x20-plus": [
    "https://www.mi.com/de/product/xiaomi-robot-vacuum-x20-plus/",
    "https://www.mi.com/uk/product/xiaomi-robot-vacuum-x20-plus/",
    "https://www.idealo.de/preisvergleich/OffersOfProduct/204202136_-robot-vacuum-x20-xiaomi.html",
  ],
  "samsung-vr50t95735w": [
    "https://www.samsung.com/uk/vacuum-cleaners/robot-vacuums/vr50t95735w/",
    "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Samsung+VR50T95735W+Jet+Bot",
    "https://ek.ua/ua/SAMSUNG-VR50T95735W.htm",
  ],
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function compact(value) {
  return String(value).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function filenameOf(url) {
  try {
    return decodeURIComponent(new URL(url).pathname.split("/").pop() || "");
  } catch {
    return url;
  }
}

function distinctiveTokens(model, extras = []) {
  const compactFull = compact(model);
  const first = compact(String(model).split(/\s+/)[0]);
  const codes = String(model).toUpperCase().match(/[A-Z]*\d+[A-Z0-9]*/g) || [];
  return unique([compactFull, first, ...codes.map(compact), ...extras.map(compact)]).filter((token) => {
    if (token === compactFull && token.length >= 4 && /\d/.test(token)) return true;
    if (token.length >= 6 && /\d/.test(token)) return true;
    if (token.length >= 12) return true;
    return false;
  });
}

function skuInText(text, model, extras = []) {
  const hay = compact(text);
  return distinctiveTokens(model, extras).some((token) => hay.includes(token));
}

function isExactCover(url, model, extras = []) {
  if (!url || !/^https?:\/\//i.test(url)) return false;
  if (ACCESSORY.test(url)) return false;
  if (/Feature_Icons|Line_Drawings|ENERGY_CLASS|energylabel|logo|icon|sprite/i.test(url)) return false;
  if (!/\.(jpe?g|png|webp)(\?|$)/i.test(url) && !/images\.samsung\.com|scene7|mi-img|appmifile|bsh-group|bosch-home|miele\.com/i.test(url)) {
    return false;
  }

  const file = compact(filenameOf(url));
  const hay = compact(url);

  if (/X20\+/i.test(model) || /X20PLUS/i.test(compact(model))) {
    return /X20PLUS|X20\+|X20-PLUS/.test(url.toUpperCase()) || /X20PLUS/.test(file);
  }
  if (/220\.64/i.test(model) || compact(model).includes("22064")) {
    return hay.includes("22064") && !hay.includes("22060");
  }

  const tokens = distinctiveTokens(model, extras);
  if (!tokens.length) return false;
  return tokens.some((token) => file.includes(token) || hay.includes(token));
}

function imagesFrom(html) {
  const raw = unique([
    ...[...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]),
    ...[...html.matchAll(/property=["']og:image["'][^>]*content=["']([^"']+)["']/gi)].map((m) => m[1]),
    ...[...html.matchAll(/content=["']([^"']+)["'][^>]*property=["']og:image["']/gi)].map((m) => m[1]),
    ...[...html.matchAll(/"image"\s*:\s*"(https?:[^"]+)"/gi)].map((m) => m[1]),
    ...[...html.matchAll(/srcset=["']([^"']+)["']/gi)].flatMap((m) =>
      m[1].split(",").map((part) => part.trim().split(/\s+/)[0]),
    ),
  ]).map((url) => url.replace(/&amp;/g, "&").split("?")[0]);
  return raw.filter((url) => /^https?:\/\//i.test(url));
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/json,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(18000),
    });
    if (!res.ok) return { status: res.status, html: "", finalUrl: url };
    return { status: res.status, html: await res.text(), finalUrl: res.url };
  } catch {
    return { status: 0, html: "", finalUrl: url };
  }
}

async function imageOk(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": UA,
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Range: "bytes=0-128",
        Referer: new URL(url).origin + "/",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    const type = res.headers.get("content-type") || "";
    return res.ok && (type.startsWith("image/") || type === "application/octet-stream" || !type);
  } catch {
    return false;
  }
}

async function fetchIcecat(brand, productCode) {
  const url = new URL("https://live.icecat.biz/api");
  url.searchParams.set("UserName", "openIcecat-live");
  url.searchParams.set("Language", "en");
  url.searchParams.set("Brand", brand);
  url.searchParams.set("ProductCode", productCode);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": UA },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.Code === 403 || json?.msg !== "OK" || !json?.data) return null;
    const high = json.data?.Image?.HighPic;
    const gallery = Array.isArray(json.data?.Gallery) ? json.data.Gallery : [];
    const pics = gallery
      .filter((item) => item?.Type !== "EnergyLabel" && item?.Pic)
      .sort((a, b) => Number(a.No ?? 99) - Number(b.No ?? 99))
      .map((item) => item.Pic);
    return unique([high, ...pics]).find((pic) => /^https:\/\/images\.icecat\.biz\//.test(pic)) || null;
  } catch {
    return null;
  }
}

async function fetchWikimedia(brand, model, extras) {
  const query = `${brand} ${model}`;
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("format", "json");
  api.searchParams.set("origin", "*");
  api.searchParams.set("generator", "search");
  api.searchParams.set("gsrnamespace", "6");
  api.searchParams.set("gsrlimit", "20");
  api.searchParams.set("gsrsearch", query);
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url|mime");
  api.searchParams.set("iiurlwidth", "1600");
  try {
    const res = await fetch(api, { headers: { "User-Agent": "BRIXON-catalog/1.0" }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    const json = await res.json();
    for (const page of Object.values(json.query?.pages ?? {})) {
      const title = page.title ?? "";
      const info = page.imageinfo?.[0];
      if (!info || !/^image\/(jpeg|png|webp)$/i.test(info.mime || "")) continue;
      const url = (info.thumburl || info.url || "").split("?")[0];
      if (skuInText(title, model, extras) || isExactCover(url, model, extras)) return url;
    }
  } catch {
    return null;
  }
  return null;
}

function pickFromPage(html, model, extras, pageUrl) {
  const urls = imagesFrom(html);
  const shots = urls.filter((url) => /\/Product_Shots\//i.test(url) && isExactCover(url, model, extras));
  const stp = shots.find((url) => /STP_def/i.test(url));
  if (stp) return stp;
  if (shots[0]) return shots[0];

  const miele = urls.find((url) => /miele\.com/i.test(url) && isExactCover(url, model, extras));
  if (miele) return miele;

  const exact = urls.find((url) => isExactCover(url, model, extras));
  if (exact) return exact;

  const pageHasSku = skuInText(pageUrl, model, extras) && !ACCESSORY.test(pageUrl);
  if (pageHasSku) {
    const og = urls.find((url) => /ogcdn|produktbild|Product_Shots|samsung\.com\/is\/image|mi-img|appmifile|scene7|st\.bork|images\.samsung|icecat/i.test(url));
    if (og && !ACCESSORY.test(og)) return og.split("?")[0];
  }
  return null;
}

async function idealoCover(brand, model, extras) {
  const queries = unique([
    `${brand} ${String(model).split(/\s+/)[0]}`,
    `${brand} ${model}`,
    ...(extras || []).slice(0, 2).map((code) => `${brand} ${code}`),
  ]);
  for (const q of queries) {
    const { html } = await fetchPage(
      `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${encodeURIComponent(q)}`,
    );
    const urls = imagesFrom(html).filter(
      (url) => /cdn\.idealo\.com\/folder\/Product/i.test(url) && /produktbild_(gross|mittelgross)/i.test(url),
    );
    const hit = urls.find((url) => isExactCover(url, model, extras));
    if (hit) return hit;
  }
  return null;
}

const covers = JSON.parse(await readFile(OUT, "utf8"));

const BAD_IDS = new Set([
  "electrolux-lft766x",
  "samsung-vr50t95735w",
  "delonghi-ecam22064",
  "xiaomi-x20-plus",
]);

for (const [id, row] of Object.entries(covers)) {
  if (!row.url) continue;
  if (BAD_IDS.has(id) || ACCESSORY.test(row.url) || !isExactCover(row.url, row.model, EXTRA_CODES[id] || [])) {
    if (row.source === "icecat-cache" || row.source === "icecat" || row.source === "manufacturer") continue;
    if (BAD_IDS.has(id) || ACCESSORY.test(row.url)) {
      covers[id] = { url: null, source: "miss", brand: row.brand, model: row.model, rejected: row.url };
    }
  }
}

const targets = Object.entries(covers).filter(([, row]) => !row.url);

for (const [id, row] of targets) {
  const extras = EXTRA_CODES[id] || [];
  const brand = BRAND_ALIAS[row.brand] ?? row.brand;
  process.stdout.write(`${id} ... `);
  let url = null;
  let source = "";

  for (const code of unique([row.model, ...extras])) {
    url = await fetchIcecat(brand, code);
    if (url) {
      source = "icecat";
      break;
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  if (!url) {
    for (const page of PRODUCT_PAGES[id] || []) {
      const { html, finalUrl } = await fetchPage(page);
      if (!html) continue;
      const picked = pickFromPage(html, row.model, extras, finalUrl);
      if (picked && (await imageOk(picked))) {
        url = picked.split("?")[0];
        source = /idealo/.test(page) ? "idealo" : "manufacturer";
        break;
      }
    }
  }

  if (!url) {
    url = await idealoCover(row.brand, row.model, extras);
    if (url && (await imageOk(url))) source = "idealo";
    else url = null;
  }

  if (!url) {
    url = await fetchWikimedia(row.brand, row.model, extras);
    if (url && (await imageOk(url))) source = "wikimedia-sku";
    else url = null;
  }

  if (url) {
    covers[id] = { url, source, brand: row.brand, model: row.model };
    console.log(`${source} ${url.slice(0, 90)}`);
    await writeFile(OUT, JSON.stringify(covers, null, 2) + "\n");
  } else {
    console.log("still miss");
  }
  await new Promise((r) => setTimeout(r, 250));
}

await writeFile(OUT, JSON.stringify(covers, null, 2) + "\n");
const ok = Object.values(covers).filter((item) => item.url).length;
console.log(`\nNow ${ok}/${Object.keys(covers).length}`);
for (const [id, row] of Object.entries(covers)) {
  if (!row.url) console.log(`MISS ${id} ${row.model}`);
}
