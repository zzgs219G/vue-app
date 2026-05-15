<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Category, Resource } from './types';
import { getCategories, getResources } from './api';

import Header from './components/Header.vue';
import CategoryList from './components/CategoryList.vue';
import ResourceCard from './components/ResourceCard.vue';
import Toast from './components/Toast.vue';

/**
 * 根组件 App.vue
 * 所有的状态管理（分类、资源列表、加载状态）都在这里，不使用 Vue Router。
 * 这样的结构非常扁平，适合在手机上快速查看和修改代码。
 */

// 状态定义
const categories = ref<Category[]>([]);
const resources = ref<Resource[]>([]);
const activeCategoryId = ref<string>('all');
const searchQuery = ref<string>('');
const isLoading = ref<boolean>(true);

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
 * 过滤后的资源列表
 * 根据搜索关键词和当前分类进行实时过滤
 */
const filteredResources = computed(() => {
  let result = resources.value;

  // 搜索过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter(res =>
      res.title.toLowerCase().includes(query) ||
      res.description.toLowerCase().includes(query)
    );
  }

  return result;
});

/**
 * 组件初始化加载数据
 * 此处以后替换为 API 链接
 */
onMounted(async () => {
  try {
    isLoading.value = true;

    // 并发请求分类和全部资源
    const [cats, res] = await Promise.all([
      getCategories(),
      getResources('all')
    ]);

    categories.value = cats;
    resources.value = res;

  } catch (error) {
    console.error('加载数据失败:', error);
  } finally {
    isLoading.value = false;
  }
});

/**
 * 处理分类切换逻辑
 * 此处以后替换为 API 链接
 * @param categoryId 选中的分类ID
 */
const handleCategorySelect = async (categoryId: string) => {
  if (activeCategoryId.value === categoryId) return;

  activeCategoryId.value = categoryId;
  isLoading.value = true;

  try {
    // 根据选中的分类拉取对应的资源数据
    resources.value = await getResources(categoryId);
  } catch (error) {
    console.error('切换分类失败:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 顶部导航 -->
    <Header v-model="searchQuery" />

    <!-- 分类筛选栏 -->
    <div class="bg-white/80 backdrop-blur-md sticky top-[76px] md:top-[88px] z-10 border-b border-gray-100">
      <CategoryList
        :categories="categories"
        :active-category-id="activeCategoryId"
        @select="handleCategorySelect"
      />
    </div>

    <!-- 主体内容区 -->
    <main class="flex-grow p-4 max-w-5xl mx-auto w-full">

      <!-- 加载中状态 -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-pulse flex flex-col items-center">
          <div class="h-8 w-8 bg-indigo-200 rounded-full mb-4"></div>
          <p class="text-gray-400 text-sm">正在加载资源...</p>
        </div>
      </div>

      <!-- 资源网格列表 -->
      <TransitionGroup
        v-else-if="filteredResources.length > 0"
        tag="div"
        name="list"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-4"
      >
        <ResourceCard
          v-for="resource in filteredResources"
          :key="resource.id"
          :resource="resource"
          @copy="triggerToast"
        />
      </TransitionGroup>

      <!-- 空状态 -->
      <div v-else class="text-center py-20 text-gray-500">
        <p>该分类下暂无资源。</p>
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
