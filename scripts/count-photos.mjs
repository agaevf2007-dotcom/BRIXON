import { readFile } from "node:fs/promises";

const photos = JSON.parse(await readFile("data/generated/product-photos.json", "utf8"));
const rows = Object.entries(photos).map(([id, list]) => [id, list.length]);
rows.sort((a, b) => a[1] - b[1]);
for (const [id, n] of rows) console.log(`${n}\t${id}`);
const thin = rows.filter(([, n]) => n < 3);
console.log("\nthin", thin.length, "/", rows.length);
