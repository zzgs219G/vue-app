<script setup lang="ts">
/**
 * 顶部导航栏组件
 * 包含网站标题、描述和搜索框
 */

defineProps<{
  modelValue: string;
  isDark: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'toggleTheme'): void;
}>();
</script>

<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20 transition-colors duration-300">
    <div class="max-w-5xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div class="flex justify-between items-start w-full md:w-auto">
        <div @click="emit('update:modelValue', '')" class="cursor-pointer">
          <h1 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">AI聚合导航</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">网盘资源 • 实用工具 • 智能体验一站式聚合</p>
        </div>

        <!-- 移动端暗黑模式切换按钮 -->
        <button
          @click="emit('toggleTheme')"
          class="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <span v-if="isDark">☀️</span>
          <span v-else>🌙</span>
        </button>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <!-- 搜索框 -->
        <div class="w-full md:w-auto relative flex-grow">
          <input
            :value="modelValue"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="搜索当前模块..."
            class="w-full md:w-64 px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 border border-transparent dark:border-gray-600 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow pr-10"
          />
          <!-- 清除按钮 -->
          <button
            v-if="modelValue"
            @click="emit('update:modelValue', '')"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="清除搜索"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
        </div>

        <!-- PC端暗黑模式切换按钮 -->
        <button
          @click="emit('toggleTheme')"
          class="hidden md:flex items-center justify-center p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors w-10 h-10"
          title="切换深色模式"
        >
          <span v-if="isDark" class="text-xl">☀️</span>
          <span v-else class="text-xl">🌙</span>
        </button>
      </div>
    </div>
  </header>
</template>
