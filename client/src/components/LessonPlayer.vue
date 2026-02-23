<template>
  <div class="absolute inset-0 flex flex-col bg-[#FAF7F0] overflow-hidden">
    <div class="flex-1 p-6 md:p-16 overflow-y-auto custom-scrollbar">
      <transition 
        :name="transitionName" 
        mode="out-in"
      >
        <div v-if="slides && slides[currentPage]" :key="currentPage" class="slide-content max-w-4xl mx-auto flex flex-col pb-12">
          <!-- Slide Heading -->
          <div v-if="slides[currentPage].title" class="mb-10 animate-fade-in-down">
            <h1 class="text-4xl font-extrabold mb-4 text-ink tracking-tight leading-tight">
              {{ slides[currentPage].title }}
            </h1>
            <div class="w-16 h-1.5 bg-accent rounded-full"></div>
          </div>
          
          <!-- Slide Text (Markdown Rendered) -->
          <div class="prose prose-lg max-w-none text-ink-secondary leading-relaxed mb-12 animate-fade-in" v-html="renderMarkdown(slides[currentPage].content)"></div>

          <!-- Experiment Section -->
          <div v-if="slides[currentPage].experiment" class="mt-auto pt-8 animate-fade-in-up">
            <div class="mb-5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div :class="[slides[currentPage].experiment.type === 'chat' ? 'bg-accent' : 'bg-ink']" class="w-1.5 h-6 rounded-full"></div>
                <h3 class="font-bold text-ink">
                  {{ slides[currentPage].experiment.type === 'chat' ? '助教实验' : '在线实验' }}
                </h3>
              </div>
              <span class="text-[10px] text-ink-tertiary font-mono tracking-widest uppercase bg-surface-secondary px-2 py-1 rounded border border-paper-line">
                {{ slides[currentPage].experiment.type === 'chat' ? 'Interactive AI' : 'Live Code' }}
              </span>
            </div>
            
            <component 
              :is="getExperimentComponent(slides[currentPage].experiment.type)"
              v-bind="slides[currentPage].experiment"
            />
          </div>
        </div>
      </transition>
    </div>

    <!-- Navigation Overlay Buttons -->
    <button 
      @click="prevPage" 
      :disabled="currentPage === 0"
      class="nav-btn left"
      aria-label="Previous Page"
    >
      <div class="flex flex-col items-center gap-1">
        <ChevronLeft class="w-8 h-8" />
        <span class="text-[10px] font-bold">上一页</span>
      </div>
      <span class="btn-hit-area"></span>
    </button>
    
    <button 
      @click="nextPage" 
      :disabled="currentPage === slides.length - 1"
      class="nav-btn right"
      aria-label="Next Page"
    >
      <div class="flex flex-col items-center gap-1">
        <ChevronRight class="w-8 h-8" />
        <span class="text-[10px] font-bold">下一页</span>
      </div>
      <span class="btn-hit-area"></span>
    </button>

    <!-- Bottom Progress Bar -->
    <div class="h-1 bg-surface-secondary w-full overflow-hidden">
      <div 
        class="h-full bg-accent transition-all duration-300" 
        :style="{ width: `${((currentPage + 1) / (slides.length || 1)) * 100}%` }"
      ></div>
    </div>
    
    <div class="p-4 flex justify-between items-center text-[11px] text-ink-tertiary font-bold uppercase tracking-widest bg-paper border-t border-paper-line select-none">
      <span>第 {{ currentPage + 1 }} / {{ slides.length }} 页</span>
      <div class="flex gap-6">
        <button @click="prevPage" :disabled="currentPage === 0" class="hover:text-accent transition-colors disabled:opacity-30">PREV</button>
        <button @click="nextPage" :disabled="currentPage === slides.length - 1" class="hover:text-accent transition-colors disabled:opacity-30">NEXT</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, markRaw } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Terminal from './Terminal.vue'
import LLMChat from './LLMChat.vue'
import RAGPlayground from './RAGPlayground.vue'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const props = defineProps({
  slides: {
    type: Array,
    default: () => []
  }
})

const currentPage = ref(0)
const transitionName = ref('slide-left')

const renderMarkdown = (content) => {
  if (!content) return ''
  return md.render(content)
}

const getExperimentComponent = (type) => {
  if (type === 'terminal') return markRaw(Terminal)
  if (type === 'chat') return markRaw(LLMChat)
  if (type === 'rag') return markRaw(RAGPlayground)
  return null
}

const nextPage = () => {
  if (currentPage.value < props.slides.length - 1) {
    transitionName.value = 'slide-next'
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    transitionName.value = 'slide-prev'
    currentPage.value--
  }
}

watch(() => props.slides, () => {
  currentPage.value = 0
}, { deep: true })
</script>

<style scoped>
.slide-next-enter-active, .slide-next-leave-active,
.slide-prev-enter-active, .slide-prev-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.98);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-40px) scale(0.98);
}

.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-40px) scale(0.98);
}
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.98);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  color: var(--ink-secondary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-btn:hover:not(:disabled) {
  background: white;
  color: var(--accent);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.nav-btn:active:not(:disabled) {
  transform: translateY(-50%) scale(0.95);
}

.nav-btn:disabled {
  opacity: 0.15;
  cursor: not-allowed;
  filter: grayscale(1);
}

.nav-btn.left {
  left: 20px;
}

.nav-btn.right {
  right: 20px;
}

.btn-hit-area {
  position: absolute;
  inset: -20px;
}

.prose :deep(h1), .prose :deep(h2) {
  display: none; /* We handle headers manually if needed, or let them render if they aren't the title */
}
</style>
