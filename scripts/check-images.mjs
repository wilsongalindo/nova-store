const candidates = [
  ["monitor1", "photo-1496185843023-82f985eeb248"],
  ["monitor2", "photo-1556650677-2400a64a88f8"],
  ["keyboard1", "photo-1541140136513-48d29f068d0c"],
  ["speaker1", "photo-1519682337058-a94d519337bc"],
  ["usb1", "photo-1586953208448-b95a79798f07"],
  ["denim1", "photo-1551028719-00167b16eac5"],
  ["chinos1", "photo-1594938298603-c8148c4dae35"],
  ["chinos2", "photo-1541099649105-f69ad21f3246"],
  ["coffee1", "photo-1442512595331-e89e73853f31"],
  ["coffee2", "photo-1498804103079-d890ae209bad"],
  ["sheets1", "photo-1616486338812-3dadae4b4ace"],
  ["candle1", "photo-1602603155262-892031b5a0f7"],
  ["candle2", "photo-1603003901551-d4s253856679"],
  ["candle3", "photo-1602603155262-892031b5a0f7"],
  ["candle4", "photo-1602603155262-892031b5a0f7"],
  ["candle5", "photo-1602603155262-892031b5a0f7"],
  ["candle6", "photo-1602603155262-892031b5a0f7"],
  ["candle7", "photo-1602603155262-892031b5a0f7"],
  ["candle8", "photo-1602603155262-892031b5a0f7"],
  ["candle9", "photo-1602603155262-892031b5a0f7"],
  ["candle10", "photo-1602603155262-892031b5a0f7"],
  ["tennis1", "photo-1622279457486-62dcc4a431d6"],
  ["lipstick1", "photo-1512496015851-a90fb38ba796"],
  ["hair1", "photo-1522337360788-8b13dee7a37e"],
  ["sunscreen1", "photo-1570172619644-dfd03ed5d881"],
];

for (const [name, id] of candidates) {
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
  const res = await fetch(url, { method: "HEAD", redirect: "follow" });
  console.log(res.status, name, id);
}
