<template>
  <div class="llm-chat relative z-10 paper shadow-2xl rounded-2xl overflow-hidden text-ink font-sans text-sm flex flex-col h-[500px]">
    <div class="terminal-header glass px-5 py-3 flex items-center justify-between border-b border-paper-line shrink-0">
      <div class="flex gap-2">
        <div class="w-2.5 h-2.5 rounded-full bg-ink-light opacity-30"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-ink-light opacity-30"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-ink-light opacity-30"></div>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-[10px] font-bold text-ink-tertiary tracking-widest uppercase">Intelligent Companion</div>
        <div class="relative">
          <select 
            v-model="selectedModel" 
            class="bg-surface-secondary border border-paper-line text-[10px] px-3 py-1 rounded-full text-accent font-bold outline-none min-w-[140px] cursor-pointer hover:bg-surface-tertiary transition-all"
            :disabled="loadingModels"
          >
            <option v-if="loadingModels" value="">正在加载模型...</option>
            <option v-else-if="connectionError" value="">🚫 连接异常</option>
            <option v-else-if="models.length === 0" value="">⚠️ 未检测到模型</option>
            <option v-for="m in models" :key="m.name" :value="m.name">{{ m.name }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-surface" ref="chatContainer">
      <div v-if="connectionError" class="h-full flex flex-col items-center justify-center text-red-500 gap-4 p-8 text-center animate-fade-in">
        <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shadow-sm">
          <div class="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
        </div>
        <div>
          <p class="font-bold text-xs uppercase tracking-widest mb-2">服务未就绪</p>
          <p class="text-[10px] text-ink-tertiary leading-relaxed">
            请确认本地 Ollama 环境已启动。<br/>
            后端正尝试同步模型列表...
          </p>
        </div>
      </div>

      <div v-else-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-ink-tertiary gap-4">
        <div class="w-16 h-16 bg-surface-secondary rounded-2xl flex items-center justify-center border border-paper-line shadow-inner">
          <MessageSquare class="w-8 h-8 opacity-20" />
        </div>
        <div class="text-center">
          <p class="font-bold text-xs uppercase tracking-widest mb-1">开始自由探索</p>
          <p class="text-[10px] opacity-60 font-medium">在下方输入任何关于编程的问题</p>
        </div>
      </div>
      
      <div v-for="(msg, i) in messages" :key="i" 
           :class="[msg.role === 'user' ? 'flex-row-reverse' : 'flex-row']" 
           class="flex items-start gap-4 animate-fade-in">
        <div :class="[msg.role === 'user' ? 'bg-accent text-white shadow-accent/20' : 'bg-paper text-ink shadow-sm border border-paper-line']" 
             class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
          <User v-if="msg.role === 'user'" class="w-4 h-4" />
          <Bot v-else class="w-4 h-4" />
        </div>
        <div :class="[msg.role === 'user' ? 'bg-accent/5 border-accent/10 text-ink' : 'bg-paper border-paper-line shadow-sm text-ink-secondary']"
             class="max-w-[85%] p-4 rounded-2xl border text-[13px] leading-relaxed shadow-sm">
          <template v-if="msg.role === 'user'">
            <div class="whitespace-pre-wrap font-medium">{{ msg.content }}</div>
          </template>
          <template v-else>
            <div v-for="(part, idx) in parseMessage(msg.content)" :key="idx">
              <!-- Think Block -->
              <div v-if="part.type === 'think'" class="mb-4 bg-surface-secondary/50 rounded-xl border border-paper-line overflow-hidden">
                <button 
                  @click="toggleThink(i + '-' + idx)"
                  class="w-full px-4 py-2 flex items-center justify-between text-[10px] text-ink-tertiary hover:bg-surface-secondary transition-colors font-bold uppercase tracking-wider"
                >
                  <div class="flex items-center gap-2">
                    <BrainCircuit class="w-3.5 h-3.5 text-accent" />
                    <span>AI Reasoning</span>
                  </div>
                  <ChevronDown v-if="expandedThinks.has(i + '-' + idx)" class="w-3.5 h-3.5" />
                  <ChevronRight v-else class="w-3.5 h-3.5" />
                </button>
                <div v-if="expandedThinks.has(i + '-' + idx)" class="px-5 py-4 text-ink-tertiary italic border-t border-paper-line text-[12px] bg-paper">
                  {{ part.content }}
                </div>
              </div>
              <!-- Text Block -->
              <div v-else class="markdown-body" v-html="renderMarkdown(part.content)"></div>
            </div>
          </template>
        </div>
      </div>
      
      <div v-if="loading" class="flex items-start gap-4 animate-pulse">
        <div class="bg-paper border border-paper-line w-8 h-8 rounded-xl flex items-center justify-center shadow-sm">
          <Bot class="w-4 h-4 text-ink-tertiary" />
        </div>
        <div class="bg-paper border border-paper-line p-4 rounded-2xl flex gap-1.5 shadow-sm">
          <div class="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce"></div>
          <div class="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div class="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-paper border-t border-paper-line shrink-0">
      <form @submit.prevent="sendMessage" class="flex gap-3 items-end max-w-4xl mx-auto">
        <div class="relative flex-1 group">
          <textarea 
            v-model="input" 
            @keydown.enter.prevent="sendMessage"
            placeholder="询问 AI 任何问题..."
            class="w-full bg-surface-secondary border border-paper-line rounded-2xl px-5 py-3 pr-12 text-sm text-ink outline-none focus:ring-1 focus:ring-accent focus:bg-paper transition-all resize-none min-h-[44px] max-h-[120px]"
            rows="1"
          ></textarea>
          <div class="absolute right-3 bottom-2 text-[9px] font-bold text-ink-tertiary uppercase tracking-widest hidden group-focus-within:block animate-fade-in">
            Enter 发送
          </div>
        </div>
        <button 
          type="submit" 
          :disabled="loading || !input.trim() || !selectedModel"
          class="bg-accent hover:bg-accent/90 text-white p-3 rounded-xl disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-accent/20 active:scale-90"
        >
          <Send class="w-5 h-5" />
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import axios from 'axios'
import MarkdownIt from 'markdown-it'
import { MessageSquare, User, Bot, Send, ChevronDown, ChevronRight, BrainCircuit } from 'lucide-vue-next'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const models = ref([])
const selectedModel = ref('')
const loadingModels = ref(true)
const connectionError = ref('')
const messages = ref([])
const input = ref('')
const loading = ref(false)
const chatContainer = ref(null)
const expandedThinks = ref(new Set())

const toggleThink = (index) => {
  if (expandedThinks.value.has(index)) {
    expandedThinks.value.delete(index)
  } else {
    expandedThinks.value.add(index)
  }
}

const parseMessage = (content) => {
  const thinkRegex = /<think>([\s\S]*?)<\/think>/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = thinkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'think', content: match[1] })
    lastIndex = thinkRegex.lastIndex
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) })
  }

  return parts.length > 0 ? parts : [{ type: 'text', content }]
}

const renderMarkdown = (content) => {
  return md.render(content)
}

const fetchModels = async () => {
  loadingModels.value = true
  connectionError.value = ''
  try {
    const res = await axios.get('http://localhost:3001/api/ollama/models')
    models.value = res.data.models || []
    if (res.data.error) {
      connectionError.value = res.data.error
    }
    if (models.value.length > 0) {
      selectedModel.value = models.value[0].name
    }
  } catch (err) {
    connectionError.value = '无法连接到后端服务器'
    console.error('Failed to fetch ollama models', err)
  } finally {
    loadingModels.value = false
  }
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

watch(messages, () => scrollToBottom(), { deep: true })

const sendMessage = async () => {
  if (!input.value.trim() || loading.value || !selectedModel.value) return
  
  const userText = input.value
  messages.value.push({ role: 'user', content: userText })
  input.value = ''
  loading.value = true
  
  // Add an empty assistant message for streaming
  const assistantMsgIndex = messages.value.length
  messages.value.push({ role: 'assistant', content: '' })
  
  try {
    const response = await fetch('http://localhost:3001/api/ollama/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedModel.value,
        messages: messages.value.slice(0, -1), // Exclude the placeholder
        stream: true
      })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const json = JSON.parse(line)
          if (json.message && json.message.content) {
            messages.value[assistantMsgIndex].content += json.message.content
            scrollToBottom()
          }
        } catch (e) {
          // Some large chunks might be split, ignore partial JSON
        }
      }
    }
  } catch (err) {
    messages.value[assistantMsgIndex].content = '❌ 对话失败：无法连接到 Ollama 流式接口。'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchModels()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Markdown Styles */
:deep(.markdown-body) {
  color: var(--ink-secondary);
}
:deep(.markdown-body p) {
  margin-bottom: 1em;
}
:deep(.markdown-body code) {
  background: var(--surface-secondary);
  color: var(--accent);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: inherit;
  font-weight: 600;
}
:deep(.markdown-body pre) {
  background: var(--surface-secondary);
  padding: 1.25em;
  border-radius: 12px;
  overflow-x: auto;
  margin-bottom: 1.25em;
  border: 1px solid var(--paper-line);
}
:deep(.markdown-body pre code) {
  background: none;
  color: var(--ink);
  padding: 0;
  font-weight: 400;
}
:deep(.markdown-body ul, .markdown-body ol) {
  padding-left: 1.5em;
  margin-bottom: 1em;
}
:deep(.markdown-body ul) {
  list-style-type: disc;
}
:deep(.markdown-body ol) {
  list-style-type: decimal;
}
</style>
