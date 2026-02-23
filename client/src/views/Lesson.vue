<template>
  <div class="lesson-layout flex h-screen bg-surface overflow-hidden animate-fade-in relative">
    <!-- Sidebar — Paper Style -->
    <div 
      :class="[
        isSidebarCollapsed ? '-translate-x-full absolute lg:relative lg:!w-0 lg:!min-w-0 is-collapsed' : 'translate-x-0 w-80'
      ]"
      class="bg-paper border-r border-paper-line flex flex-col shrink-0 shadow-sm z-30 transition-all duration-300 ease-in-out overflow-hidden"
    >
      <div class="p-5 border-b border-paper-line flex items-center justify-between">
        <div class="flex items-center gap-4 min-w-0">
          <button @click="goHome" class="p-2 hover:bg-surface-secondary rounded-full transition-all border border-transparent hover:border-paper-line text-ink-secondary flex-shrink-0">
            <HomeIcon class="w-4 h-4" />
          </button>
          <div class="flex flex-col min-w-0">
            <span class="text-[10px] font-bold text-ink-tertiary uppercase tracking-wider">当前课程</span>
            <span class="font-bold text-sm text-ink truncate">{{ course?.title }}</span>
          </div>
        </div>
        <button @click="isSidebarCollapsed = true" class="p-2 hover:bg-surface-secondary rounded-full text-ink-tertiary lg:hidden">
          <ChevronLeft class="w-5 h-5" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div 
          v-for="l in course?.lessons" 
          :key="l.id"
          @click="changeLesson(l.id)"
          :class="[currentLessonId == l.id ? 'bg-surface-secondary text-accent border-paper-line shadow-sm' : 'hover:bg-surface-secondary/50 text-ink-secondary border-transparent']"
          class="mx-1 my-1 px-4 py-4 text-xs cursor-pointer transition-all border rounded-xl flex items-center justify-between group"
        >
          <div class="flex items-center gap-4 min-w-0">
            <span :class="[currentLessonId == l.id ? 'text-accent' : 'text-ink-tertiary']" class="font-mono text-[10px] bg-paper px-1.5 py-0.5 rounded border border-paper-line shadow-inner">
              {{ String(l.id).padStart(2, '0') }}
            </span>
            <span :class="[currentLessonId == l.id ? 'font-bold' : 'font-medium']" class="truncate max-w-[170px]">{{ l.title }}</span>
          </div>
          <div v-if="currentLessonId == l.id" class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
          <PlayCircle v-else class="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 transition-opacity" />
        </div>
      </div>
    </div>

    <!-- Sidebar Collapse Toggle Button (Desktop) -->
    <button 
      @click="isSidebarCollapsed = !isSidebarCollapsed"
      class="hidden lg:flex fixed top-1/2 z-40 bg-white border border-paper-line p-1 px-1.5 rounded-r-lg shadow-md hover:bg-surface-secondary transition-all text-ink-tertiary items-center justify-center group"
      :style="{ left: isSidebarCollapsed ? '0px' : '319px', transform: 'translateY(-50%)' }"
    >
      <ChevronRight v-if="isSidebarCollapsed" class="w-4 h-4" />
      <ChevronLeft v-else class="w-4 h-4" />
    </button>

    <!-- Main Player Area -->
    <div class="flex-1 flex flex-col min-w-0 transition-all duration-300">
      <header class="h-14 glass border-b border-paper-line px-8 flex items-center justify-between z-20">
        <div class="flex items-center gap-4">
          <button 
            v-if="isSidebarCollapsed"
            @click="isSidebarCollapsed = false" 
            class="p-2 hover:bg-surface-secondary rounded-full lg:hidden"
          >
            <MenuIcon class="w-4 h-4 text-ink-secondary" />
          </button>
          <h2 class="text-xs font-bold text-ink-secondary tracking-tight">
            单元 {{ currentLessonId }} <span class="mx-2 text-ink-tertiary">|</span> {{ lessonTitle }}
          </h2>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-paper border border-green-100 px-3 py-1 rounded-full shadow-sm">
            <div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            <span class="text-[10px] text-green-600 font-bold uppercase tracking-tight">
              环境就绪
            </span>
          </div>
        </div>
      </header>
      
      <div class="flex-1 relative min-h-0 bg-surface-secondary p-4 md:p-8 overflow-y-auto overflow-x-hidden">
        <div class="w-full h-full max-w-6xl mx-auto shadow-2xl rounded-2xl border border-paper-line bg-paper relative flex flex-col overflow-hidden">
           <LessonPlayer v-if="lessonSlides.length" :slides="lessonSlides" :key="currentLessonId" />
           <div v-else class="flex flex-col items-center justify-center h-full text-ink-tertiary">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></div>
              <p class="text-sm font-medium italic">正在为您准备课程内容...</p>
           </div>
        </div>
      </div>
    </div>
    
    <!-- Study Buddy AI Global -->
    <StudyBuddy 
      v-if="fullLessonContext" 
      :context="fullLessonContext" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Home as HomeIcon, PlayCircle, ChevronLeft, ChevronRight, Menu as MenuIcon } from 'lucide-vue-next'
import LessonPlayer from '../components/LessonPlayer.vue'
import StudyBuddy from '../components/StudyBuddy.vue'
import { loadCourseInfo, loadLessonMarkdown, parseMarkdownToSlides } from '../data/courseLoader'

const route = useRoute()
const router = useRouter()

const isSidebarCollapsed = ref(false)
const courseId = ref(route.params.courseId)
const currentLessonId = ref(route.params.lessonId)

const course = ref(null)
const lessonSlides = ref([])

const lessonTitle = computed(() => {
  const l = course.value?.lessons.find(l => l.id == currentLessonId.value)
  return l ? l.title : ''
})

const fullLessonContext = computed(() => {
  if (!lessonSlides.value.length) return ''
  return lessonSlides.value.map(s => `${s.title}\n${s.content}`).join('\n\n')
})

const loadCourseData = async () => {
  const info = await loadCourseInfo(courseId.value)
  if (info) {
    course.value = info
    await loadLessonContent()
  }
}

const loadLessonContent = async () => {
  const lesson = course.value?.lessons.find(l => l.id == currentLessonId.value)
  if (lesson) {
    const markdown = await loadLessonMarkdown(courseId.value, lesson.path)
    lessonSlides.value = parseMarkdownToSlides(markdown)
  }
}

const changeLesson = (id) => {
  router.push(`/lesson/${courseId.value}/${id}`)
}

const goHome = () => {
  router.push('/')
}

watch(() => route.params.lessonId, (newId) => {
  currentLessonId.value = newId
  loadLessonContent()
})

onMounted(() => {
  loadCourseData()
})
</script>

<style scoped>
:deep(.prose img) {
  max-width: 80%;
  max-height: 60vh;
  width: auto;
  height: auto;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--paper-line);
  display: block;
  object-fit: contain;
  background: white;
}

:deep(.prose .img-container) {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2.5rem 0;
  gap: 12px;
}

:deep(.prose .img-caption) {
  font-size: 12px;
  color: var(--ink-tertiary);
  font-weight: 500;
  text-align: center;
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite ease-in-out;
}

/* Ensure sidebar content disappears immediately on collapse */
.lesson-layout > div:first-child * {
  transition: opacity 0.2s;
}
.lesson-layout > .is-collapsed * {
  opacity: 0;
  pointer-events: none;
}
</style>
