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
  { id: 'ai', name: 'AI工具' },
  { id: 'design', name: '设计素材' },
  { id: 'dev', name: '开发文档' },
  { id: 'software', name: '常用软件' },
];

// 模拟的蓝奏云资源数据
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Cursor AI 编程神器',
    description: '强大的AI驱动的代码编辑器，内置GPT-4，提升开发效率。',
    categoryId: 'ai',
    lanzaoUrl: 'https://wwz.lanzoue.com/ixxxxxxxxx', // 演示链接
    password: 'abcd', // 带提取码的例子
    createdAt: '2026-05-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'Photoshop 2026 绿色精简版',
    description: '免安装，解压即用。包含最新AI生成填充功能。',
    categoryId: 'software',
    lanzaoUrl: 'https://wwz.lanzoue.com/iyyyyyyyyy',
    password: '8888',
    createdAt: '2026-05-12T14:30:00Z'
  },
  {
    id: '3',
    title: 'Midjourney 提示词大全词典',
    description: '1000+ 高质量 MJ 提示词，按风格和主题分类，快速出图必备。',
    categoryId: 'design',
    lanzaoUrl: 'https://wwz.lanzoue.com/izzzzzzzzz',
    // 没填密码代表不需要提取码
    createdAt: '2026-05-14T09:15:00Z'
  },
  {
    id: '4',
    title: 'Vue 3 + Vite 实战教程(PDF)',
    description: '从入门到精通，包含完整项目实战源码。',
    categoryId: 'dev',
    lanzaoUrl: 'https://wwz.lanzoue.com/iaaaaaaaaa',
    password: 'vue3',
    createdAt: '2026-05-15T08:00:00Z'
  },
];

/**
 * 获取所有分类列表
 * 后期替换为： return fetch('/api/categories').then(res => res.json())
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
 * 后期替换为： return fetch(`/api/resources?categoryId=${categoryId}`).then(res => res.json())
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
