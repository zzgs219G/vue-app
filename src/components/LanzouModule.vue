<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Tag, Item } from '../types';
import { getTags, getList } from '../api';
import TagList from './TagList.vue';
import ItemCard from './ItemCard.vue';

const props = defineProps<{
  searchQuery: string;
}>();

const emit = defineEmits<{
  (e: 'copy', msg: string): void;
}>();

const tags = ref<Tag[]>([]);
const list = ref<Item[]>([]);
const activeTagId = ref<string>('all');

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

const handleTagSelect = async (tagId: string) => {
  if (activeTagId.value === tagId) return;
  activeTagId.value = tagId;
  try {
    list.value = await getList(tagId);
  } catch (error) {
    console.error('切换标签失败:', error);
  }
};

const filteredList = computed(() => {
  let result = list.value;
  if (props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase().trim();
    result = result.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }
  return result;
});
</script>

<template>
  <div class="w-full transition-colors duration-300">
    <!-- 蓝奏云模块专属二级标签栏 -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-[76px] md:top-[88px] z-10 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <TagList
        :tags="tags"
        :active-tag-id="activeTagId"
        @select="handleTagSelect"
      />
    </div>

    <!-- 蓝奏云资源网格列表 -->
    <div class="p-4 max-w-5xl mx-auto w-full">
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
          @copy="msg => emit('copy', msg)"
        />
      </TransitionGroup>

      <!-- 空状态 -->
      <div v-else class="text-center py-20 text-gray-500">
        <p>暂无文件。</p>
      </div>
    </div>
  </div>
</template>
