<script setup lang="ts">
import { computed } from 'vue';
import type { Item } from '../types';

/**
 * 单文件卡片组件
 * 展示单个蓝奏云文件信息，包括跳转链接
 */

const props = defineProps<{
  item: Item;
}>();

/**
 * 判断是否为新资源 (最近 7 天)
 */
const isNew = computed(() => {
  const createdDate = new Date(props.item.createdAt);
  const diffTime = Math.abs(new Date().getTime() - createdDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
});

const emit = defineEmits<{
  (e: 'copy', text: string): void;
}>();

/**
 * 复制密码功能
 * 复制到剪贴板并向父组件发送通知事件
 */
const copyPassword = async (pwd: string) => {
  try {
    await navigator.clipboard.writeText(pwd);
    emit('copy', '提取码已复制');
  } catch (err) {
    console.error('复制失败:', err);
  }
};
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col h-full">

    <!-- 头部：标题和分类标签 -->
    <div class="flex justify-between items-start mb-3 gap-2">
      <div class="flex items-center gap-3">
        <!-- 真实的 App 图标图片 -->
        <img
          v-if="item.icon"
          :src="item.icon"
          class="w-10 h-10 object-cover rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 flex-shrink-0"
          alt="icon"
        />
        <!-- 文字默认图标回退 -->
        <div
          v-else-if="item.fallbackIcon"
          class="w-10 h-10 flex items-center justify-center bg-indigo-50 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300 text-[10px] font-bold rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 flex-shrink-0 uppercase"
        >
          {{ item.fallbackIcon }}
        </div>
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight">
          {{ item.title }}
        </h3>
      </div>
      <span
        v-if="isNew"
        class="flex-shrink-0 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1"
      >
        NEW
      </span>
    </div>

    <!-- 描述 -->
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-5 flex-grow line-clamp-3">
      {{ item.description }}
    </p>

    <!-- 底部操作区 -->
    <div class="mt-auto">

      <!-- 提取码展示区 -->
      <div v-if="item.password" class="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mb-3 border border-gray-100 dark:border-gray-600">
        <span class="text-xs text-gray-500 dark:text-gray-400">提取码: <strong class="text-gray-800 dark:text-gray-200 text-sm ml-1">{{ item.password }}</strong></span>
        <button
          @click="copyPassword(item.password)"
          class="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 px-3 py-1 rounded-lg transition-colors"
        >
          复制
        </button>
      </div>

      <!-- 去下载按钮 -->
      <a
        :href="item.lanzaoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-full text-center bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
      >
        前往蓝奏云下载
      </a>
    </div>
  </div>
</template>
