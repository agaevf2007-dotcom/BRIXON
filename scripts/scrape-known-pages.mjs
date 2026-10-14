const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function compact(value) {
  return String(value).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
}

function imagesFrom(html) {
  return [...new Set([
    ...[...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]),
    ...[...html.matchAll(/(?:src|data-src|content)=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi)].map((m) => m[1]),
    ...[...html.matchAll(/\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => `https:${m[0]}`),
  ].map((url) => url.replace(/&amp;/g, "&").split("?")[0]))];
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,image/*,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    const text = await res.text();
    return { status: res.status, text, finalUrl: res.url };
  } catch (error) {
    return { status: 0, text: "", finalUrl: url, error: String(error.message || error) };
  }
}

const pages = [
  ["bork-k811", "K811", "https://www.hausdorf.ru/catalog/kettles/bork/chaynik-bork-k811.html"],
  ["bork-k811", "K811", "https://technoklass.by/tehnika-dlya-kuhni/melkaya-bytovaya-tehnika/chajniki/bork-k811"],
  ["bork-k811", "K811", "https://home.1k.by/kitchen-kettles/bork/BORK_K811-5019810.html"],
  ["bork-b780", "B780", "https://www.bork.kz/eShop/Blenders/b780/"],
  ["bork-b780", "B780", "https://www.hausdorf.ru/catalog/blenders/bork/blender-bork-b780.html"],
  ["bork-b780", "B780", "https://atelier16.com/catalog/home_appliances/blender-b780/"],
  ["xiaomi-air", "AIRPURIFIER4PRO", "https://www.mi.com/uk/product/xiaomi-smart-air-purifier-4-pro/"],
  ["xiaomi-air", "4-pro", "https://www.mi.com/de/product/xiaomi-smart-air-purifier-4-pro/"],
  ["xiaomi-kettle", "KETTLE", "https://www.mi.com/uk/product/xiaomi-smart-kettle-2-pro/"],
  ["xiaomi-x20", "x20-plus", "https://www.mi.com/de/product/xiaomi-robot-vacuum-x20-plus/"],
  ["xiaomi-tv", "tv-a-2025", "https://www.mi.com/uk/product/xiaomi-tv-a-2025/"],
  ["sony-85", "85S30", "https://www.sony.co.uk/electronics/tv/k-85s30"],
  ["sony-ht", "HT-A8000", "https://electronics.sony.com/audio/soundbars/all-soundbars/p/hta8000"],
  ["eacs", "12HAT", "https://e-catalog.co.uk/ELECTROLUX-EACS-12HAT-N3.htm"],
  ["eacs", "12HAT", "https://www.e-katalog.ru/ELECTROLUX-EACS-12HAT-N3.htm"],
  ["lft", "LFT766X", "https://www.e-katalog.ru/ELECTROLUX-LFT766X.htm"],
  ["eoe", "EOE8P31WX", "https://www.e-katalog.ru/ELECTROLUX-EOE8P31WX.htm"],
  ["rb38", "RB38C7B5B12", "https://www.e-katalog.ru/SAMSUNG-RB38C7B5B12.htm"],
  ["dv90", "DV90T8240SH", "https://www.e-katalog.ru/SAMSUNG-DV90T8240SH.htm"],
  ["vs20", "VS20B95923N", "https://www.e-katalog.ru/SAMSUNG-VS20B95923N.htm"],
  ["vr50", "VR50T95735W", "https://www.e-katalog.ru/SAMSUNG-VR50T95735W.htm"],
  ["hb675", "HB675G0S1", "https://www.e-katalog.ru/SIEMENS-HB675G0S1.htm"],
  ["dwk", "DWK97JQ60", "https://www.e-katalog.ru/BOSCH-DWK97JQ60.htm"],
  ["wtx", "WTX87MH0BY", "https://www.e-katalog.ru/BOSCH-WTX87MH0BY.htm"],
  ["ecam", "22064", "https://www.e-katalog.ru/DELONGHI-ECAM-220-64-B.htm"],
  ["hw90", "HW90-B14IG", "https://www.e-katalog.ru/HAIER-HW90-B14IG.htm"],
];

for (const [id, token, url] of pages) {
  process.stdout.write(`${id} ${url} ... `);
  const { status, text, finalUrl, error } = await fetchPage(url);
  if (!text) {
    console.log(`${status} ${error || "empty"}`);
    continue;
  }
  const urls = imagesFrom(text);
  const hits = urls.filter((img) => compact(img).includes(compact(token)) || /fly-birds|Product_Shots|hausdorf|bork|ek\.img|img\.ek|e-katalog|mi-img|appmifile|samsung\.com\/is\/image|scene7|idealo/i.test(img));
  console.log(`${status} ${finalUrl === url ? "" : "-> " + finalUrl} images=${urls.length} hits=${hits.length}`);
  for (const img of hits.slice(0, 12)) console.log(`  ${img}`);
  if (!hits.length) {
    const og = [...text.matchAll(/property=["']og:image["'][^>]*content=["']([^"']+)["']/gi)].map((m) => m[1]);
    const og2 = [...text.matchAll(/content=["']([^"']+)["'][^>]*property=["']og:image["']/gi)].map((m) => m[1]);
    for (const img of [...og, ...og2].slice(0, 4)) console.log(`  OG ${img}`);
  }
}
