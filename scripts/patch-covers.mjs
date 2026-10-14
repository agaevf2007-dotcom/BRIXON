import { readFile, writeFile } from "node:fs/promises";

const PATH = "data/generated/catalog-covers.json";
const covers = JSON.parse(await readFile(PATH, "utf8"));

const PATCH = {
  "electrolux-eacs-12hat": ["https://e-catalog.co.uk/jpg_zoom1/801579.jpg", "ecatalog"],
  "xiaomi-smart-air-purifier-4-pro": [
    "https://i01.appmifile.com/webfile/globalimg/Iris/xiaomi-sap-4-pro.png",
    "manufacturer",
  ],
  "xiaomi-smart-humidifier-2": [
    "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-smart-humidifier-2/25418f65cb3dbed3d703467774113b60.jpg",
    "manufacturer",
  ],
  "xiaomi-tv-a-50-2025": ["https://e-catalog.co.uk/jpg_zoom1/2700483.jpg", "ecatalog"],
  "sony-ht-a8000": [
    "https://d1ncau8tqf99kp.cloudfront.net/PDP/Audio/Soundbars/HT-A8000/desktop/1.jpg",
    "manufacturer",
  ],
  "siemens-hb675g0s1": ["https://e-catalog.co.uk/jpg_zoom1/587279.jpg", "ecatalog"],
  "bosch-dwk97jq60": ["https://e-catalog.co.uk/jpg_zoom1/2403332.jpg", "ecatalog"],
  "electrolux-lft766x": ["https://e-catalog.co.uk/jpg_zoom1/1655309.jpg", "ecatalog"],
  "samsung-dv90t8240sh": ["https://e-catalog.co.uk/jpg_zoom1/1975853.jpg", "ecatalog"],
  "bork-k811": ["https://www.hausdorf.ru/upload/iblock/e95/chaynik_bork_k811_1.jpg", "manufacturer"],
  "xiaomi-kettle-2-pro": [
    "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-smart-kettle-2-pro/PC/1c36c4c46f5f0e450aa55446d540ef10.jpg",
    "manufacturer",
  ],
  "bork-b780": [
    "https://st.bork.kz/components/product/kitchen/blenders/b780/preview-mobile/b780.jpg",
    "manufacturer",
  ],
  "xiaomi-x20-plus": [
    "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-robot-vacuum-x20-plus/PC/8a77596fe32a7dcf65009683a3d1d81c.jpg",
    "manufacturer",
  ],
  "samsung-vr50t95735w": ["https://e-catalog.co.uk/jpg_zoom1/2050867.jpg", "ecatalog"],
  "sony-k-85s30": ["https://e-catalog.co.uk/jpg_zoom1/2904854.jpg", "ecatalog"],
  "bosch-wtx87mh0by": ["https://e-catalog.co.uk/jpg_zoom1/1815734.jpg", "ecatalog"],
  "sony-k-65xr90": [
    "https://cdn.idealo.com/folder/Product/204897/6/204897647/s1_produktbild_gross/sony-k-65xr90-65-zoll.jpg",
    "idealo",
  ],
  "haier-htw7720enmp": [
    "https://cdn.idealo.com/folder/Product/201639/8/201639851/s1_produktbild_gross/haier-htw7720enmp.jpg",
    "idealo",
  ],
  "miele-g7160": [
    "https://cdn.idealo.com/folder/Product/201281/9/201281905/s1_produktbild_gross/miele-g-7160-scvi.jpg",
    "idealo",
  ],
  "dyson-v15-detect": [
    "https://cdn.idealo.com/folder/Product/212246/3/212246371/s1_produktbild_gross/dyson-v15-detect-absolute-2026.jpg",
    "idealo",
  ],
};

async function icecat(brand, code) {
  const url = new URL("https://live.icecat.biz/api");
  url.searchParams.set("UserName", "openIcecat-live");
  url.searchParams.set("Language", "en");
  url.searchParams.set("Brand", brand);
  url.searchParams.set("ProductCode", code);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
    });
    const json = await res.json();
    return json?.data?.Image?.HighPic || null;
  } catch {
    return null;
  }
}

for (const [id, [url, source]] of Object.entries(PATCH)) {
  covers[id] = {
    url,
    source,
    brand: covers[id]?.brand,
    model: covers[id]?.model,
  };
}

const extraIcecat = [
  ["samsung-rb38c7b5b12", "Samsung", ["RB38C7B5B12", "RB38C7B5B12/WT", "RB38C7B5B12U1"]],
  ["electrolux-eoe8p31wx", "Electrolux", ["EOE8P31WX"]],
  ["delonghi-ecam22064", "DeLonghi", ["ECAM220.64.B", "ECAM22064B"]],
  ["samsung-vs20b95923n", "Samsung", ["VS20B95923N", "VS20B95923N/GE", "VS20B95923N/WT"]],
  ["haier-htw7720enmp", "Haier", ["HTW7720ENMP"]],
  ["haier-hw90-b14ig", "Haier", ["HW90-B14IG", "HW90-B14IG3"]],
  ["sony-k-65xr90", "Sony", ["K-65XR90"]],
];

for (const [id, brand, codes] of extraIcecat) {
  if (covers[id]?.url && covers[id].source === "icecat-cache") continue;
  for (const code of codes) {
    process.stdout.write(`icecat ${id} ${code} ... `);
    const hit = await icecat(brand, code);
    console.log(hit || "no");
    if (hit) {
      covers[id] = { url: hit, source: "icecat", brand: covers[id]?.brand, model: covers[id]?.model };
      break;
    }
  }
}

await writeFile(PATH, JSON.stringify(covers, null, 2) + "\n");
const miss = Object.entries(covers).filter(([, row]) => !row.url);
console.log(`\nCovers ${Object.keys(covers).length - miss.length}/${Object.keys(covers).length}`);
for (const [id, row] of miss) console.log(`MISS ${id} ${row.model}`);
