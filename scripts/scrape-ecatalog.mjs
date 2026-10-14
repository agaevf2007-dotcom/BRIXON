const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function imagesFrom(html) {
  return [...new Set([
    ...[...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]),
    ...[...html.matchAll(/(?:src|data-src|content)=["']([^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi)].map((m) => m[1]),
  ].map((url) => url.replace(/&amp;/g, "&").split("?")[0]))];
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(18000),
    });
    return { status: res.status, text: await res.text(), finalUrl: res.url };
  } catch (error) {
    return { status: 0, text: "", finalUrl: url, error: String(error.message || error) };
  }
}

const pages = [
  "https://e-catalog.co.uk/ELECTROLUX-LFT766X.htm",
  "https://e-catalog.co.uk/ELECTROLUX-EOE8P31WX.htm",
  "https://e-catalog.co.uk/ELECTROLUX-EOE8P31X.htm",
  "https://e-catalog.co.uk/SAMSUNG-RB38C7B5B12.htm",
  "https://e-catalog.co.uk/SAMSUNG-DV90T8240SH.htm",
  "https://e-catalog.co.uk/SAMSUNG-VS20B95923N.htm",
  "https://e-catalog.co.uk/SAMSUNG-VR50T95735W.htm",
  "https://e-catalog.co.uk/SIEMENS-HB675G0S1.htm",
  "https://e-catalog.co.uk/BOSCH-DWK97JQ60.htm",
  "https://e-catalog.co.uk/BOSCH-WTX87MH0BY.htm",
  "https://e-catalog.co.uk/DELONGHI-ECAM220-64-B.htm",
  "https://e-catalog.co.uk/DELONGHI-ECAM-220-64-B.htm",
  "https://e-catalog.co.uk/XIAOMI-TV-A-50-2025.htm",
  "https://e-catalog.co.uk/SONY-K-85S30.htm",
  "https://e-catalog.co.uk/HAIER-HW90-B14IG.htm",
  "https://ek.ua/ELECTROLUX-LFT766X.htm",
  "https://ek.ua/SAMSUNG-RB38C7B5B12.htm",
  "https://ek.ua/BOSCH-DWK97JQ60.htm",
  "https://ek.ua/SIEMENS-HB675G0S1.htm",
  "https://www.mi.com/global/product/xiaomi-tv-a-2025/",
  "https://www.mi.com/de/product/xiaomi-tv-a-2025/",
  "https://www.sony.co.uk/search?query=K-85S30",
  "https://www.samsung.com/uk/search/?searchvalue=RB38C7B5B12",
  "https://www.samsung.com/uk/search/?searchvalue=DV90T8240SH",
  "https://www.samsung.com/uk/search/?searchvalue=VS20B95923N",
  "https://www.samsung.com/uk/search/?searchvalue=VR50T95735W",
  "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Bosch+DWK97JQ60+Wandesse",
  "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=%22DWK97JQ60%22",
  "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=%22HB675G0S1%22",
  "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=%22EOE8P31WX%22",
  "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=%22ECAM220.64.B%22",
  "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=%22RB38C7B5B12%22",
  "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=%22VS20B95923N%22",
  "https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=Xiaomi+TV+A+50+2025",
];

for (const url of pages) {
  process.stdout.write(`${url} ... `);
  const { status, text, finalUrl, error } = await fetchPage(url);
  if (!text) {
    console.log(`${status} ${error || "empty"}`);
    continue;
  }
  const og = [
    ...text.matchAll(/property=["']og:image["'][^>]*content=["']([^"']+)["']/gi),
    ...text.matchAll(/content=["']([^"']+)["'][^>]*property=["']og:image["']/gi),
  ].map((m) => m[1]);
  const zoom = imagesFrom(text).filter((u) => /jpg_zoom|produktbild|samsung\.com\/is\/image|fly-birds|Product_Shots|e-catalog/i.test(u));
  const title = (text.match(/<title>([^<]+)/i) || [])[1] || "";
  console.log(`${status} title=${title.slice(0, 70)}`);
  if (finalUrl !== url) console.log(`  final ${finalUrl}`);
  for (const img of [...og, ...zoom].slice(0, 8)) console.log(`  ${img}`);
}
