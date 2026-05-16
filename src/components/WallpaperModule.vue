<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits<{
  (e: 'copy', msg: string): void;
}>();

// 定义分类标签，并绑定真实API的请求参数
const tags = [
  { id: 'mobile', name: '📱 手机壁纸', param: 'method=mobile', aspect: 'aspect-[9/16]' },
  { id: 'pc', name: '💻 电脑/2K', param: 'method=pc', aspect: 'aspect-video' },
  { id: 'anime', name: '🌸 二次元', param: 'lx=dongman', aspect: 'aspect-video' },
  { id: 'portrait', name: '💃 真人妹子', param: 'lx=meizi', aspect: 'aspect-video' },
  { id: 'scenery', name: '🏞️ 随机风景', param: 'lx=suiji', aspect: 'aspect-video' }
];

const activeTagId = ref<string>('mobile');

interface Wallpaper {
  id: string;
  url: string;
  thumbnail: string;
  author: string;
  aspectClass: string;
}

const wallpapers = ref<Wallpaper[]>([]);
const isLoading = ref(false);
const scrollTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
let page = 1;

// 真实接口批量拉取壁纸
const fetchMoreWallpapers = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  const currentTag = tags.find(t => t.id === activeTagId.value);
  const tagData = currentTag ? currentTag : tags[0]!;

  try {
    // API btstu 每次只返回一张，所以我们并发请求 8 张来构成瀑布流
    const promises = Array.from({ length: 8 }).map(async (_, index) => {
      const apiUrl = `https://api.btstu.cn/sjbz/api.php?format=json&${tagData.param}`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();

      if (data && data.code === '200' && data.imgurl) {
        return {
          id: `${page}-${index}-${Date.now()}`,
          url: data.imgurl,
          thumbnail: data.imgurl, // API returns a single URL, use it for both
          author: `精选图库`,
          aspectClass: tagData.aspect
        };
      }
      return null;
    });

    const results = await Promise.all(promises);

    // 过滤掉失败的空数据
    const fetchedWallpapers = results.filter(item => item !== null) as Wallpaper[];

    wallpapers.value.push(...fetchedWallpapers);
    page++;

  } catch (error) {
    console.error('Failed to fetch wallpapers', error);
    emit('copy', '获取壁纸失败，请稍后再试');
  } finally {
    isLoading.value = false;
  }
};

// 切换标签
const switchTag = (tagId: string) => {
  if (activeTagId.value === tagId) return;
  activeTagId.value = tagId;
  wallpapers.value = []; // 清空当前列表
  page = 1;
  fetchMoreWallpapers();
};

// 监听图片加载失败，直接在列表中踢出该图片
const handleImageError = (id: string) => {
  wallpapers.value = wallpapers.value.filter(wp => wp.id !== id);
};

// 启动无限滚动 Observer
const setupObserver = () => {
  observer = new IntersectionObserver((entries) => {
    const target = entries[0];
    if (target && target.isIntersecting) {
      fetchMoreWallpapers();
    }
  }, {
    rootMargin: '100px', // 提前 100px 触发加载
  });

  if (scrollTrigger.value) {
    observer.observe(scrollTrigger.value);
  }
};

onMounted(() => {
  fetchMoreWallpapers(); // 初始加载第一页
  setupObserver();
});

onBeforeUnmount(() => {
  if (observer && scrollTrigger.value) {
    observer.unobserve(scrollTrigger.value);
  }
});

const downloadWallpaper = async (url: string) => {
  emit('copy', '准备下载高质量壁纸...');
  window.open(url, '_blank');
};
</script>

<template>
  <div class="w-full">

    <!-- 头部横向标签栏 -->
    <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-[76px] md:top-[88px] z-10 border-b border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div class="flex overflow-x-auto gap-2 py-4 px-4 max-w-5xl mx-auto scrollbar-hide">
        <button
          v-for="tag in tags"
          :key="tag.id"
          @click="switchTag(tag.id)"
          class="whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors"
          :class="[
            activeTagId === tag.id
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-pink-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
          ]"
        >
          {{ tag.name }}
        </button>
      </div>
    </div>

    <div class="w-full max-w-5xl mx-auto p-4 animate-fade-in mt-4">
      <!-- 瀑布流壁纸展示 -->
      <!-- 动态调整列数以适应不同比例：横屏图（电脑/动漫等）放少点，竖屏图（手机）放多点 -->
      <div class="grid gap-4" :class="activeTagId === 'mobile' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'">
        <div
          v-for="wp in wallpapers"
          :key="wp.id"
          class="relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer bg-gray-200 dark:bg-gray-800 flex items-center justify-center"
          :class="wp.aspectClass"
          @click="downloadWallpaper(wp.url)"
        >
          <!-- 图片懒加载，加载失败触发 @error 自动销毁 -->
          <img
            :src="wp.thumbnail"
            loading="lazy"
            @error="handleImageError(wp.id)"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt="Wallpaper"
          />

          <!-- 悬浮遮罩与下载按钮 -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <p class="text-white text-sm font-medium drop-shadow-md mb-2">📸 {{ wp.author }}</p>
            <button class="w-full py-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-xl text-sm font-medium transition-colors">
              获取高清原图
            </button>
          </div>
        </div>
      </div>

      <!-- 无感加载触发器与动画 -->
      <div ref="scrollTrigger" class="flex justify-center items-center py-10 w-full">
        <div v-if="isLoading" class="flex items-center space-x-2 text-pink-400">
          <div class="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
          <div class="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
