import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_JSON = path.join(ROOT, "data", "generated", "icecat.json");
const PRODUCT_DIR = path.join(ROOT, "data", "products");

const BRAND_ALIAS = {
  "De'Longhi": "DeLonghi",
  BORK: "Bork",
};

const CODE_OVERRIDES = {
  "samsung-ue43cu7100": ["UE43CU7100", "UE43CU7100KXXU", "UE43CU7100UXRU"],
  "xiaomi-tv-a-50-2025": ["L50MA-ASEU", "TV A 50", "A 50 2025"],
  "samsung-qe55q80d": ["QE55Q80DATXXH", "QE55Q80D"],
  "lg-oled65c4": ["OLED65C44LA", "OLED65C4PLA", "OLED65C4"],
  "sony-k-65xr90": ["K-65XR90", "XR65BR90", "XR-65BR90"],
  "lg-oled77c4": ["OLED77C44LA", "OLED77C4PLA", "OLED77C4"],
  "samsung-qe75qn90d": ["QE75QN90DATXXH", "QE75QN90D"],
  "sony-k-85s30": ["K-85S30", "K-85S30BRAVIA3", "XR85S30"],
  "samsung-ls27cg510eu": ["LS27CG510EU", "LS27CG510EUXEN"],
  "lg-27gr83q": ["27GR83Q-B", "27GR83QB"],
  "sony-ht-a8000": ["HT-A8000", "HTA8000"],
  "samsung-hw-q990d": ["HW-Q990D", "HW-Q990D/EN"],
  "philips-ep3347": ["EP3347/90", "EP3347"],
  "bosch-ctl636es6": ["CTL636ES6"],
  "delonghi-ecam22064": ["ECAM220.64.B", "ECAM22064B", "ECAM 220.64.B"],
  "bork-k811": ["K811"],
  "xiaomi-kettle-2-pro": ["BHR4198EU", "Kettle 2 Pro", "MJDSH04YM"],
  "philips-hr3652": ["HR3652/00", "HR3652"],
  "bork-b780": ["B780"],
  "bosch-mfq36400": ["MFQ36400"],
  "philips-hd2581": ["HD2581/00", "HD2581"],
  "dyson-v15-detect": ["447000-01", "V15 Detect Absolute", "SV22", "V15 Detect"],
  "samsung-vs20b95923n": ["VS20B95923N", "VS20B95923N/GE"],
  "xiaomi-x20-plus": ["X20+", "BHR8124EU", "Robot Vacuum X20+"],
  "samsung-vr50t95735w": ["VR50T95735W"],
  "haier-as25s2sf2fa": ["AS25S2SF2FA-G", "AS25S2SF2FA"],
  "electrolux-eacs-12hat": ["EACS-12HAT/N3", "EACS-12HAT"],
  "xiaomi-smart-air-purifier-4-pro": ["AC-M15-SC", "BHR5062EU", "33664", "Mi Air Purifier 4 Pro"],
  "philips-ac3033": ["AC3033/30", "AC3033/10", "AC3033"],
  "xiaomi-smart-humidifier-2": ["BHR6026EU", "Smart Humidifier 2"],
  "philips-hu4816": ["HU4816/10", "HU4816"],
  "miele-wwg660": ["WWG660 WCS", "WWG 660 WCS", "WWG660"],
  "miele-g7160": ["G 7160 SCVi", "G7160SCVi", "G7160"],
  "bosch-wgb256a40": ["WGB256A40"],
  "haier-hw90-b14ig": ["HW90-B14IG", "HW90B14IG"],
  "electrolux-ew8f229s": ["EW8F229SP", "EW8F229S"],
  "bosch-wtx87mh0by": ["WTX87MH0BY", "WTX87MH0"],
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function codesFor(id, model) {
  const overrides = CODE_OVERRIDES[id] ?? [];
  const raw = model.trim();
  return unique([
    ...overrides,
    raw,
    raw.replace(/\s+/g, ""),
    raw.split("/")[0].trim(),
    raw.split(/\s+/)[0],
    raw.replace(/[^A-Za-z0-9./-]/g, ""),
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

function galleryFrom(data) {
  const items = Array.isArray(data?.Gallery) ? data.Gallery : [];
  const pics = items
    .filter((item) => item?.Type !== "EnergyLabel" && item?.Pic)
    .sort((a, b) => Number(a.No ?? 99) - Number(b.No ?? 99))
    .map((item) => item.Pic);
  const high = data?.Image?.HighPic;
  return unique([high, ...pics]).slice(0, 6);
}

async function fetchIcecat(brand, productCode) {
  const url = new URL("https://live.icecat.biz/api");
  url.searchParams.set("UserName", "openIcecat-live");
  url.searchParams.set("Language", "en");
  url.searchParams.set("Brand", brand);
  url.searchParams.set("ProductCode", productCode);
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "BRIXON-catalog/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json?.Code === 403 || json?.msg !== "OK" || !json?.data) return null;
  const images = galleryFrom(json.data);
  if (!images.length) return null;
  return {
    images,
    title: json.data.GeneralInfo?.Title ?? "",
    gtin: json.data.GeneralInfo?.GTIN?.[0] ?? "",
    productCode,
  };
}

async function fetchWikimedia(brand, model, used) {
  const queries = unique([`${brand} ${model}`, `${brand} ${String(model).split(/[\s/]/)[0]}`]);
  const urls = [];
  for (const query of queries) {
    const api = new URL("https://commons.wikimedia.org/w/api.php");
    api.searchParams.set("action", "query");
    api.searchParams.set("format", "json");
    api.searchParams.set("origin", "*");
    api.searchParams.set("generator", "search");
    api.searchParams.set("gsrnamespace", "6");
    api.searchParams.set("gsrlimit", "12");
    api.searchParams.set("gsrsearch", query);
    api.searchParams.set("prop", "imageinfo");
    api.searchParams.set("iiprop", "url|mime");
    api.searchParams.set("iiurlwidth", "1600");
    const res = await fetch(api, {
      headers: { "User-Agent": "BRIXON-catalog/1.0 (educational retailer demo)" },
    });
    if (!res.ok) continue;
    const json = await res.json();
    const pages = Object.values(json.query?.pages ?? {});
    for (const page of pages) {
      const info = page.imageinfo?.[0];
      if (!info || !/^image\/(jpeg|png|webp)$/i.test(info.mime || "")) continue;
      const url = info.thumburl || info.url;
      if (!url || used.has(url)) continue;
      used.add(url);
      urls.push(url);
      if (urls.length >= 6) return urls;
    }
  }
  return urls;
}

async function resolveProduct(product, used) {
  const brand = BRAND_ALIAS[product.brand] ?? product.brand;
  const codes = codesFor(product.id, product.model);
  for (const code of codes) {
    try {
      const hit = await fetchIcecat(brand, code);
      if (hit?.images?.length) {
        hit.images.forEach((url) => used.add(url));
        if (hit.images.length < 4) {
          const extra = await fetchWikimedia(product.brand, product.model, used);
          hit.images = unique([...hit.images, ...extra]).slice(0, 6);
        }
        return { ok: true, brand, source: "icecat", ...hit };
      }
    } catch {
      // try next code
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  const wiki = await fetchWikimedia(product.brand, product.model, used);
  if (wiki.length) {
    return {
      ok: true,
      brand,
      source: "wikimedia",
      images: wiki.slice(0, 6),
      title: "",
      gtin: "",
      productCode: product.model,
    };
  }
  return { ok: false, brand, tried: codes };
}

const files = (await readdir(PRODUCT_DIR)).filter(
  (name) => name.endsWith(".ts") && name !== "_shared.ts" && name !== "index.ts",
);
const products = [];
for (const file of files) {
  const source = await readFile(path.join(PRODUCT_DIR, file), "utf8");
  products.push(...extractProducts(source));
}

const used = new Set();
const results = {};
for (const product of products) {
  process.stdout.write(`${product.id} ... `);
  const resolved = await resolveProduct(product, used);
  results[product.id] = { ...product, ...resolved };
  console.log(resolved.ok ? `${resolved.images.length} photos (${resolved.source})` : "MISS");
  await new Promise((r) => setTimeout(r, 280));
}

await mkdir(path.dirname(OUT_JSON), { recursive: true });
await writeFile(OUT_JSON, JSON.stringify(results, null, 2));
const ok = Object.values(results).filter((item) => item.ok).length;
console.log(`\nSaved ${ok}/${products.length} to ${OUT_JSON}`);
