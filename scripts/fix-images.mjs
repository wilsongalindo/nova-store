import fs from "node:fs";

const SUFFIX = "?auto=format&fit=crop&w=800&q=80";

const replacements = {
  "photo-1527443224754-53600a3f5fbf": "photo-1517336714731-489689fd1ca8",
  "photo-1511467659812-ae64d0565d4e": "photo-1516116216624-53e697fedbea",
  "photo-1608043159229-423825ba4e80": "photo-1519682337058-a94d519337bc",
  "photo-1625948515291-69613efd202f": "photo-1586953208448-b95a79798f07",
  "photo-1576995853123-5a10305d93b0": "photo-1551028719-00167b16eac5",
  "photo-1473966968600-fa801b546a28": "photo-1541099649105-f69ad21f3246",
  "photo-1514432324607-09f9aed76d21": "photo-1442512595331-e89e73853f31",
  "photo-1616627547584-074771652145": "photo-1616486338812-3dadae4b4ace",
  "photo-1602603155262-892031b5a0f7": "photo-1602874801006-128f2e6c3a8e",
  "photo-1617083277629-36a4c5a2aa4b": "photo-1622279457486-62dcc4a431d6",
  "photo-1586495777744-4413f210fa4f": "photo-1512496015851-a90fb38ba796",
  "photo-1608248543801-ba977795e702": "photo-1522337360788-8b13dee7a37e",
  "photo-1556228578-0d85b4a4d571": "photo-1570172619644-dfd03ed5d881",
};

async function verifyPhotoId(id) {
  const res = await fetch(`https://images.unsplash.com/${id}${SUFFIX}`, {
    method: "HEAD",
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });
  return res.ok;
}

async function main() {
  for (const replacement of Object.values(replacements)) {
    const ok = await verifyPhotoId(replacement);
    if (!ok) {
      console.error(`Invalid replacement: ${replacement}`);
      process.exit(1);
    }
  }

  const filePath = "src/data/products.json";
  const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const modifiedProducts = [];
  let replacedCount = 0;

  for (const product of products) {
    let changed = false;
    product.images = product.images.map((url) => {
      const id = url.split("?")[0].replace("https://images.unsplash.com/", "");
      if (replacements[id]) {
        changed = true;
        replacedCount += 1;
        return `https://images.unsplash.com/${replacements[id]}${SUFFIX}`;
      }
      return url;
    });
    if (changed) modifiedProducts.push({ id: product.id, name: product.name });
  }

  fs.writeFileSync(filePath, `${JSON.stringify(products, null, 2)}\n`);
  console.log(JSON.stringify({ replacedCount, modifiedProducts }, null, 2));
}

main();
