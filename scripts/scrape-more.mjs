const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const text = await res.text();
    return { status: res.status, text, finalUrl: res.url };
  } catch (error) {
    return { status: 0, text: "", finalUrl: url, error: String(error.message || error) };
  }
}

function og(html) {
  return [
    ...html.matchAll(/property=["']og:image["'][^>]*content=["']([^"']+)["']/gi),
    ...html.matchAll(/content=["']([^"']+)["'][^>]*property=["']og:image["']/gi),
    ...html.matchAll(/jpg_zoom1\/\d+\.jpg/gi),
  ].map((m) => (m[1] ? m[1] : `https://e-catalog.co.uk/${m[0]}`));
}

const pages = [
  "https://e-catalog.co.uk/search/?search_=EOE8P31WX",
  "https://e-catalog.co.uk/ELECTROLUX-EOE8P31W.htm",
  "https://e-catalog.co.uk/SAMSUNG-RB38C7B5B12U1.htm",
  "https://e-catalog.co.uk/SAMSUNG-RB38C7B5.htm",
  "https://e-catalog.co.uk/BOSCH-WTX87MH0.htm",
  "https://e-catalog.co.uk/BOSCH-WTX87MH0SN.htm",
  "https://e-catalog.co.uk/DELONGHI-ECAM-22064-B.htm",
  "https://e-catalog.co.uk/DELONGHI-MAGNIFICA-START-ECAM220-64-B.htm",
  "https://e-catalog.co.uk/SAMSUNG-VS20B95923N-GE.htm",
  "https://e-catalog.co.uk/SAMSUNG-BESPOKE-JET-VS20B95923N.htm",
  "https://e-catalog.co.uk/SONY-K85S30.htm",
  "https://e-catalog.co.uk/SONY-XR-85S30.htm",
  "https://e-catalog.co.uk/HAIER-HW90-B14IG3.htm",
  "https://www.bosch-home.com/by/ru/product/WTX87MH0BY",
  "https://www.bosch-home.com/ru/ru/product/WTX87MH0BY",
  "https://www.delonghi.com/ru-ru/p/magnifica-start-ecam220.64.b/ECAM220.64.B.html",
  "https://www.samsung.com/ru/refrigerators/bottom-mount-freezer/rb38c7b5b12/",
  "https://www.samsung.com/ru/vacuum-cleaners/stick-vacuum/bespoke-jet-vs20b95923n/",
  "https://www.sony.ru/electronics/televizory/k-85s30",
];

for (const url of pages) {
  process.stdout.write(`${url}\n  `);
  const { status, text, finalUrl, error } = await fetchPage(url);
  const title = (text.match(/<title>([^<]+)/i) || [])[1] || error || "";
  console.log(`${status} ${title.slice(0, 80)}`);
  if (finalUrl !== url) console.log(`  -> ${finalUrl}`);
  for (const img of [...new Set(og(text))].slice(0, 5)) console.log(`  ${img}`);
}
