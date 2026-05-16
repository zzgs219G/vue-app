<script setup lang="ts">
import { ref, onMounted } from 'vue';

const emit = defineEmits<{
  (e: 'copy', msg: string): void;
}>();

interface Wallpaper {
  id: string;
  url: string;
  thumbnail: string;
  author: string;
}

const wallpapers = ref<Wallpaper[]>([]);
const isLoading = ref(true);

const fetchWallpapers = async () => {
  isLoading.value = true;
  try {
    // Generate 12 random high quality images from Unsplash
    // Note: Using picsum or unsplash source as a reliable free placeholder
    const fetched = Array.from({ length: 12 }).map((_, index) => {
      const id = Math.floor(Math.random() * 1000) + index;
      return {
        id: id.toString(),
        url: `https://picsum.photos/id/${id}/1920/1080`,
        thumbnail: `https://picsum.photos/id/${id}/400/600`, // Portrait style thumbnails
        author: `设计师 ${id}`
      };
    });

    // Simulate network delay for effect
    setTimeout(() => {
      wallpapers.value = fetched;
      isLoading.value = false;
    }, 500);

  } catch (error) {
    console.error('Failed to fetch wallpapers', error);
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchWallpapers();
});

const downloadWallpaper = async (url: string) => {
  emit('copy', '准备下载高质量壁纸...');
  // Actually open the full resolution image
  window.open(url, '_blank');
};
</script>

<template>
  <div class="w-full max-w-5xl mx-auto p-4 animate-fade-in">
    <!-- 头部引导 -->
    <div class="text-center mb-8 mt-4">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-2xl mb-4 text-3xl shadow-sm">
        📱
      </div>
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">精选壁纸库</h2>
      <p class="text-gray-500 dark:text-gray-400">每日更新高质量手机/电脑壁纸，点击直达原图下载。</p>

      <button
        @click="fetchWallpapers"
        class="mt-4 px-6 py-2 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 font-medium rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors"
      >
        <span class="mr-1">🔄</span> 换一批
      </button>
    </div>

    <!-- 加载中状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-pulse flex flex-col items-center">
        <div class="h-8 w-8 bg-pink-200 dark:bg-pink-800 rounded-full mb-4"></div>
        <p class="text-gray-400 dark:text-gray-500 text-sm">正在搜罗全网美图...</p>
      </div>
    </div>

    <!-- 瀑布流壁纸展示 -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="wp in wallpapers"
        :key="wp.id"
        class="relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer aspect-[2/3] bg-gray-200 dark:bg-gray-800"
        @click="downloadWallpaper(wp.url)"
      >
        <img
          :src="wp.thumbnail"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt="Wallpaper"
        />

        <!-- 悬浮遮罩与下载按钮 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p class="text-white text-sm font-medium drop-shadow-md mb-2">📸 {{ wp.author }}</p>
          <button class="w-full py-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-xl text-sm font-medium transition-colors">
            获取高清原图
          </button>
        </div>
      </div>
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
