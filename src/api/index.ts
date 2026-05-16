import type { Tag, Item } from '../types';

let cachedData: { tags: Tag[]; list: Item[] } | null = null;

async function fetchAllData() {
  if (cachedData) return cachedData;
  // 直接读取静态打包的 all_data.json
  const response = await fetch('/all_data.json');
  if (!response.ok) throw new Error('读取静态数据失败');
  cachedData = await response.json();
  return cachedData!;
}

export async function getTags(): Promise<Tag[]> {
  const data = await fetchAllData();
  return data.tags;
}

export async function getList(tagId: string = 'all'): Promise<Item[]> {
  const data = await fetchAllData();
  if (tagId === 'all') {
    return data.list;
  }
  return data.list.filter(item => item.tagId === tagId);
}
