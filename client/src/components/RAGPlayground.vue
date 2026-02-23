<template>
  <div class="rag-playground flex flex-col md:flex-row gap-6 h-[500px] animate-fade-in">
    <!-- Left: Knowledge Base Input -->
    <div class="flex-1 flex flex-col paper shadow-xl rounded-2xl overflow-hidden border border-paper-line">
      <div class="glass px-5 py-3 border-b border-paper-line flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Database class="w-4 h-4 text-accent" />
          <span class="text-xs font-bold text-ink-secondary uppercase tracking-widest">仿真知识库</span>
        </div>
        <div class="flex gap-1.5">
          <div class="w-2 h-2 rounded-full bg-green-400"></div>
          <div class="w-2 h-2 rounded-full bg-amber-400"></div>
        </div>
      </div>
      <div class="flex-1 p-4 bg-surface/30">
        <div class="text-[10px] text-ink-tertiary mb-3 font-bold uppercase tracking-widest">输入你的专业知识 (小抄)</div>
        <textarea 
          v-model="knowledgeBase"
          placeholder="例如：
Antigravity 是一款由 DeepMind 开发的 AI 助手。
它的核心优势是多模态理解与强大的代码执行能力。"
          class="w-full h-[calc(100%-30px)] bg-paper/50 border border-paper-line rounded-xl p-4 text-sm text-ink outline-none focus:ring-1 focus:ring-accent focus:bg-paper transition-all resize-none leading-relaxed custom-scrollbar shadow-inner"
        ></textarea>
      </div>
    </div>

    <!-- Right: Chat Interface -->
    <div class="flex-1 flex flex-col paper shadow-xl rounded-2xl overflow-hidden border border-paper-line relative">
      <div class="glass px-5 py-3 border-b border-paper-line flex items-center justify-between bg-accent/5">
        <div class="flex items-center gap-2">
          <MessageSquare class="w-4 h-4 text-accent" />
          <span class="text-xs font-bold text-ink-secondary uppercase tracking-widest">RAG 验证机</span>
        </div>
        <div v-if="selectedModel" class="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full capitalize">
          {{ selectedModel }}
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-surface/20" ref="chatContainer">
        <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-ink-tertiary opacity-40">
          <Bot class="w-10 h-10 mb-2" />
          <p class="text-[10px] font-bold uppercase tracking-widest">等待检索提问...</p>
        </div>
        
        <div v-for="(msg, i) in messages" :key="i" 
             :class="[msg.role === 'user' ? 'flex-row-reverse' : 'flex-row']" 
             class="flex items-start gap-3">
          <div :class="[msg.role === 'user' ? 'bg-accent text-white' : 'bg-paper text-ink border border-paper-line']" 
               class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[10px] shadow-sm">
            {{ msg.role === 'user' ? 'U' : 'AI' }}
          </div>
          <div :class="[msg.role === 'user' ? 'bg-accent/5 border-accent/10' : 'bg-paper border-paper-line']"
               class="max-w-[85%] p-3 rounded-xl border text-[12px] leading-relaxed shadow-sm">
            <div class="whitespace-pre-wrap">{{ msg.content }}</div>
          </div>
        </div>
        
        <div v-if="loading" class="flex gap-2 p-2">
          <div class="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
          <div class="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]"></div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-3 bg-paper border-t border-paper-line">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input 
            v-model="userInput" 
            placeholder="提问知识库中的内容..."
            class="flex-1 bg-surface-secondary border border-paper-line rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-accent transition-all"
          />
          <button 
            type="submit" 
            :disabled="loading || !userInput.trim()"
            class="bg-accent text-white p-2 rounded-xl disabled:opacity-30 shadow-md active:scale-90 transition-all"
          >
            <Send class="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { Database, MessageSquare, Send, Bot } from 'lucide-vue-next'

const knowledgeBase = ref('我的同桌最喜欢吃辣条')
const userInput = ref('')
const messages = ref([])
const loading = ref(false)
const chatContainer = ref(null)
const selectedModel = ref('deepseek-r1:1.5b') // Default to one we know is likely there or manageable

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return
  
  const userText = userInput.value
  messages.value.push({ role: 'user', content: userText })
  userInput.value = ''
  loading.value = true
  
  const assistantMsgIndex = messages.value.length
  messages.value.push({ role: 'assistant', content: '' })
  
  try {
    // SYSTEM PROMPT Injection for RAG Simulation
    const systemPrompt = {
      role: 'system',
      content: `你是一个基于检索的助手。以下是给你的【本地知识库】内容，请仅根据以下内容回答问题。如果内容中没有答案，请诚实告知。\\n\\n【知识库内容】：\\n${knowledgeBase.value}`
    }

    const response = await fetch('http://localhost:3001/api/ollama/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: selectedModel.value,
        messages: [systemPrompt, ...messages.value.slice(0, -1)],
        stream: true
      })
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\\n')
      
      for (const line of lines) {
        if (!line.trim()) continue
        try {
          const json = JSON.parse(line)
          if (json.message && json.message.content) {
            messages.value[assistantMsgIndex].content += json.message.content
            scrollToBottom()
          }
        } catch (e) {}
      }
    }
  } catch (err) {
    messages.value[assistantMsgIndex].content = '❌ 无法连接到 AI 服务，请确保后端服务已启动。'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3001/api/ollama/models')
    if (res.data.models && res.data.models.length > 0) {
      selectedModel.value = res.data.models[0].name
    }
  } catch (e) {}
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 113, 227, 0.1);
  border-radius: 10px;
}
</style>
