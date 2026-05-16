<script setup lang="ts">
import type { Tag } from '../types';

/**
 * 标签列表组件
 * 采用横向滚动的胶囊按钮，非常适合移动端。
 */

defineProps<{
  tags: Tag[];
  activeTagId: string;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();
</script>

<template>
  <!-- 水平滑动容器，隐藏滚动条 -->
  <div class="flex overflow-x-auto gap-2 py-4 px-4 max-w-5xl mx-auto scrollbar-hide">
    <button
      v-for="tag in tags"
      :key="tag.id"
      @click="emit('select', tag.id)"
      class="whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors"
      :class="[
        activeTagId === tag.id
          ? 'bg-indigo-600 text-white shadow-md dark:bg-indigo-500'
          : 'bg-white text-gray-600 hover:bg-indigo-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
      ]"
    >
      {{ tag.name }}
    </button>
  </div>
</template>

<style scoped>
/* 隐藏移动端的滚动条，保持UI整洁 */
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
