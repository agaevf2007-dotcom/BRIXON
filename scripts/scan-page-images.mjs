import { writeFile } from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const pages = process.argv.slice(2);
for (const url of pages) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html" }, redirect: "follow" });
  const html = await res.text();
  const file = `${process.env.TEMP}/page-scan.html`;
  await writeFile(file, html);
  const urls = [...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map((m) => m[0]);
  const unique = [...new Set(urls)];
  const pack = unique.filter(
    (u) => /Product_Shots|icecat|samsung\.com\/is\/image|assetsadobe|pmedia|scene7|delonghi|dyson|bork|mi\.com|miele/i.test(u),
  );
  console.log("\nURL", url, "status", res.status, "imgs", unique.length);
  console.log(pack.slice(0, 15).join("\n") || unique.slice(0, 8).join("\n"));
}
