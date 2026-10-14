import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_JSON = path.join(ROOT, "data", "generated", "catalog-covers.json");
const OUT_DIR = path.join(ROOT, "public", "catalog");
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function extOf(url) {
  const match = url.split("?")[0].match(/\.(jpe?g|png|webp)$/i);
  return match ? match[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      Referer: new URL(url).origin + "/",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 2000) throw new Error(`too small ${buf.length}`);
  await writeFile(dest, buf);
  return buf.length;
}

const existing = JSON.parse(await readFile(OUT_JSON, "utf8"));

const sources = {
  "haier-as25s2sf2fa": existing["haier-as25s2sf2fa"].url,
  "philips-ac3033": existing["philips-ac3033"].url,
  "philips-hu4816": existing["philips-hu4816"].url,
  "samsung-ue43cu7100": existing["samsung-ue43cu7100"].url,
  "samsung-qe55q80d": existing["samsung-qe55q80d"].url,
  "lg-oled65c4": existing["lg-oled65c4"].url,
  "sony-k-65xr90": "https://cdn.idealo.com/folder/Product/204897/6/204897647/s1_produktbild_mittelgross/sony-k-65xr90-65-zoll.jpg",
  "lg-oled77c4": existing["lg-oled77c4"].url,
  "samsung-qe75qn90d": existing["samsung-qe75qn90d"].url,
  "samsung-ls27cg510eu": existing["samsung-ls27cg510eu"].url,
  "lg-27gr83q": existing["lg-27gr83q"].url,
  "samsung-hw-q990d": existing["samsung-hw-q990d"].url,
  "bosch-kgn39aiat": existing["bosch-kgn39aiat"].url,
  "lg-gbb72pzecn": existing["lg-gbb72pzecn"].url,
  "haier-htw7720enmp": "https://cdn.idealo.com/folder/Product/201639/8/201639851/s1_produktbild_mittelgross/haier-htw7720enmp.jpg",
  "bosch-gsn36ai3p": existing["bosch-gsn36ai3p"].url,
  "haier-h2f-220waa": existing["haier-h2f-220waa"].url,
  "bosch-sms8yci01e": existing["bosch-sms8yci01e"].url,
  "miele-g7160": "https://cdn.idealo.com/folder/Product/201281/9/201281905/s1_produktbild_mittelgross/miele-g-7160-scvi.jpg",
  "electrolux-ees48400l": existing["electrolux-ees48400l"].url,
  "bosch-hsg636bs1": existing["bosch-hsg636bs1"].url,
  "bosch-pxx675dc1e": existing["bosch-pxx675dc1e"].url,
  "siemens-ex877lyv5e": existing["siemens-ex877lyv5e"].url,
  "samsung-ms23k3513ak": existing["samsung-ms23k3513ak"].url,
  "bosch-bel554ms0": existing["bosch-bel554ms0"].url,
  "bosch-wgb256a40": existing["bosch-wgb256a40"].url,
  "samsung-ww90t654dlh": existing["samsung-ww90t654dlh"].url,
  "lg-f4wv910p2s": existing["lg-f4wv910p2s"].url,
  "miele-wwg660": existing["miele-wwg660"].url,
  "haier-hw90-b14ig": existing["haier-hw90-b14ig"].url,
  "electrolux-ew8f229s": existing["electrolux-ew8f229s"].url,
  "philips-ep3347": existing["philips-ep3347"].url,
  "bosch-ctl636es6": existing["bosch-ctl636es6"].url,
  "philips-hr3652": existing["philips-hr3652"].url,
  "bosch-mfq36400": existing["bosch-mfq36400"].url,
  "philips-hd2581": existing["philips-hd2581"].url,
  "dyson-v15-detect": "https://cdn.idealo.com/folder/Product/212246/3/212246371/s1_produktbild_mittelgross/dyson-v15-detect-absolute-2026.jpg",

  "electrolux-eacs-12hat": "https://e-catalog.co.uk/jpg_zoom1/801579.jpg",
  "xiaomi-smart-air-purifier-4-pro": "https://i01.appmifile.com/webfile/globalimg/Iris/xiaomi-sap-4-pro.png",
  "xiaomi-smart-humidifier-2": "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-smart-humidifier-2/25418f65cb3dbed3d703467774113b60.jpg",
  "xiaomi-tv-a-50-2025": "https://e-catalog.co.uk/jpg_zoom1/2700483.jpg",
  "sony-ht-a8000": "https://d1ncau8tqf99kp.cloudfront.net/PDP/Audio/Soundbars/HT-A8000/desktop/1.jpg",
  "siemens-hb675g0s1": "https://e-catalog.co.uk/jpg_zoom1/587279.jpg",
  "bosch-dwk97jq60": "https://e-catalog.co.uk/jpg_zoom1/2403332.jpg",
  "electrolux-lft766x": "https://e-catalog.co.uk/jpg_zoom1/1655309.jpg",
  "samsung-dv90t8240sh": "https://e-catalog.co.uk/jpg_zoom1/1975853.jpg",
  "bork-k811": "https://www.hausdorf.ru/upload/iblock/e95/chaynik_bork_k811_1.jpg",
  "xiaomi-kettle-2-pro": "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-smart-kettle-2-pro/PC/1c36c4c46f5f0e450aa55446d540ef10.jpg",
  "bork-b780": "https://st.bork.kz/components/product/kitchen/blenders/b780/preview-mobile/b780.jpg",
  "xiaomi-x20-plus": "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-robot-vacuum-x20-plus/PC/8a77596fe32a7dcf65009683a3d1d81c.jpg",
  "samsung-vr50t95735w": "https://e-catalog.co.uk/jpg_zoom1/2050867.jpg",
  "sony-k-85s30": "https://e-catalog.co.uk/jpg_zoom1/2904854.jpg",
  "bosch-wtx87mh0by": "https://e-catalog.co.uk/jpg_zoom1/1815734.jpg",
};

await mkdir(OUT_DIR, { recursive: true });

for (const [id, url] of Object.entries(sources)) {
  const ext = extOf(url);
  const dest = path.join(OUT_DIR, `${id}.${ext}`);
  process.stdout.write(`${id} ... `);
  try {
    const size = await download(url, dest);
    existing[id] = {
      url: `/catalog/${id}.${ext}`,
      sourceUrl: url,
      source: existing[id]?.source || "retail",
      brand: existing[id]?.brand,
      model: existing[id]?.model,
      bytes: size,
    };
    console.log(`${size} ${ext}`);
  } catch (error) {
    console.log(`FAIL ${error.message}`);
  }
}

await writeFile(OUT_JSON, JSON.stringify(existing, null, 2) + "\n");
const ok = Object.values(existing).filter((row) => row.url && String(row.url).startsWith("/catalog/")).length;
console.log(`\nLocal covers: ${ok}/${Object.keys(existing).length}`);
for (const [id, row] of Object.entries(existing)) {
  if (!row.url || !String(row.url).startsWith("/catalog/")) console.log(`MISS ${id} ${row.model}`);
}
