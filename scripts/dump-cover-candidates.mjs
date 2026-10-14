import { readFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

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

function primarySku(model) {
  const codes = String(model).toUpperCase().match(/[A-Z]*\d+[A-Z0-9.+]*/g) || [];
  codes.sort((a, b) => compact(b).length - compact(a).length);
  return compact(codes[0] || model);
}

function imagesFrom(html) {
  return [...new Set([...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0].replace(/&amp;/g, "&").split("?")[0]))];
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/json" },
      redirect: "follow",
      signal: AbortSignal.timeout(18000),
    });
    const text = res.ok ? await res.text() : "";
    return { status: res.status, text, finalUrl: res.url };
  } catch (error) {
    return { status: 0, text: "", finalUrl: url, error: String(error) };
  }
}

const covers = JSON.parse(await readFile("data/generated/catalog-covers.json", "utf8"));

const misses = [
  "electrolux-eacs-12hat",
  "xiaomi-smart-air-purifier-4-pro",
  "xiaomi-tv-a-50-2025",
  "sony-k-85s30",
  "samsung-rb38c7b5b12",
  "siemens-hb675g0s1",
  "electrolux-eoe8p31wx",
  "bosch-dwk97jq60",
  "electrolux-lft766x",
  "bosch-wtx87mh0by",
  "samsung-dv90t8240sh",
  "delonghi-ecam22064",
  "bork-k811",
  "xiaomi-kettle-2-pro",
  "bork-b780",
  "samsung-vs20b95923n",
  "xiaomi-x20-plus",
  "samsung-vr50t95735w",
];

function matchSku(url, model) {
  const sku = primarySku(model);
  const file = compact(filenameOf(url));
  const hay = compact(url);
  if (sku.length < 4) return false;
  if (/X20/.test(model) && /\+/.test(model)) return /X20PLUS|X20-PLUS/.test(hay);
  return file.includes(sku) || hay.includes(sku);
}

for (const id of misses) {
  const row = covers[id];
  if (!row) continue;
  const sku = primarySku(row.model);
  const brand = row.brand === "De'Longhi" ? "DeLonghi" : row.brand;
  console.log(`\n===== ${id}  sku=${sku}  model=${row.model}`);

  const icecatUrl = new URL("https://live.icecat.biz/api");
  icecatUrl.searchParams.set("UserName", "openIcecat-live");
  icecatUrl.searchParams.set("Language", "en");
  icecatUrl.searchParams.set("Brand", brand === "BORK" ? "Bork" : brand);
  icecatUrl.searchParams.set("ProductCode", row.model.split(/\s+/)[0]);
  const ice = await fetchPage(icecatUrl);
  try {
    const json = JSON.parse(ice.text || "{}");
    const high = json?.data?.Image?.HighPic;
    console.log(`  icecat ${ice.status} high=${high || json?.msg || json?.Code || "none"}`);
  } catch {
    console.log(`  icecat ${ice.status} not-json`);
  }

  const queries = [
    `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${encodeURIComponent(`${row.brand} ${sku}`)}`,
    `https://ek.ua/search.xml?search_=${encodeURIComponent(`${row.brand} ${row.model}`)}`,
    `https://www.geizhals.de/?fs=${encodeURIComponent(`${row.brand} ${sku}`)}`,
  ];

  if (brand === "Xiaomi") {
    queries.push(`https://www.mi.com/uk/search?keyword=${encodeURIComponent(row.model)}`);
  }
  if (brand === "BORK") {
    queries.push(`https://www.bork.ru/search/?q=${encodeURIComponent(sku)}`);
  }

  const commons = new URL("https://commons.wikimedia.org/w/api.php");
  commons.searchParams.set("action", "query");
  commons.searchParams.set("format", "json");
  commons.searchParams.set("list", "search");
  commons.searchParams.set("srnamespace", "6");
  commons.searchParams.set("srlimit", "8");
  commons.searchParams.set("srsearch", `${row.brand} ${sku}`);
  queries.push(commons.toString());

  for (const page of queries) {
    const { status, text, finalUrl } = await fetchPage(page);
    const urls = imagesFrom(text).filter((url) => matchSku(url, row.model));
    const titles = [...(text.matchAll(/"title":"([^"]+)"/g))].map((m) => m[1]).filter((t) => compact(t).includes(sku)).slice(0, 4);
    console.log(`  ${status} ${finalUrl.slice(0, 90)}`);
    for (const url of urls.slice(0, 8)) console.log(`    IMG ${url}`);
    for (const title of titles) console.log(`    TITLE ${title}`);
  }
}
