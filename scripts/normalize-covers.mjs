import { readFile, writeFile } from "node:fs/promises";

const PATH = "data/generated/catalog-covers.json";
const covers = JSON.parse(await readFile(PATH, "utf8"));

for (const [id, row] of Object.entries(covers)) {
  if (row.sourceUrl && String(row.url || "").startsWith("/catalog/")) {
    row.url = row.sourceUrl;
    delete row.sourceUrl;
    delete row.bytes;
  }
}

const BAD = {
  "samsung-rb38c7b5b12": true,
  "electrolux-eoe8p31wx": true,
  "delonghi-ecam22064": true,
  "samsung-vs20b95923n": true,
};
for (const id of Object.keys(BAD)) {
  covers[id].url = null;
  covers[id].source = "miss";
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        Accept: "text/html,image/*",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    return { status: res.status, text: await res.text(), finalUrl: res.url, type: res.headers.get("content-type") };
  } catch (error) {
    return { status: 0, text: "", finalUrl: url, error: String(error.message || error) };
  }
}

const probes = [
  ["samsung-rb38c7b5b12", "RB38C7B5B12", [
    "https://e-catalog.co.uk/SAMSUNG-RB38C7B5B12-WT.htm",
    "https://e-catalog.co.uk/SAMSUNG-RB38C7B5B22.htm",
    "https://www.dns-shop.ru/search/?q=RB38C7B5B12",
    "https://www.mvideo.ru/product-list-page?q=RB38C7B5B12",
    "https://www.samsung.com/uk/refrigerators/rb38c7b5b12/",
    "https://images.samsung.com/is/image/samsung/p6pim/ru/rb38c7b5b12/gallery/ru-bottom-mount-freezer-rb38c7b5b12-front-white.jpg",
  ]],
  ["electrolux-eoe8p31wx", "EOE8P31WX", [
    "https://e-catalog.co.uk/ELECTROLUX-EOE8P31W.htm",
    "https://www.electrolux.ru/kitchen/cooking/ovens/oven/eoe8p31wx/",
    "https://www.holodilnik.ru/built-in/electric_ovens/electrolux/eoe8p31wx/",
    "https://www.mvideo.ru/products/duhovoi-shkaf-electrolux-eoe8p31wx-400000000",
  ]],
  ["delonghi-ecam22064", "22064", [
    "https://e-catalog.co.uk/DELONGHI-ECAM220-64.htm",
    "https://www.holodilnik.ru/kitchentech/coffee_machines/delonghi/ecam220.64.b/",
    "https://delonghi.ru/search/?q=ECAM220.64",
    "https://www.citilink.ru/search/?text=ECAM220.64.B",
  ]],
  ["samsung-vs20b95923n", "VS20B95923N", [
    "https://e-catalog.co.uk/SAMSUNG-VS20B95923N-WT.htm",
    "https://e-catalog.co.uk/SAMSUNG-VS20B95923W.htm",
    "https://www.samsung.com/uk/vacuum-cleaners/stick-vacuum/bespoke-jet-vs20b95923n/",
    "https://images.samsung.com/is/image/samsung/p6pim/uk/vs20b95923n/gallery/uk-bespoke-jet-vs20b95923n-vs20b95923n-front-white.jpg",
    "https://www.mvideo.ru/product-list-page?q=VS20B95923N",
  ]],
];

for (const [id, token, urls] of probes) {
  console.log(`\n${id}`);
  for (const url of urls) {
    const { status, text, finalUrl, type, error } = await fetchPage(url);
    const title = (text.match(/<title>([^<]+)/i) || [])[1] || error || type || "";
    const og = [
      ...text.matchAll(/property=["']og:image["'][^>]*content=["']([^"']+)["']/gi),
      ...text.matchAll(/jpg_zoom1\/(\d+)\.jpg/gi),
    ];
    console.log(`  ${status} ${title.slice(0, 70)}`);
    console.log(`    ${finalUrl.slice(0, 100)}`);
    if (type?.startsWith("image/")) {
      covers[id] = { ...covers[id], url, source: "manufacturer" };
      console.log("    IMAGE HIT");
      break;
    }
    const zoom = [...text.matchAll(/jpg_zoom1\/(\d+)\.jpg/gi)][0];
    if (zoom && /e-catalog/.test(finalUrl) && new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(title + finalUrl)) {
      const img = `https://e-catalog.co.uk/jpg_zoom1/${zoom[1]}.jpg`;
      covers[id] = { ...covers[id], url: img, source: "ecatalog" };
      console.log(`    ZOOM ${img}`);
      break;
    }
    for (const m of og.slice(0, 2)) console.log(`    ${m[1] || m[0]}`);
  }
}

await writeFile(PATH, JSON.stringify(covers, null, 2) + "\n");
const miss = Object.entries(covers).filter(([, row]) => !row.url);
console.log(`\nNow ${Object.keys(covers).length - miss.length}/${Object.keys(covers).length}`);
for (const [id, row] of miss) console.log("MISS", id, row.model);
