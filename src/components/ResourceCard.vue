<script setup lang="ts">
import type { Resource } from '../types';

/**
 * 资源卡片组件
 * 展示单个蓝奏云资源的信息，包括快速复制密码和跳转链接
 */

defineProps<{
  resource: Resource;
}>();

// 简单的复制密码功能
const copyPassword = async (pwd: string) => {
  try {
    await navigator.clipboard.writeText(pwd);
    alert('提取码已复制: ' + pwd);
  } catch (err) {
    console.error('复制失败:', err);
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">

    <!-- 头部：标题和分类标签 -->
    <div class="flex justify-between items-start mb-3">
      <h3 class="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">
        {{ resource.title }}
      </h3>
    </div>

    <!-- 描述 -->
    <p class="text-sm text-gray-500 mb-5 flex-grow line-clamp-3">
      {{ resource.description }}
    </p>

    <!-- 底部操作区 -->
    <div class="mt-auto">

      <!-- 提取码展示区 -->
      <div v-if="resource.password" class="flex items-center justify-between bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
        <span class="text-xs text-gray-500">提取码: <strong class="text-gray-800 text-sm ml-1">{{ resource.password }}</strong></span>
        <button
          @click="copyPassword(resource.password)"
          class="text-xs text-indigo-600 font-medium hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg"
        >
          复制
        </button>
      </div>

      <!-- 去下载按钮 -->
      <a
        :href="resource.lanzaoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
      >
        前往蓝奏云下载
      </a>
    </div>
  </div>
</template>
