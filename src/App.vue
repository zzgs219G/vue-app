<script setup lang="ts">
import { ref } from 'vue';

import Header from './components/Header.vue';
import LanzouModule from './components/LanzouModule.vue';
import VideoModule from './components/VideoModule.vue';
import Toast from './components/Toast.vue';

/**
 * 根组件 App.vue
 * 宏观聚合导航层，负责在不同的工具模块之间切换。
 */

// 宏观状态定义
const currentModule = ref<string>('lanzou'); // 默认显示蓝奏云网盘模块
const searchQuery = ref<string>('');

// 定义所有可用的顶级模块 (未来可以无限扩展)
const topModules = [
  { id: 'lanzou', name: '网盘资源', icon: '☁️' },
  { id: 'video', name: '短视频去水印', icon: '🎬' },
  { id: 'images', name: 'AI图床', icon: '🖼️' },
  { id: 'wallpaper', name: '精选壁纸', icon: '📱' },
];

// Toast 状态
const showToast = ref(false);
const toastMessage = ref('');

/**
 * 触发 Toast 提示
 */
const triggerToast = (msg: string) => {
  toastMessage.value = msg;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部导航 -->
    <Header v-model="searchQuery" />

    <!-- 顶级模块导航区域 (网格平铺布局，适合移动端展现更多功能) -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-5xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        <button
          v-for="mod in topModules"
          :key="mod.id"
          @click="currentModule = mod.id"
          class="flex flex-col items-center justify-center p-3 rounded-xl transition-all border shadow-sm hover:shadow-md"
          :class="[
            currentModule === mod.id
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
              : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
          ]"
        >
          <span class="text-2xl mb-1 block">{{ mod.icon }}</span>
          <span class="text-xs font-medium">{{ mod.name }}</span>
        </button>
      </div>
    </div>

    <!-- 主体内容区：根据 currentModule 动态显示不同模块 -->
    <main class="flex-grow flex flex-col items-center w-full">

      <!-- 模块1：蓝奏云资源 -->
      <LanzouModule
        v-if="currentModule === 'lanzou'"
        :search-query="searchQuery"
        @copy="triggerToast"
      />

      <!-- 模块2：短视频去水印 -->
      <VideoModule
        v-else-if="currentModule === 'video'"
        @copy="triggerToast"
      />

      <!-- 占位模块：其他建设中的功能 -->
      <div v-else class="flex flex-col items-center justify-center py-32 text-center w-full">
        <div class="text-6xl mb-4">🚧</div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">模块建设中</h2>
        <p class="text-gray-500">此 AI 聚合功能尚未开放，敬请期待！</p>
      </div>

    </main>

    <!-- 简易页脚 -->
    <footer class="bg-white py-6 text-center text-xs text-gray-400 mt-10">
      <p>© 2026 资源聚合网. Powered by Vue 3 & Vite.</p>
    </footer>

    <!-- 全局 Toast -->
    <Toast :show="showToast" :message="toastMessage" />
  </div>
</template>

<style>
/* 列表过渡动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.list-move {
  transition: transform 0.3s ease;
}
</style>
