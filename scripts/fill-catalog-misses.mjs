import { readFile, writeFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

function compact(value) {
  return String(value).replace(/[^A-Za-z0-9]/g, "").toLowerCase();
}

function slug(model) {
  return String(model)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function skuMatch(url, model) {
  const hay = compact(url);
  const token = compact(model);
  if (token.length >= 6 && hay.includes(token)) return true;
  const parts = String(model)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((part) => part.length >= 5 && /\d/.test(part));
  return parts.some((part) => hay.includes(part));
}

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return { status: res.status, html: "" };
    return { status: res.status, html: await res.text() };
  } catch {
    return { status: 0, html: "" };
  }
}

function imagesFrom(html) {
  return [...new Set([...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]))];
}

const covers = JSON.parse(await readFile("data/generated/catalog-covers.json", "utf8"));

const pagesFor = {
  Bosch: (code) => [
    `https://www.bosch-home.com/de/de/product/${code}`,
    `https://www.bosch-home.com/gb/en/product/${code}`,
    `https://www.bosch-home.com/at/de/product/${code}`,
    `https://www.bosch-home.com/nl/nl/product/${code}`,
  ],
  Siemens: (code) => [
    `https://www.siemens-home.bsh-group.com/de/product/${code}`,
    `https://www.siemens-home.bsh-group.com/gb/en/product/${code}`,
    `https://www.siemens-home.bsh-group.com/at/de/product/${code}`,
  ],
  Miele: (code) => [
    `https://www.miele.co.uk/search?q=${encodeURIComponent(code)}`,
    `https://www.miele.de/de/c/${code}.htm`,
  ],
};

async function idealoCover(brand, model) {
  const q = `${brand} ${model.split(/\s+/)[0]}`;
  const { html } = await fetchPage(
    `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${encodeURIComponent(q)}`,
  );
  const urls = imagesFrom(html).filter(
    (url) => /cdn\.idealo\.com\/folder\/Product/i.test(url) && /produktbild_(gross|mittelgross)/i.test(url),
  );
  const hit = urls.find((url) => skuMatch(url, model));
  return hit || null;
}

async function manufacturerCover(brand, model) {
  const code = model.split(/[\s/]/)[0];
  const pages = pagesFor[brand]?.(code) ?? [];
  for (const page of pages) {
    const { html } = await fetchPage(page);
    if (!html) continue;
    const urls = imagesFrom(html);
    const shot = urls.find((url) => /\/Product_Shots\//i.test(url) && skuMatch(url, model));
    if (shot) return shot;
    const miele = urls.find((url) => /miele/i.test(url) && skuMatch(url, model) && /\.(jpe?g|png|webp)/i.test(url));
    if (miele) return miele;
  }
  return null;
}

const misses = Object.entries(covers).filter(([, row]) => !row.url);

for (const [id, row] of misses) {
  process.stdout.write(`${id} ... `);
  let url = null;
  let source = "";
  if (id === "miele-wwg660") {
    const { html } = await fetchPage(
      "https://www.miele.co.uk/product/11359290/w1-front-loader-washing-machine-wwg660-wcs-tdosand9kg-lotus-white",
    );
    const shot = imagesFrom(html).find(
      (url) => /miele/i.test(url) && /\.(jpe?g|png|webp)/i.test(url) && !/icon|logo|svg/i.test(url),
    );
    if (shot) {
      url = shot;
      source = "manufacturer";
    }
  }
  if (!url) {
    url = await manufacturerCover(row.brand, row.model);
    source = url ? "manufacturer" : "";
  }
  if (!url) {
    url = await idealoCover(row.brand, row.model);
    if (url) source = "idealo";
  }
  if (url) {
    covers[id] = { url: url.split("?")[0], source, brand: row.brand, model: row.model };
    console.log(source);
    await writeFile("data/generated/catalog-covers.json", JSON.stringify(covers, null, 2) + "\n");
  } else {
    console.log("still miss");
  }
  await new Promise((r) => setTimeout(r, 400));
}

await writeFile("data/generated/catalog-covers.json", JSON.stringify(covers, null, 2) + "\n");
const ok = Object.values(covers).filter((item) => item.url).length;
console.log(`\nNow ${ok}/${Object.keys(covers).length}`);
