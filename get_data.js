import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadShareUrl } from 'lanzou-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to convert Lanzou's relative time string to a standard YYYY-MM-DD
function parseLanzouTime(timeStr) {
  const now = new Date();

  if (timeStr.includes('秒前') || timeStr.includes('分钟前') || timeStr.includes('小时前')) {
    return now.toISOString().split('T')[0];
  }
  if (timeStr.includes('昨天')) {
    now.setDate(now.getDate() - 1);
    return now.toISOString().split('T')[0];
  }
  if (timeStr.includes('前天')) {
    now.setDate(now.getDate() - 2);
    return now.toISOString().split('T')[0];
  }
  if (timeStr.includes('天前')) {
    const days = parseInt(timeStr.replace(/[^0-9]/g, ''), 10) || 0;
    now.setDate(now.getDate() - days);
    return now.toISOString().split('T')[0];
  }
  // If it's already a date string like "2025-10-28"
  if (/^\d{4}-\d{2}-\d{2}$/.test(timeStr)) {
    return timeStr;
  }
  // Fallback
  return now.toISOString().split('T')[0];
}

async function getData() {
  const dataPath = path.join(__dirname, 'public', 'data.json');
  const allDataPath = path.join(__dirname, 'public', 'all_data.json');

  if (!fs.existsSync(dataPath)) {
    console.error('public/data.json not found!');
    process.exit(1);
  }

  const sourceData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const tags = [{ id: 'all', name: '全部' }];
  const list = [];

  // Create tags from resources
  for (const resource of sourceData.resources) {
    tags.push({
      id: resource.id,
      name: resource.title
    });

    console.log(`Fetching items for: ${resource.title} (${resource.lanzaoUrl})...`);
    try {
      const result = await loadShareUrl(resource.lanzaoUrl);

      if (result && result.value && result.value.type === 'folder') {
        const nodes = result.value.nodes || [];

        for (const node of nodes) {
          const actualDateStr = parseLanzouTime(node.time);

          let imageUrl = '';
          // Only use the ico field if p_ico === 1. Otherwise it's a false inheritance from Lanzou API.
          if (node.ico && node.p_ico === 1) {
            imageUrl = `https://image.dmpdmp.com/image/ico/${node.ico}`;
          }

          list.push({
            id: node.id,
            title: node.name_all,
            description: `大小: ${node.size}  |  更新时间: ${node.time}`,
            tagId: resource.id,
            lanzaoUrl: node.shareUrl,
            createdAt: actualDateStr, // Use parsed real date to calculate NEW badge properly
            password: '', // empty as we might not know
            icon: imageUrl, // URL of the app icon if it exists
            fallbackIcon: node.icon || 'file' // e.g. 'apk', 'zip'
          });
        }
        console.log(`  -> Found ${nodes.length} items`);
      } else {
        console.warn(`  -> Could not parse folder or it's empty.`);
      }
    } catch (err) {
      console.error(`  -> Failed to load url: ${resource.lanzaoUrl}`, err);
    }
  }

  const allData = { tags, list };
  fs.writeFileSync(allDataPath, JSON.stringify(allData, null, 2));
  console.log('Successfully generated public/all_data.json');
}

getData().catch(console.error);
