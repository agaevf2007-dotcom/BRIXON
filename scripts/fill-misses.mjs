import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_JSON = path.join(ROOT, "data", "generated", "icecat.json");
const PRODUCT_DIR = path.join(ROOT, "data", "products");

const TYPE_QUERY = {
  refrigerators: "refrigerator",
  freezers: "freezer",
  "washing-machines": "washing machine",
  dryers: "tumble dryer",
  dishwashers: "dishwasher",
  ovens: "oven",
  cooktops: "induction hob",
  microwaves: "microwave",
  hoods: "cooker hood",
  "air-conditioners": "air conditioner",
  "air-purifiers": "air purifier",
  humidifiers: "humidifier",
  "coffee-machines": "coffee machine",
  kettles: "kettle",
  blenders: "blender",
  mixers: "hand mixer",
  toasters: "toaster",
  "vacuum-cleaners": "vacuum cleaner",
  "robot-vacuums": "robot vacuum",
  televisions: "television",
  monitors: "computer monitor",
  soundbars: "soundbar",
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function extractProducts(source) {
  const products = [];
  const re =
    /id:\s*"([^"]+)"[\s\S]*?brand:\s*"([^"]+)"[\s\S]*?model:\s*"([^"]+)"[\s\S]*?category:\s*"([^"]+)"/g;
  let match;
  while ((match = re.exec(source))) {
    products.push({
      id: match[1],
      brand: match[2],
      model: match[3],
      category: match[4],
    });
  }
  return products;
}

async function wikimedia(query, used, limit = 8) {
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("format", "json");
  api.searchParams.set("origin", "*");
  api.searchParams.set("generator", "search");
  api.searchParams.set("gsrnamespace", "6");
  api.searchParams.set("gsrlimit", "16");
  api.searchParams.set("gsrsearch", query);
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url|mime");
  api.searchParams.set("iiurlwidth", "1600");
  const res = await fetch(api, {
    headers: { "User-Agent": "BRIXON-catalog/1.0 (educational retailer demo)" },
  });
  if (!res.ok) return [];
  const json = await res.json();
  const urls = [];
  for (const page of Object.values(json.query?.pages ?? {})) {
    const info = page.imageinfo?.[0];
    if (!info || !/^image\/(jpeg|png|webp)$/i.test(info.mime || "")) continue;
    const url = info.thumburl || info.url;
    if (!url || used.has(url)) continue;
    used.add(url);
    urls.push(url);
    if (urls.length >= limit) break;
  }
  return urls;
}

const { readdir } = await import("node:fs/promises");
const files = (await readdir(PRODUCT_DIR)).filter(
  (name) => name.endsWith(".ts") && name !== "_shared.ts" && name !== "index.ts",
);
const catalog = [];
for (const file of files) {
  catalog.push(...extractProducts(await readFile(path.join(PRODUCT_DIR, file), "utf8")));
}

const results = JSON.parse(await readFile(OUT_JSON, "utf8"));
const used = new Set(
  Object.values(results).flatMap((row) => (row.ok ? row.images ?? [] : [])),
);

for (const product of catalog) {
  const row = results[product.id];
  const have = row?.ok ? row.images?.length ?? 0 : 0;
  if (have >= 4) continue;

  const queries = unique([
    `${product.brand} ${product.model}`,
    `${product.brand} ${product.model.split(/[\s/]/)[0]}`,
    `${product.brand} ${TYPE_QUERY[product.category] ?? product.category}`,
  ]);
  let images = [...(row?.images ?? [])];
  for (const query of queries) {
    const extra = await wikimedia(query, used, 6 - images.length);
    images = unique([...images, ...extra]);
    if (images.length >= 4) break;
    await new Promise((r) => setTimeout(r, 250));
  }

  if (images.length) {
    results[product.id] = {
      ...product,
      ok: true,
      source: have ? row.source : "wikimedia",
      images: images.slice(0, 6),
    };
    console.log(`${product.id} -> ${images.length} photos`);
  } else {
    console.log(`${product.id} still empty`);
  }
}

await writeFile(OUT_JSON, JSON.stringify(results, null, 2));
const ok = Object.values(results).filter((item) => item.ok && (item.images?.length ?? 0) >= 2).length;
console.log(`\nWith 2+ photos: ${ok}/${catalog.length}`);
