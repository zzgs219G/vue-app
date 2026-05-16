import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadShareUrl } from 'lanzou-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
          const now = new Date();
          const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

          let imageUrl = '';
          if (node.ico) {
            imageUrl = `https://image.dmpdmp.com/image/ico/${node.ico}`;
          }

          list.push({
            id: node.id,
            title: node.name_all,
            description: `大小: ${node.size}  |  更新时间: ${node.time}`,
            tagId: resource.id,
            lanzaoUrl: node.shareUrl,
            createdAt: todayStr, // Keep format compatible
            password: '', // empty as we might not know
            icon: imageUrl // URL of the app icon
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
