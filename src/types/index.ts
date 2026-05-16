/**
 * 项目数据类型定义
 * 所有的核心数据结构都在这里定义，方便全局复用。
 */

/**
 * 资源分类模型
 * 用于顶部/侧边栏的分类筛选
 */
export interface Tag {
  id: string;   // 分类ID
  name: string; // 分类名称，如 "AI工具", "设计素材"
}

/**
 * 蓝奏云单文件模型
 */
export interface Item {
  id: string;          // 资源的唯一标识符
  title: string;       // 资源名称标题
  description: string; // 资源的简短描述
  tagId: string;       // 所属分类的 ID

  // 蓝奏云特定字段
  lanzaoUrl: string;   // 蓝奏云分享链接
  password?: string;   // 蓝奏云提取码（如果有）

  // 补充信息
  createdAt: string;   // 资源的收录时间 (ISO格式字符串)
  icon?: string;       // (可选) 资源的图标 URL，可为空
}
