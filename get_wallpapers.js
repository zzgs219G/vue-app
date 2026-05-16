import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 各种标签对应 Wallhaven 的搜索参数
const categories = [
  { id: 'mobile', query: 'ratios=9x16,10x16,9x18&categories=111&purity=100' },
  { id: 'pc', query: 'ratios=16x9,21x9&categories=111&purity=100' },
  { id: 'anime', query: 'q=anime&categories=111&purity=100' },
  { id: 'people', query: 'q=people&categories=111&purity=100' },
  { id: 'scenery', query: 'q=nature&categories=111&purity=100' }
];

async function getWallpapers() {
  const outputPath = path.join(__dirname, 'public', 'wallpapers_data.json');
  const allWallpapers = {};

  for (const cat of categories) {
    console.log(`Fetching wallpapers for category: ${cat.id}...`);
    try {
      // 每次抓取 24 张高质量随机壁纸
      const seed = Math.random().toString(36).substring(2);
      const apiUrl = `https://wallhaven.cc/api/v1/search?sorting=random&seed=${seed}&${cat.query}`;

      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (json.data && Array.isArray(json.data)) {
        allWallpapers[cat.id] = json.data.map(item => ({
          id: item.id,
          url: item.path,
          thumbnail: item.thumbs.original,
          author: `Wallhaven ${item.id}`,
        }));
        console.log(`  -> Fetched ${allWallpapers[cat.id].length} images for ${cat.id}`);
      } else {
        allWallpapers[cat.id] = [];
      }
    } catch (err) {
      console.error(`  -> Failed to fetch category ${cat.id}:`, err);
      allWallpapers[cat.id] = []; // Fallback to empty array on failure
    }

    // Wallhaven API rate limit is usually 45 requests per minute, so we delay slightly just to be safe
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  fs.writeFileSync(outputPath, JSON.stringify(allWallpapers, null, 2));
  console.log('Successfully generated public/wallpapers_data.json');
}

getWallpapers().catch(console.error);
