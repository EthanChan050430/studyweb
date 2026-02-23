<template>
  <div class="page animate-fade-in">
    <!-- Nav — frosted glass -->
    <nav class="nav glass">
      <div class="nav-brand">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="13" cy="13" r="11"/>
          <path d="M9.5 13l2.5 2.5L16.5 10.5"/>
        </svg>
        <span>StudyWeb</span>
      </div>
      <div class="flex-1 max-w-sm mx-8 hidden md:block">
        <div class="relative">
          <input 
            type="text" 
            placeholder="搜索你感兴趣的学习资源" 
            class="w-full bg-surface-secondary border border-paper-line rounded-full px-4 py-1.5 text-xs outline-none focus:ring-1 focus:ring-accent transition-all" 
          />
        </div>
      </div>
      <div class="flex gap-6 items-center">
        <a class="nav-link text-xs font-medium" href="#courses">课程库</a>
        <div class="w-7 h-7 rounded-full bg-ink-light overflow-hidden border border-paper-line shadow-sm">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-full h-full object-cover" />
        </div>
      </div>
    </nav>

    <!-- Banner section styled as Hero -->
    <section class="mb-12 mt-8">
      <div class="paper overflow-hidden shadow-2xl relative">
        <swiper
          :slides-per-view="1"
          :loop="true"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          :modules="[Autoplay, Pagination]"
          class="h-[300px] md:h-[400px]"
        >
          <swiper-slide v-for="b in banners" :key="b.id">
            <div class="w-full h-full bg-cover bg-center flex flex-col justify-end p-8 md:p-12 text-white relative group cursor-pointer" :style="{ backgroundImage: `url(${b.img})` }">
              <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent"></div>
              <div class="relative z-10 animate-fade-in-up">
                 <span class="bg-accent text-white text-[10px] px-2 py-0.5 rounded-full mb-3 inline-block font-bold tracking-widest uppercase">精选推荐</span>
                 <h2 class="text-3xl md:text-5xl font-bold mb-3 tracking-tight">{{ b.title }}</h2>
                 <p class="text-white/70 max-w-xl line-clamp-2 mb-2 hidden md:block text-sm">开启你的编程之旅，从基础语法到实战项目，一步步带你成为领域达人。</p>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </section>

    <!-- Suggested Section with "Paper Stack" effect -->
    <section class="mb-14 px-2">
      <h3 class="text-lg font-bold flex items-center gap-2 mb-6 tracking-tight">
        <Sparkles class="w-5 h-5 text-accent" />
        猜你想看
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="c in suggestedCourses" :key="c.id" @click="goToCourse(c)" class="cursor-pointer group paper paper-stack p-0 hover:-translate-y-1 transition-all duration-300">
          <div class="relative aspect-video overflow-hidden rounded-t-[14px]">
            <img :src="c.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
            <div class="absolute bottom-2 right-2 glass text-ink text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">{{ c.lessonCount }} 课时</div>
          </div>
          <div class="p-4">
            <h4 class="font-bold text-sm line-clamp-2 leading-tight group-hover:text-accent transition-colors min-h-[2.5rem] mb-2">{{ c.title }}</h4>
            <div class="flex items-center gap-2">
              <span class="text-[9px] px-1.5 py-0.5 bg-surface-secondary text-ink-secondary rounded-full font-medium border border-paper-line">{{ c.category.toUpperCase() }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filter & Results Section -->
    <section id="courses" class="mb-20 px-2">
      <div class="sticky top-16 z-20 glass -mx-4 px-6 py-3 mb-8 rounded-full flex gap-4 items-center overflow-x-auto no-scrollbar shadow-sm border-paper-line">
        <span class="text-ink-secondary text-xs shrink-0 font-medium">分类:</span>
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCat = cat"
          :class="[activeCat === cat ? 'bg-accent text-white shadow-md' : 'hover:bg-surface-secondary text-ink-secondary']"
          class="px-4 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer"
        >
          {{ cat }}
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        <transition-group name="list">
          <article v-for="c in filteredCourses" :key="c.id" @click="goToCourse(c)" class="cursor-pointer group">
            <div class="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-surface-tertiary shadow-sm group-hover:shadow-md transition-shadow">
              <img :src="c.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 ring-1 ring-inset ring-ink/5 rounded-2xl"></div>
            </div>
            <h4 class="font-bold text-sm line-clamp-2 leading-snug group-hover:text-accent transition-colors mb-2">{{ c.title }}</h4>
            <div class="flex items-center justify-between text-[10px] text-ink-tertiary font-medium">
              <span class="bg-surface-secondary px-1.5 py-0.5 rounded">{{ c.category }}</span>
              <span>12.5万人在学</span>
            </div>
          </article>
        </transition-group>
      </div>
    </section>

    <!-- Lesson Selection Modal -->
    <LessonModal 
      :show="showModal" 
      :course="selectedCourse" 
      @close="showModal = false"
      @selectLesson="handleSelectLesson"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import { Sparkles } from 'lucide-vue-next'
import 'swiper/css'
import 'swiper/css/pagination'
import coursesData from '../data/courses.json'
import LessonModal from '../components/LessonModal.vue'
import { loadCourseInfo } from '../data/courseLoader'

const router = useRouter()
const banners = [
  { id: 1, title: '大模型进阶：RAG 架构实战', img: '/images/banner-rag.png' },
  { id: 2, title: 'AI 时代：构建你的私有知识库', img: '/images/banner-kb.png' }
]

const categories = ['全部', 'AI', 'Algorithm', 'Data Science']
const activeCat = ref('全部')

const suggestedCourses = coursesData.slice(0, 4)

const filteredCourses = computed(() => {
  if (activeCat.value === '全部') return coursesData
  return coursesData.filter(c => c.category.toLowerCase() === activeCat.value.toLowerCase())
})

// Modal State
const showModal = ref(false)
const selectedCourse = ref(null)

const goToCourse = async (course) => {
  const info = await loadCourseInfo(course.id)
  if (info) {
    selectedCourse.value = info
    showModal.value = true
  }
}

const handleSelectLesson = (lesson) => {
  showModal.value = false
  router.push(`/lesson/${selectedCourse.value.id}/${lesson.id}`)
}
</script>

<style scoped>
.page {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

/* ─── Frosted Nav ─── */
.nav {
  position: sticky;
  top: 14px;
  z-index: 50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  border-radius: 20px;
  margin-bottom: 24px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.nav-link {
  color: var(--ink-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--accent);
}

/* List Animation */
.list-enter-active, .list-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
