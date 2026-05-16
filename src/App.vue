<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Tag, Item } from './types';
import { getTags, getList } from './api';

import Header from './components/Header.vue';
import TagList from './components/TagList.vue';
import ItemCard from './components/ItemCard.vue';
import Toast from './components/Toast.vue';

/**
 * 根组件 App.vue
 * 所有的状态管理都在这里，不使用 Vue Router。
 * 这样的结构非常扁平，适合在手机上快速查看和修改代码。
 */

// 状态定义
const tags = ref<Tag[]>([]);
const list = ref<Item[]>([]);
const activeTagId = ref<string>('all');
const searchQuery = ref<string>('');

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

/**
 * 过滤后的单文件列表
 * 根据搜索关键词和当前标签进行实时过滤
 */
const filteredList = computed(() => {
  let result = list.value;

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }

  return result;
});

/**
 * 组件初始化加载数据
 */
onMounted(async () => {
  try {
    const [loadedTags, loadedList] = await Promise.all([
      getTags(),
      getList('all')
    ]);
    tags.value = loadedTags;
    list.value = loadedList;
  } catch (error) {
    console.error('加载数据失败:', error);
  }
});

/**
 * 处理分类切换逻辑
 * @param tagId 选中的标签ID
 */
const handleTagSelect = async (tagId: string) => {
  if (activeTagId.value === tagId) return;

  activeTagId.value = tagId;
  try {
    list.value = await getList(tagId);
  } catch (error) {
    console.error('切换标签失败:', error);
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 顶部导航 -->
    <Header v-model="searchQuery" />

    <!-- 分类筛选栏 -->
    <div class="bg-white/80 backdrop-blur-md sticky top-[76px] md:top-[88px] z-10 border-b border-gray-100">
      <TagList
        :tags="tags"
        :active-tag-id="activeTagId"
        @select="handleTagSelect"
      />
    </div>

    <!-- 主体内容区 -->
    <main class="flex-grow p-4 max-w-5xl mx-auto w-full">

      <!-- 资源网格列表 -->
      <TransitionGroup
        v-if="filteredList.length > 0"
        tag="div"
        name="list"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4"
      >
        <ItemCard
          v-for="item in filteredList"
          :key="item.id"
          :item="item"
          @copy="triggerToast"
        />
      </TransitionGroup>

      <!-- 空状态 -->
      <div v-else class="text-center py-20 text-gray-500">
        <p>暂无文件。</p>
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
