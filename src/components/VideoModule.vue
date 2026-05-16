<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'copy', msg: string): void;
}>();

const videoUrl = ref('');

// 定义一些稳定的国内抖音去水印解析平台聚合
const parsingEngines = [
  {
    id: 'qishuiyin1',
    name: '去水印工具 1 号',
    desc: '国内稳定节点，纯净无广告',
    icon: '⚡',
    color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50',
    urlPattern: 'https://www.douyin.wtf/'
  },
  {
    id: 'qishuiyin2',
    name: '去水印工具 2 号',
    desc: '备用高速通道，支持图集解析',
    icon: '🖼️',
    color: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50',
    urlPattern: 'https://douyin.wtf/'
  },
  {
    id: 'qishuiyin3',
    name: '去水印工具 3 号',
    desc: '深度解析引擎，极速下载',
    icon: '🔥',
    color: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50',
    urlPattern: 'https://dy.kukutool.com/'
  }
];

const handleParse = (engine: typeof parsingEngines[0]) => {
  if (!videoUrl.value.trim()) {
    emit('copy', '请先粘贴视频链接！');
    return;
  }

  // Since APIs are blocked/CORS, we act as a portal/aggregator
  // directing them to the best tools with their copied link
  emit('copy', '链接已就绪，正在跳转解析引擎...');

  // Actually copying it to clipboard just in case the site needs manual paste
  navigator.clipboard.writeText(videoUrl.value).catch(() => {});

  setTimeout(() => {
    window.open(engine.urlPattern, '_blank');
  }, 800);
};

const handleClear = () => {
  videoUrl.value = '';
};
</script>

<template>
  <div class="w-full max-w-3xl mx-auto p-4 md:p-8 mt-4 md:mt-10 animate-fade-in">
    <!-- 头部引导 -->
    <div class="text-center mb-10">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-4 text-3xl shadow-sm">
        🎬
      </div>
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">抖音无水印解析</h2>
      <p class="text-gray-500 dark:text-gray-400">专属国内短视频/图集解析。粘贴口令链接，一键直达免嗅探提取引擎。</p>
    </div>

    <!-- 输入框区域 -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 mb-8 relative flex items-center">
      <input
        v-model="videoUrl"
        type="text"
        placeholder="在此处粘贴短视频分享链接 (例如: https://v.douyin.com/...)"
        class="w-full px-4 py-4 text-gray-700 dark:text-gray-200 dark:placeholder-gray-400 bg-transparent focus:outline-none"
      />
      <button
        v-if="videoUrl"
        @click="handleClear"
        class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-2 mr-2 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- 解析引擎选择列表 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="engine in parsingEngines"
        :key="engine.id"
        @click="handleParse(engine)"
        class="cursor-pointer border rounded-2xl p-5 transition-all transform hover:-translate-y-1 hover:shadow-md flex flex-col items-start"
        :class="engine.color"
      >
        <div class="text-2xl mb-3 bg-white/50 dark:bg-black/20 w-10 h-10 flex items-center justify-center rounded-xl">
          {{ engine.icon }}
        </div>
        <h3 class="font-bold text-lg mb-1">{{ engine.name }}</h3>
        <p class="text-sm opacity-80 leading-snug">{{ engine.desc }}</p>
      </div>
    </div>

    <div class="mt-8 text-center text-xs text-gray-400 dark:text-gray-500">
      * 聚合网不直接存储或解析视频，所有的解析请求由第三方工具引擎完成。
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
