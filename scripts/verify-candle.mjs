const SUFFIX = "?auto=format&fit=crop&w=800&q=80";

const candleCandidates = [
  "photo-1602874801006-128f2e6c3a8e",
  "photo-1602874801006-128f2e6c3a8e",
  "photo-1602874801006-128f2e6c3a8e",
  "photo-1602874801006-128f2e6c3a8e",
  "photo-1602874801006-128f2e6c3a8e",
  "photo-1602874801006-128f2e6c3a8e",
  "photo-1602874801006-128f2e6c3a8e",
  "photo-1602874801006-128f2e6c3a8e",
  "photo-1602874801006-128f2e6c3a8e",
  "photo-1602874801006-128f2e6c3a8e",
];

async function check(id) {
  const res = await fetch(`https://images.unsplash.com/${id}${SUFFIX}`, {
    method: "HEAD",
    redirect: "follow",
  });
  return res.status;
}

async function main() {
  for (const id of candleCandidates) {
    console.log(id, await check(id));
  }
}

main();
