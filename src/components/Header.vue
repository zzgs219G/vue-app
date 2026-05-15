<script setup lang="ts">
/**
 * 顶部导航栏组件
 * 简单明了，包含网站标题和描述
 */
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-10">
    <div class="max-w-5xl mx-auto px-4 py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-indigo-600 tracking-tight">AI资源聚合</h1>
        <p class="text-sm text-gray-500 mt-1">你的云端百宝箱 • 专注蓝奏云资源分享</p>
      </div>

      <!-- 搜索框预留位（暂不实现搜索逻辑，纯UI展示） -->
      <div class="w-full md:w-auto">
        <input
          type="text"
          placeholder="搜索资源..."
          class="w-full md:w-64 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
      </div>
    </div>
  </header>
</template>
