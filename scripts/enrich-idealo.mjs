import { readFile, writeFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const FILE = "data/generated/product-photos.json";
const MAX = 6;

const CODES = {
  "haier-as25s2sf2fa": ["AS25S2SF2FA", "AS25S2SF2FA-G"],
  "electrolux-eacs-12hat": ["EACS-12HAT", "EACS12HAT"],
  "xiaomi-tv-a-50-2025": ["TV-A-50-2025", "L50MA-ASEU", "xiaomi-tv-a-50"],
  "lg-oled77c4": ["OLED77C4", "OLED77C44LA"],
  "bosch-gsn36ai3p": ["GSN36AI3P"],
  "siemens-hb675g0s1": ["HB675G0S1"],
  "electrolux-eoe8p31wx": ["EOE8P31WX"],
  "siemens-ex877lyv5e": ["EX877LYV5E"],
  "bosch-dwk97jq60": ["DWK97JQ60"],
  "electrolux-lft766x": ["LFT766X"],
  "bosch-wgb256a40": ["WGB256A40"],
  "miele-wwg660": ["WWG660", "WWG-660"],
  "haier-hw90-b14ig": ["HW90-B14IG", "HW90B14IG"],
  "bosch-wtx87mh0by": ["WTX87MH0BY", "WTX87MH0"],
  "samsung-dv90t8240sh": ["DV90T8240SH"],
  "bosch-mfq36400": ["MFQ36400"],
  "samsung-vs20b95923n": ["VS20B95923N"],
  "samsung-vr50t95735w": ["VR50T95735W"],
  "xiaomi-smart-air-purifier-4-pro": ["air-purifier-4-pro", "AC-M15-SC"],
  "lg-oled77c4-extra": ["OLED77C4"],
};

const ICECAT = {
  "haier-as25s2sf2fa": ["Haier", ["AS25S2SF2FA-G", "AS25S2SF2FA"]],
  "lg-oled77c4": ["LG", ["OLED77C44LA", "OLED77C4PLA", "OLED77C4"]],
  "bosch-gsn36ai3p": ["Bosch", ["GSN36AI3P"]],
  "siemens-hb675g0s1": ["Siemens", ["HB675G0S1"]],
  "electrolux-eoe8p31wx": ["Electrolux", ["EOE8P31WX"]],
  "siemens-ex877lyv5e": ["Siemens", ["EX877LYV5E"]],
  "bosch-dwk97jq60": ["Bosch", ["DWK97JQ60"]],
  "electrolux-lft766x": ["Electrolux", ["LFT766X"]],
  "bosch-wgb256a40": ["Bosch", ["WGB256A40"]],
  "miele-wwg660": ["Miele", ["WWG660 WCS", "WWG660"]],
  "haier-hw90-b14ig": ["Haier", ["HW90-B14IG"]],
  "bosch-wtx87mh0by": ["Bosch", ["WTX87MH0BY", "WTX87MH0"]],
  "samsung-dv90t8240sh": ["Samsung", ["DV90T8240SH"]],
  "bosch-mfq36400": ["Bosch", ["MFQ36400"]],
  "samsung-vs20b95923n": ["Samsung", ["VS20B95923N"]],
  "samsung-vr50t95735w": ["Samsung", ["VR50T95735W"]],
  "electrolux-eacs-12hat": ["Electrolux", ["EACS-12HAT/N3", "EACS-12HAT"]],
  "xiaomi-tv-a-50-2025": ["Xiaomi", ["L50MA-ASEU", "TV A 50 2025"]],
  "philips-hr3652": ["Philips", ["HR3652/00", "HR3652"]],
};

const photos = JSON.parse(await readFile(FILE, "utf8"));

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

function norm(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
}

function abortAfter(ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  if (typeof timer.unref === "function") timer.unref();
  return { signal: ctrl.signal, done: () => clearTimeout(timer) };
}

async function fetchText(url, ms = 12000) {
  const t = abortAfter(ms);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/json,*/*" },
      redirect: "follow",
      signal: t.signal,
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  } finally {
    t.done();
  }
}

async function alive(url) {
  const t = abortAfter(7000);
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": UA, Range: "bytes=0-400" },
      redirect: "follow",
      signal: t.signal,
    });
    const type = res.headers.get("content-type") || "";
    return (res.ok || res.status === 206) && /image|octet-stream|jpeg|png|webp/i.test(type);
  } catch {
    return false;
  } finally {
    t.done();
  }
}

function matchesCode(url, codes) {
  const hay = norm(url);
  return codes.some((code) => hay.includes(norm(code)));
}

function idealoFrom(html, codes) {
  const decoded = html.replace(/\\\//g, "/").replace(/\\u002F/g, "/");
  const urls = unique(
    [...decoded.matchAll(/https?:\/\/cdn\.idealo\.com\/folder\/Product\/\d+\/\d+\/\d+\/s\d+_produktbild_gross\/[^"'\\\s<>]+\.jpg/gi)].map(
      (m) => m[0].split("?")[0],
    ),
  ).filter((url) => matchesCode(url, codes));
  const expanded = [];
  for (const url of urls) {
    for (let n = 1; n <= 8; n += 1) {
      expanded.push(url.replace(/\/s\d+_produktbild_gross\//, `/s${n}_produktbild_gross/`));
    }
  }
  return unique(expanded);
}

function icecatFrom(jsonText) {
  try {
    const json = JSON.parse(jsonText);
    if (json?.msg !== "OK" || !json?.data) return [];
    const items = Array.isArray(json.data.Gallery) ? json.data.Gallery : [];
    const pics = items
      .filter((item) => item?.Type !== "EnergyLabel" && item?.Pic && !/wikimedia/i.test(item.Pic))
      .sort((a, b) => Number(a.No ?? 99) - Number(b.No ?? 99))
      .map((item) => item.Pic);
    const high = json.data.Image?.HighPic;
    return unique([high, ...pics]).filter((url) => /images\.icecat\.biz\/img\/gallery/i.test(url));
  } catch {
    return [];
  }
}

async function persist() {
  await writeFile(FILE, JSON.stringify(photos, null, 2) + "\n");
}

async function keepAlive(urls, already) {
  const extras = [];
  const pending = urls.filter((url) => !already.includes(url));
  for (let i = 0; i < pending.length && already.length + extras.length < MAX; i += 4) {
    const chunk = pending.slice(i, i + 4);
    const checks = await Promise.all(chunk.map(async (url) => ((await alive(url)) ? url : null)));
    for (const url of checks) {
      if (url && !extras.includes(url) && already.length + extras.length < MAX) extras.push(url);
    }
  }
  return extras;
}

const thinIds = Object.entries(photos)
  .filter(([, list]) => list.length < 4)
  .map(([id]) => id);

for (const id of thinIds) {
  const current = photos[id];
  const codes = CODES[id] ?? [id];
  const found = [];

  for (const code of codes.slice(0, 2)) {
    const html = await fetchText(
      `https://www.idealo.de/preisvergleich/MainSearchProductCategory.html?q=${encodeURIComponent(code)}`,
    );
    if (html) found.push(...idealoFrom(html, codes));
  }

  const ice = ICECAT[id];
  if (ice) {
    for (const code of ice[1]) {
      const json = await fetchText(
        `https://live.icecat.biz/api?UserName=openIcecat-live&Language=en&Brand=${encodeURIComponent(ice[0])}&ProductCode=${encodeURIComponent(code)}`,
        10000,
      );
      const pics = icecatFrom(json);
      if (pics.length) {
        found.push(...pics);
        break;
      }
    }
  }

  const extras = await keepAlive(unique(found), current);
  if (!extras.length) {
    console.log(`${id} 0`);
    continue;
  }
  photos[id] = unique([...current, ...extras]).slice(0, MAX);
  await persist();
  console.log(`${id} ${current.length} -> ${photos[id].length}`);
}

const sizes = Object.values(photos).map((list) => list.length);
console.log("avg", (sizes.reduce((a, b) => a + b, 0) / sizes.length).toFixed(1));
console.log("thin", sizes.filter((n) => n < 3).length, "/", sizes.length);
for (const [id, list] of Object.entries(photos)) {
  if (list.length < 3) console.log(`still ${list.length}\t${id}`);
}
