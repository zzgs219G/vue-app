import type { Category, Resource } from '../types';

let cachedData: { categories: Category[]; resources: Resource[] } | null = null;

async function fetchAllData() {
  if (cachedData) return cachedData;
  // 直接读取你放在 public 目录下的静态 json
  const response = await fetch('/data.json');
  if (!response.ok) throw new Error('读取静态数据失败');
  cachedData = await response.json();
  return cachedData!;
}

export async function getCategories(): Promise<Category[]> {
  const data = await fetchAllData();
  return data.categories;
}

export async function getResources(categoryId: string = 'all'): Promise<Resource[]> {
  const data = await fetchAllData();
  if (categoryId === 'all') {
    return data.resources;
  }
  return data.resources.filter(r => r.categoryId === categoryId);
}
