<template>
  <div 
    class="study-buddy-container fixed z-[100] transition-all duration-500 ease-in-out"
    :style="{ 
      left: position.x + 'px', 
      top: position.y + 'px',
      cursor: isDragging ? 'grabbing' : 'auto'
    }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <!-- Collapsed State (Bubble Button) -->
    <div 
      v-if="isCollapsed" 
      @click="expandBuddy"
      class="w-12 h-12 rounded-full bg-accent shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all animate-bounce-subtle"
    >
      <Bot class="w-6 h-6 text-white" />
    </div>

    <!-- Expanded State -->
    <div v-else class="relative flex flex-col items-center">
      <!-- Chat Bubble -->
      <transition name="bubble">
        <div 
          v-if="showBubble" 
          class="chat-bubble absolute bottom-full mb-4 w-80 bg-white rounded-2xl shadow-2xl border border-paper-line p-5 flex flex-col gap-4 pointer-events-auto"
          @mousedown.stop
        >
          <div class="flex items-center justify-between mb-1">
            <span class="text-[10px] font-bold text-accent uppercase tracking-widest">伴学小智</span>
            <button @click="collapseBuddy" class="text-ink-tertiary hover:text-ink">
              <X class="w-3 h-3" />
            </button>
          </div>
          
          <div class="chat-messages max-h-60 overflow-y-auto custom-scrollbar text-xs text-ink-secondary leading-relaxed">
            <div v-if="messages.length === 0" class="italic opacity-60">
              我是伴学小智，有什么关于本页内容不懂的可以问我哦！
            </div>
            <div v-for="(msg, i) in messages" :key="i" :class="[msg.role === 'user' ? 'text-right' : 'text-left']" class="mb-2">
              <div 
                :class="[msg.role === 'user' ? 'bg-accent/5 ml-4' : 'bg-surface-secondary mr-4 prose prose-sm max-w-none']" 
                class="inline-block px-3 py-2 rounded-xl text-left"
                v-html="renderMarkdown(msg.content)"
              >
              </div>
            </div>
          </div>

          <form @submit.prevent="askQuestion" class="flex gap-2">
            <input 
              v-model="question" 
              placeholder="问我关于本页的问题..."
              class="flex-1 bg-surface-secondary border border-paper-line rounded-lg px-3 py-1.5 text-[11px] outline-none focus:ring-1 focus:ring-accent transition-all"
              @mousedown.stop
            />
            <button 
              type="submit" 
              :disabled="loading || !question.trim()"
              class="bg-accent text-white p-1.5 rounded-lg disabled:opacity-30 shadow-md active:scale-90 transition-all"
            >
              <Send v-if="!loading" class="w-3.5 h-3.5" />
              <Loader2 v-else class="w-3.5 h-3.5 animate-spin" />
            </button>
          </form>
        </div>
      </transition>

      <!-- Agent Avatar -->
      <div 
        class="agent-wrapper relative group"
        @click="isCollapsed = false; showBubble = true"
      >
        <div class="absolute inset-0 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/40 transition-all opacity-0 group-hover:opacity-100"></div>
        <img 
          src="/images/agent.png" 
          alt="Study Buddy" 
          class="w-48 h-48 object-contain drop-shadow-2xl relative z-10 hover:scale-105 transition-transform"
          draggable="false"
        />
        
        <!-- Status Indicator -->
        <div class="absolute bottom-1 right-1 w-4 h-4 bg-white rounded-full p-0.5 z-20 shadow-sm border border-paper-line">
          <div class="w-full h-full rounded-full" :class="loading ? 'bg-amber-400 animate-pulse' : 'bg-green-500'"></div>
        </div>
      </div>

      <!-- Departure Hint -->
      <transition name="fade">
        <div v-if="departureHint" class="absolute -top-12 bg-ink text-white text-[10px] px-3 py-1 rounded-full whitespace-nowrap shadow-xl z-50">
          需要我的时候再叫我哦 👋
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'
import MarkdownIt from 'markdown-it'
import { Bot, X, Send, Loader2 } from 'lucide-vue-next'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const renderMarkdown = (content) => {
  if (!content) return ''
  return md.render(content)
}

const props = defineProps({
  context: {
    type: String,
    default: ''
  }
})

const isCollapsed = ref(true)
const showBubble = ref(false)
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const position = ref({ x: window.innerWidth - 250, y: window.innerHeight - 250 })
const question = ref('')
const loading = ref(false)
const selectedModel = ref('deepseek-r1:1.5b')
const messages = ref([])
const departureHint = ref(false)
const lastOutsideClickTime = ref(null)

let timer = null

const startDrag = (e) => {
  if (e.target.closest('form') || e.target.closest('input')) return
  
  isDragging.value = true
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
  
  dragOffset.value = {
    x: clientX - position.value.x,
    y: clientY - position.value.y
  }
  
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', stopDrag)
  
  resetTimer()
}

const onDrag = (e) => {
  if (!isDragging.value) return
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
  
  position.value = {
    x: clientX - dragOffset.value.x,
    y: clientY - dragOffset.value.y
  }
}

const stopDrag = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}

const resetTimer = () => {
  lastOutsideClickTime.value = null
  departureHint.value = false
}

const checkInactivity = () => {
  if (!isCollapsed.value && !loading.value && lastOutsideClickTime.value) {
    if (Date.now() - lastOutsideClickTime.value > 20000) {
      departureHint.value = true
      setTimeout(() => {
        if (departureHint.value && lastOutsideClickTime.value) {
          isCollapsed.value = true
          showBubble.value = false
          setTimeout(() => departureHint.value = false, 2000)
        }
      }, 2000)
    }
  }
}

const expandBuddy = () => {
  isCollapsed.value = false
  showBubble.value = true
  resetTimer()
}

const collapseBuddy = () => {
  isCollapsed.value = true
  showBubble.value = false
  resetTimer()
}

const askQuestion = async () => {
  if (!question.value.trim() || loading.value) return
  
  const q = question.value
  messages.value.push({ role: 'user', content: q })
  question.value = ''
  loading.value = true
  resetTimer()
  
  try {
    const response = await fetch('http://localhost:3001/api/ollama/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedModel.value, 
        messages: [
          { role: 'system', content: `你是一个温柔、耐心的 AI 伴学助手“伴学小智”。以下是用户正在阅读的课程内容，请基于这些内容回答用户不懂的问题。如果内容中没有相关知识，请基于你的通用知识给予启发式回答。\\n\\n【当前页面内容】：\\n${props.context}` },
          ...messages.value
        ],
        stream: false
      })
    })

    const data = await response.json()
    if (response.status === 503) {
      messages.value.push({ role: 'assistant', content: '💬 AI 服务目前不可用（503）。请检查本地 Ollama 是否已启动，或对应模型是否已下载（ollama pull deepseek-r1:1.5b）。' })
    } else if (data.message && data.message.content) {
      messages.value.push({ role: 'assistant', content: data.message.content })
    }
  } catch (err) {
    messages.value.push({ role: 'assistant', content: '抱歉，我现在有点连接不上大脑。请确保后台服务以及本地 Ollama 均已运行。' })
  } finally {
    loading.value = false
    resetTimer()
  }
}

const handleGlobalClick = (e) => {
  const container = e.target.closest('.study-buddy-container')
  if (!container) {
    // Clicked elsewhere - start/reset the "outside" timer
    lastOutsideClickTime.value = Date.now()
  } else {
    // Clicked inside - stop counting down
    resetTimer()
    if (isCollapsed.value) {
      expandBuddy()
    }
  }
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3001/api/ollama/models')
    if (res.data.models && res.data.models.length > 0) {
      selectedModel.value = res.data.models[0].name
    }
  } catch (e) {}
  
  window.addEventListener('mousedown', handleGlobalClick)
  timer = setInterval(checkInactivity, 1000)
})

onUnmounted(() => {
  window.removeEventListener('mousedown', handleGlobalClick)
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.bubble-enter-active, .bubble-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.bubble-enter-from, .bubble-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.chat-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 10px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 2s infinite ease-in-out;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 3px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--accent);
  border-radius: 10px;
  opacity: 0.2;
}

:deep(.prose) {
  color: inherit;
  font-size: 12px;
}
:deep(.prose p) {
  margin: 0.5em 0;
}
:deep(.prose code) {
  background: rgba(0,0,0,0.05);
  padding: 0.2em 0.4em;
  border-radius: 4px;
}
</style>
