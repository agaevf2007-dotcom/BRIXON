import { readFile } from "node:fs/promises";

const html = await readFile(`${process.env.TEMP}/bosch-kgn.html`, "utf8");
const urls = [...html.matchAll(/https?:\/\/[^"'\\\s>]+\.(?:jpg|jpeg|png|webp)/gi)].map(
  (match) => match[0],
);
const og =
  html.match(/property=["']og:image["'][^>]*content=["']([^"']+)/i)?.[1] ||
  html.match(/content=["']([^"']+)["'][^>]*property=["']og:image["']/i)?.[1];
console.log("og", og);
console.log("count", urls.length);
console.log([...new Set(urls)].slice(0, 50).join("\n"));
console.log("---KGN---");
console.log(
  [...new Set(urls)].filter((url) => /KGN39|Product_Shots|product/i.test(url)).join("\n"),
);
