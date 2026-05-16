<script setup lang="ts">
import { ref, onMounted } from 'vue';

import Header from './components/Header.vue';
import LanzouModule from './components/LanzouModule.vue';
import VideoModule from './components/VideoModule.vue';
import WallpaperModule from './components/WallpaperModule.vue';
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

// Hash Routing 逻辑：让链接可以直接分享到特定模块
onMounted(() => {
  const hash = window.location.hash.replace('#', '');
  if (topModules.some(m => m.id === hash)) {
    currentModule.value = hash;
  }

  // 监听浏览器前进后退
  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.replace('#', '');
    if (topModules.some(m => m.id === newHash)) {
      currentModule.value = newHash;
    }
  });
});

const switchModule = (moduleId: string) => {
  currentModule.value = moduleId;
  window.location.hash = moduleId;
};

// Dark Mode Theme 逻辑
const isDark = ref(false);

onMounted(() => {
  // Check system preference or localStorage
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia?.('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }
});

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
  }
};

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
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- 顶部导航 -->
    <Header v-model="searchQuery" :is-dark="isDark" @toggle-theme="toggleTheme" />

    <!-- 顶级模块导航区域 (网格平铺布局，适合移动端展现更多功能) -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div class="max-w-5xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
        <button
          v-for="mod in topModules"
          :key="mod.id"
          @click="switchModule(mod.id)"
          class="flex flex-col items-center justify-center p-3 rounded-xl transition-all border shadow-sm hover:shadow-md"
          :class="[
            currentModule === mod.id
              ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
              : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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

      <!-- 模块3：精选壁纸 -->
      <WallpaperModule
        v-else-if="currentModule === 'wallpaper'"
        @copy="triggerToast"
      />

      <!-- 占位模块：其他建设中的功能 -->
      <div v-else class="flex flex-col items-center justify-center py-32 text-center w-full">
        <div class="text-6xl mb-4">🚧</div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">模块建设中</h2>
        <p class="text-gray-500 dark:text-gray-400">此 AI 聚合功能尚未开放，敬请期待！</p>
      </div>

    </main>

    <!-- 简易页脚 -->
    <footer class="bg-white dark:bg-gray-800 py-6 text-center text-xs text-gray-400 dark:text-gray-500 mt-10 transition-colors duration-300">
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
