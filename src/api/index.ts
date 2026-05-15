import type { Category, Resource } from '../types';

/**
 * ==========================================================
 * 这是项目的统一 API 数据层
 * AI 开发者注意：
 * 目前这里返回的是 Mock 数据（假数据），用于快速搭建前端页面。
 * 将来这里需要替换为真实请求 Cloudflare Workers (D1/KV) 的接口。
 * 你可以使用 fetch() 或者 axios 发送 HTTP 请求来替代现在的 Promise 模拟。
 * ==========================================================
 */

// 模拟的分类数据
const mockCategories: Category[] = [
  { id: 'all', name: '全部' },
  { id: 'software', name: '常用软件' },
  { id: 'ai', name: 'AI工具' },
  { id: 'design', name: '设计素材' },
  { id: 'dev', name: '开发文档' },
];

// 模拟的蓝奏云资源数据 (已根据 https://yxlzy.lanzoue.com/b00wmhvejc 解析结果更新)
const mockResources: Resource[] = [
  {
    id: 'iejnU3p4ut9g',
    title: '夕新软件库_5.0.0稳定版.apk',
    description: '夕新软件库最新稳定版，提供海量精品资源下载。大小：17.4 M',
    categoryId: 'software',
    lanzaoUrl: 'https://yxlzy.lanzoue.com/iejnU3p4ut9g',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5天前
  },
  {
    id: 'iLMVp3oawaej',
    title: '夕新软件库_5.0.0.apk',
    description: '夕新软件库主程序。大小：17.3 M',
    categoryId: 'software',
    lanzaoUrl: 'https://yxlzy.lanzoue.com/iLMVp3oawaej',
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString() // 16天前
  },
  {
    id: 'iFsD739imbaj',
    title: '夕新软件库_4.3.0稳定版.apk',
    description: '历史稳定版本。大小：28.7 M',
    categoryId: 'software',
    lanzaoUrl: 'https://yxlzy.lanzoue.com/iFsD739imbaj',
    createdAt: '2025-10-28T00:00:00Z'
  },
  {
    id: 'iR33Q35c15uh',
    title: '夕新软件库_2.0.0.apk',
    description: '较早的版本回顾。大小：10.6 M',
    categoryId: 'software',
    lanzaoUrl: 'https://yxlzy.lanzoue.com/iR33Q35c15uh',
    createdAt: '2025-09-04T00:00:00Z'
  },
  {
    id: '1',
    title: 'Cursor AI 编程神器',
    description: '强大的AI驱动的代码编辑器，内置GPT-4，提升开发效率。',
    categoryId: 'ai',
    lanzaoUrl: 'https://wwz.lanzoue.com/ixxxxxxxxx',
    password: 'abcd',
    createdAt: '2026-05-10T10:00:00Z'
  }
];

/**
 * 获取所有分类列表
 * 此处以后替换为 API 链接： return fetch('/api/categories').then(res => res.json())
 */
export async function getCategories(): Promise<Category[]> {
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCategories);
    }, 300);
  });
}

/**
 * 获取资源列表
 * 此处以后替换为 API 链接： return fetch(`/api/resources?categoryId=${categoryId}`).then(res => res.json())
 * @param categoryId - 可选，如果不传或传 'all' 则返回所有资源
 */
export async function getResources(categoryId: string = 'all'): Promise<Resource[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (categoryId === 'all') {
        resolve(mockResources);
      } else {
        const filtered = mockResources.filter(r => r.categoryId === categoryId);
        resolve(filtered);
      }
    }, 500);
  });
}
