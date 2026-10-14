import { readFile, writeFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const data = JSON.parse(await readFile("C:/Users/TTYRRE~1/AppData/Local/Temp/brixon-extras.json", "utf8"));

function abortAfter(ms) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  if (typeof timer.unref === "function") timer.unref();
  return { signal: ctrl.signal, done: () => clearTimeout(timer) };
}

async function check(url) {
  const t = abortAfter(40000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      redirect: "follow",
      signal: t.signal,
    });
    const type = res.headers.get("content-type") || "";
    const buf = Buffer.from(await res.arrayBuffer());
    const magic =
      (buf[0] === 0xff && buf[1] === 0xd8) ||
      (buf[0] === 0x89 && buf[1] === 0x50) ||
      buf.toString("ascii", 0, 4) === "RIFF" ||
      buf.toString("ascii", 0, 4) === "<svg";
    const ok = (res.ok || res.status === 206) && (magic || /image|octet-stream|jpeg|png|webp/i.test(type));
    return { url, ok, status: res.status, type: type.slice(0, 50), bytes: buf.length };
  } catch (error) {
    return { url, ok: false, status: 0, type: String(error.message || error).slice(0, 80), bytes: 0 };
  } finally {
    t.done();
  }
}

const still = [];
const recovered = [];
for (const item of data.bad) {
  const row = await check(item.url);
  const mark = row.ok ? "OK" : "STILL";
  console.log(`${mark} ${item.id}#${item.index} ${row.status} ${row.bytes} ${item.url}`);
  if (row.ok) recovered.push({ ...item, ...row });
  else still.push({ ...item, ...row });
}

await writeFile(
  "C:/Users/TTYRRE~1/AppData/Local/Temp/brixon-extras-retry.json",
  JSON.stringify({ recovered: recovered.length, still }, null, 2),
);
console.log("recovered", recovered.length, "stillBad", still.length);
