import fs from 'fs';

const SOURCE_URL = 'https://vb-world-api.onrender.com';

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Failed ${url}: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
    return null;
  }
}

async function main() {
  console.log('Fetching all data from', SOURCE_URL);
  
  const branches = await fetchJson(`${SOURCE_URL}/api/branches`);
  const gallery = await fetchJson(`${SOURCE_URL}/api/branches/gallery`);
  const menu = await fetchJson(`${SOURCE_URL}/api/menu`);
  
  const pages = ['home', 'about-us', 'menu', 'our-branches', 'our-brands', 'banquet-halls', 'terms-and-conditions', 'privacy'];
  const heroes = {};
  for (const p of pages) {
    heroes[p] = await fetchJson(`${SOURCE_URL}/api/hero?page=${p}`);
  }
  
  const ctas = {};
  for (const p of pages) {
    ctas[p] = await fetchJson(`${SOURCE_URL}/api/cta?page=${p}`);
  }
  
  const allData = {
    branches,
    gallery,
    menu,
    heroes,
    ctas
  };
  
  fs.writeFileSync('scripts/source_data.json', JSON.stringify(allData, null, 2));
  console.log('Source data successfully saved to scripts/source_data.json');
}

main();
