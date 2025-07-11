// scraper.js
import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';

const URL = 'https://example.com/';  // নিশ্চিত হও সঠিক পেজ

async function run() {
  try {
    const res = await axios.get(URL, { timeout: 10000 });
    if (res.status !== 200) {
      console.error(`❌ HTTP ${res.status} – skipping parse`);
      return;
    }

    const $ = load(res.data);
    const items = $('h1')
      .map((i, el) => $(el).text().trim())
      .get();

    if (items.length === 0) {
      console.log('⚠️  No <h2> items found');
      return;
    }

    const ts = new Date().toISOString();
    const lines = items.map(t => `${ts},${t}`).join('\n') + '\n';
    fs.appendFileSync('output.csv', lines);
    console.log(`✅ Saved ${items.length} items at ${ts}`);
  } catch (e) {
    if (e.response) {
      // HTTP-level error
      console.error(`❌ HTTP ${e.response.status}: ${e.response.statusText}`);
    } else {
      // network / timeout / parse error
      console.error(`❌ Error: ${e.message}`);
    }
  }
}

run();