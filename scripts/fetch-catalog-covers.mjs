import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "data", "generated", "catalog-covers.json");
const PRODUCT_DIR = path.join(ROOT, "data", "products");
const ICECAT_JSON = path.join(ROOT, "data", "generated", "icecat.json");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const BRAND_ALIAS = {
  "De'Longhi": "DeLonghi",
  BORK: "Bork",
};

const CODE_OVERRIDES = {
  "samsung-ue43cu7100": ["UE43CU7100", "UE43CU7100KXXU", "UE43CU7100UXRU"],
  "xiaomi-tv-a-50-2025": ["L50MA-ASEU", "L50M8-A2EU", "TV A 50 2025"],
  "samsung-qe55q80d": ["QE55Q80DATXXH", "QE55Q80D"],
  "lg-oled65c4": ["OLED65C44LA", "OLED65C4"],
  "sony-k-65xr90": ["K-65XR90", "XR65BR90"],
  "lg-oled77c4": ["OLED77C44LA", "OLED77C4"],
  "samsung-qe75qn90d": ["QE75QN90DATXXH", "QE75QN90D"],
  "sony-k-85s30": ["K-85S30", "K-85S30BAEP", "XR85S30"],
  "samsung-ls27cg510eu": ["LS27CG510EU", "LS27CG510EUXEN"],
  "lg-27gr83q": ["27GR83Q-B", "27GR83QB"],
  "sony-ht-a8000": ["HT-A8000", "HTA8000"],
  "samsung-hw-q990d": ["HW-Q990D", "HW-Q990D/EN", "HW-Q990D/XU"],
  "philips-ep3347": ["EP3347/90", "EP3347"],
  "bosch-ctl636es6": ["CTL636ES6"],
  "delonghi-ecam22064": ["ECAM220.64.B", "ECAM22064B", "0132218046"],
  "bork-k811": ["K811"],
  "xiaomi-kettle-2-pro": ["BHR4198EU", "MJDSH04YM", "Kettle 2 Pro"],
  "philips-hr3652": ["HR3652/00", "HR3652"],
  "bork-b780": ["B780"],
  "bosch-mfq36400": ["MFQ36400"],
  "philips-hd2581": ["HD2581/00", "HD2581"],
  "dyson-v15-detect": ["447000-01", "SV22", "V15 Detect Absolute"],
  "samsung-vs20b95923n": ["VS20B95923N", "VS20B95923N/GE"],
  "xiaomi-x20-plus": ["BHR8124EU", "X20+", "Robot Vacuum X20+"],
  "samsung-vr50t95735w": ["VR50T95735W", "VR50T95735W/GE"],
  "haier-as25s2sf2fa": ["AS25S2SF2FA-G", "AS25S2SF2FA"],
  "electrolux-eacs-12hat": ["EACS-12HAT/N3", "EACS-12HAT"],
  "xiaomi-smart-air-purifier-4-pro": ["AC-M15-SC", "BHR5062EU", "33664"],
  "philips-ac3033": ["AC3033/30", "AC3033"],
  "xiaomi-smart-humidifier-2": ["BHR6026EU", "CJXJSQ02ZM"],
  "philips-hu4816": ["HU4816/10", "HU4816"],
  "miele-wwg660": ["WWG660 WCS", "WWG660WCS", "WWG660"],
  "miele-g7160": ["G 7160 SCVi", "G7160SCVi", "G7160"],
  "bosch-wgb256a40": ["WGB256A40"],
  "haier-hw90-b14ig": ["HW90-B14IG", "HW90-B14IG3", "HW90B14IG"],
  "electrolux-ew8f229s": ["EW8F229SP", "EW8F229S"],
  "bosch-wtx87mh0by": ["WTX87MH0BY", "WTX87MH0"],
  "samsung-dv90t8240sh": ["DV90T8240SH", "DV90T8240SH/EU", "DV90T8240SHEU"],
  "samsung-rb38c7b5b12": ["RB38C7B5B12", "RB38C7B5B12/EF", "RB38C7B5B12U1"],
  "bosch-kgn39aiat": ["KGN39AIAT"],
  "bosch-gsn36ai3p": ["GSN36AI3P"],
  "bosch-sms8yci01e": ["SMS8YCI01E"],
  "bosch-hsg636bs1": ["HSG636BS1"],
  "bosch-pxx675dc1e": ["PXX675DC1E"],
  "bosch-bel554ms0": ["BEL554MS0"],
  "bosch-dwk97jq60": ["DWK97JQ60"],
  "siemens-hb675g0s1": ["HB675G0S1"],
  "siemens-ex877lyv5e": ["EX877LYV5E"],
  "electrolux-eoe8p31wx": ["EOE8P31WX"],
  "electrolux-lft766x": ["LFT766X"],
  "haier-htw7720enmp": ["HTW7720ENMP"],
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function compact(value) {
  return String(value).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function codesFor(id, model) {
  const raw = model.trim();
  return unique([
    ...(CODE_OVERRIDES[id] ?? []),
    raw,
    raw.replace(/\s+/g, ""),
    raw.split("/")[0].trim(),
    raw.split(/\s+/)[0],
  ]);
}

function extractProducts(source) {
  const products = [];
  const re = /id:\s*"([^"]+)"[\s\S]*?brand:\s*"([^"]+)"[\s\S]*?model:\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(source))) {
    products.push({ id: match[1], brand: match[2], model: match[3] });
  }
  return products;
}

function skuInUrl(url, model) {
  const hay = compact(url);
  const token = compact(model);
  if (token.length >= 6 && hay.includes(token)) return true;
  const parts = String(model)
    .toUpperCase()
    .split(/[^A-Z0-9]+/)
    .filter((part) => part.length >= 5 && /\d/.test(part));
  return parts.some((part) => hay.includes(part));
}

function isPackshotUrl(url, model) {
  if (!url) return false;
  if (/Feature_Icons|Line_Drawings|ENERGY_CLASS|logo|icon/i.test(url)) return false;
  if (/images\.icecat\.biz\/img\/gallery/i.test(url)) return true;
  if (/\/Product_Shots\//i.test(url) && skuInUrl(url, model)) return true;
  if (skuInUrl(url, model) && /\.(jpe?g|png|webp)(\?|$)/i.test(url)) return true;
  return false;
}

function pickFromHtml(html, model) {
  const urls = unique(
    [...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map((match) => match[0]),
  );
  const shots = urls.filter((url) => /\/Product_Shots\//i.test(url) && skuInUrl(url, model));
  const stp = shots.find((url) => /STP_def/i.test(url));
  if (stp) return stp;
  if (shots[0]) return shots[0];
  return urls.find((url) => isPackshotUrl(url, model));
}

async function headOk(url) {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      headers: { "User-Agent": UA, Accept: "image/*" },
      redirect: "follow",
    });
    const type = res.headers.get("content-type") || "";
    if (res.ok && type.startsWith("image/")) return true;
    if (res.ok && !type) return true;
  } catch {
    // ignore
  }
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA, Accept: "image/*", Range: "bytes=0-64" },
      redirect: "follow",
    });
    const type = res.headers.get("content-type") || "";
    return res.ok && (type.startsWith("image/") || type === "application/octet-stream");
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
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": UA } });
  if (!res.ok) return null;
  const json = await res.json();
  if (json?.Code === 403 || json?.msg !== "OK" || !json?.data) return null;
  const high = json.data?.Image?.HighPic;
  const gallery = Array.isArray(json.data?.Gallery) ? json.data.Gallery : [];
  const pics = gallery
    .filter((item) => item?.Type !== "EnergyLabel" && item?.Pic)
    .sort((a, b) => Number(a.No ?? 99) - Number(b.No ?? 99))
    .map((item) => item.Pic);
  return unique([high, ...pics]).find((pic) => /^https:\/\/images\.icecat\.biz\//.test(pic));
}

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
    redirect: "follow",
  });
  if (!res.ok) return "";
  return res.text();
}

function manufacturerPages(brand, model) {
  const code = model.split(/[\s/]/)[0];
  if (brand === "Bosch") {
    return [
      `https://www.bosch-home.com/mt/en/mkt-product/${code}`,
      `https://www.bosch-home.com/de/de/product/${code}`,
      `https://www.bosch-home.com/gb/en/product/${code}`,
    ];
  }
  if (brand === "Siemens") {
    return [
      `https://www.siemens-home.bsh-group.com/mt/en/mkt-product/${code}`,
      `https://www.siemens-home.bsh-group.com/de/product/${code}`,
      `https://www.siemens-home.bsh-group.com/gb/en/product/${code}`,
    ];
  }
  if (brand === "Miele") {
    return [
      `https://www.miele.de/de/c/${encodeURIComponent(code)}.htm`,
      `https://www.miele.com/en-gb/c/${encodeURIComponent(code)}`,
    ];
  }
  if (brand === "Samsung") {
    return [`https://www.samsung.com/uk/search/?searchvalue=${encodeURIComponent(code)}`];
  }
  if (brand === "LG") {
    return [`https://www.lg.com/uk/search/?searchId=${encodeURIComponent(code)}`];
  }
  if (brand === "Sony") {
    return [`https://www.sony.co.uk/search?query=${encodeURIComponent(model)}`];
  }
  if (brand === "Dyson") {
    return [`https://www.dyson.co.uk/vacuum-cleaners/cordless/dyson-v15-detect`];
  }
  if (brand === "Electrolux") {
    return [`https://www.electrolux.co.uk/search/?q=${encodeURIComponent(code)}`];
  }
  if (brand === "Haier") {
    return [`https://www.haier.com/uk/search/?q=${encodeURIComponent(code)}`];
  }
  if (brand === "De'Longhi") {
    return [`https://www.delonghi.com/en-gb/search?q=${encodeURIComponent(code)}`];
  }
  if (brand === "Xiaomi") {
    return [`https://www.mi.com/uk/search?keyword=${encodeURIComponent(model)}`];
  }
  if (brand === "Philips") {
    return [`https://www.philips.co.uk/c-m-ho/search/${encodeURIComponent(code)}`];
  }
  return [];
}

async function fetchManufacturer(brand, model) {
  for (const page of manufacturerPages(brand, model)) {
    try {
      const html = await fetchPage(page);
      if (!html) continue;
      const picked = pickFromHtml(html, model);
      if (picked && (await headOk(picked))) return picked;
    } catch {
      // next page
    }
  }
  return null;
}

async function fetchWikimediaStrict(brand, model) {
  const token = compact(model);
  if (token.length < 5 && !/\d/.test(model)) return null;
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
  const res = await fetch(api, { headers: { "User-Agent": "BRIXON-catalog/1.0" } });
  if (!res.ok) return null;
  const json = await res.json();
  for (const page of Object.values(json.query?.pages ?? {})) {
    const title = page.title ?? "";
    const info = page.imageinfo?.[0];
    if (!info || !/^image\/(jpeg|png|webp)$/i.test(info.mime || "")) continue;
    const url = info.thumburl || info.url;
    if (!url) continue;
    if (skuInUrl(title, model) || skuInUrl(url, model)) return url.split("?")[0];
  }
  return null;
}

const files = (await readdir(PRODUCT_DIR)).filter(
  (name) => name.endsWith(".ts") && name !== "_shared.ts" && name !== "index.ts",
);
const products = [];
for (const file of files) {
  const source = await readFile(path.join(PRODUCT_DIR, file), "utf8");
  products.push(...extractProducts(source));
}

let existingIcecat = {};
try {
  existingIcecat = JSON.parse(await readFile(ICECAT_JSON, "utf8"));
} catch {
  existingIcecat = {};
}

const covers = {};
for (const product of products) {
  const brand = BRAND_ALIAS[product.brand] ?? product.brand;
  const codes = codesFor(product.id, product.model);
  process.stdout.write(`${product.id} ... `);

  const existing = existingIcecat[product.id];
  const existingIcecatPic = Array.isArray(existing?.images)
    ? existing.images.find((url) => /^https:\/\/images\.icecat\.biz\//.test(url))
    : null;

  let url = null;
  let source = "";

  if (existingIcecatPic && existing?.source === "icecat") {
    url = existingIcecatPic.split("?")[0];
    source = "icecat-cache";
  }

  if (!url) {
    for (const code of codes) {
      try {
        const hit = await fetchIcecat(brand, code);
        if (hit) {
          url = hit;
          source = "icecat";
          break;
        }
      } catch {
        // next code
      }
      await new Promise((r) => setTimeout(r, 180));
    }
  }

  if (!url) {
    url = await fetchManufacturer(product.brand, product.model);
    if (url) source = "manufacturer";
  }

  if (!url) {
    url = await fetchWikimediaStrict(product.brand, product.model);
    if (url) source = "wikimedia-sku";
  }

  if (url && !(await headOk(url))) {
    url = null;
    source = "";
  }

  covers[product.id] = url
    ? { url, source, brand: product.brand, model: product.model }
    : { url: null, source: "miss", brand: product.brand, model: product.model, tried: codes };

  console.log(url ? `${source}` : "MISS");
  await new Promise((r) => setTimeout(r, 220));
}

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(covers, null, 2) + "\n");
const ok = Object.values(covers).filter((row) => row.url).length;
console.log(`\nSaved ${ok}/${products.length} catalog covers`);
