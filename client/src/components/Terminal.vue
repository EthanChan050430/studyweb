<template>
  <div class="terminal paper shadow-2xl rounded-2xl overflow-hidden text-ink font-mono text-sm border-paper-line ring-1 ring-ink/5">
    <div class="terminal-header glass px-5 py-3 flex items-center justify-between select-none border-b border-paper-line">
      <div class="flex gap-2">
        <div class="w-2.5 h-2.5 rounded-full bg-ink-light opacity-30"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-ink-light opacity-30"></div>
        <div class="w-2.5 h-2.5 rounded-full bg-ink-light opacity-30"></div>
      </div>
      <div class="text-[10px] font-bold text-ink-tertiary tracking-widest uppercase">
        {{ (title || 'PYTHON').toUpperCase() }} — SHELL
      </div>
      <div class="flex gap-1.5 opacity-20">
        <div class="w-1 h-3 bg-ink-tertiary rounded-full"></div>
        <div class="w-1 h-3 bg-ink-tertiary rounded-full"></div>
      </div>
    </div>
    <div class="terminal-body p-6 min-h-[220px] max-h-[500px] overflow-y-auto custom-scrollbar bg-paper">
      <!-- Editable Code Section -->
      <div class="mb-8">
        <div class="text-[10px] text-ink-tertiary mb-3 font-bold uppercase tracking-widest flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-accent"></div>
            Code Editor
          </div>
          <span class="text-[9px] opacity-60 font-medium">交互式编辑器 · 实时修改</span>
        </div>
        <div class="relative group">
          <textarea 
            v-model="editableCode"
            spellcheck="false"
            class="w-full bg-surface-secondary/50 p-5 rounded-xl border border-paper-line text-ink font-mono text-sm outline-none focus:border-accent/30 focus:bg-paper focus:shadow-md transition-all min-h-[140px] resize-y leading-relaxed"
          ></textarea>
        </div>
      </div>
      
      <!-- Output Section -->
      <div class="relative group mt-8">
        <div class="text-[10px] text-ink-tertiary mb-3 font-bold uppercase tracking-widest flex items-center gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-ink-light"></div>
          Console Output
        </div>
        <div v-if="output" class="animate-fade-in">
          <pre :class="[isError ? 'text-red-500 bg-red-50 border-red-100' : 'text-ink bg-surface-secondary border-paper-line font-medium']" 
               class="p-5 rounded-xl whitespace-pre-wrap border leading-relaxed overflow-x-auto shadow-sm text-xs">{{ output }}</pre>
        </div>
        <div v-else-if="loading" class="flex flex-col items-center justify-center py-10 gap-4 text-ink-tertiary">
          <div class="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p class="text-[10px] font-bold tracking-widest uppercase">Executing Environment...</p>
        </div>
        <div v-else class="py-12 flex flex-col items-center justify-center text-ink-tertiary/20 border-2 border-dashed border-paper-line rounded-2xl bg-surface/30">
          <TerminalIcon class="w-10 h-10 mb-3 opacity-10" />
          <span class="text-[10px] font-bold tracking-widest uppercase">Ready to run</span>
        </div>
      </div>
    </div>
    <div class="terminal-footer glass px-6 py-4 flex justify-between items-center border-t border-paper-line">
       <span class="text-[9px] text-ink-tertiary uppercase tracking-widest font-black opacity-60">Status: Active (v3.11)</span>
       <button 
        @click="runCode" 
        :disabled="loading"
        class="group relative bg-ink hover:bg-black text-white px-8 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 disabled:opacity-30 flex items-center gap-2"
      >
        <Play v-if="!loading" class="w-3 h-3 fill-white" />
        <span>{{ loading ? 'Running...' : 'Execute' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { Terminal as TerminalIcon, Play } from 'lucide-vue-next'

const props = defineProps({
  code: String,
  title: String,
  command: String
})

const editableCode = ref('')
const output = ref('')
const loading = ref(false)
const isError = ref(false)

// Handle initialization and navigation resets
watch(() => props.code, (newVal) => {
  editableCode.value = newVal || ''
  output.value = ''
  isError.value = false
}, { immediate: true })

const runCode = async () => {
  if (loading.value) return
  loading.value = true
  output.value = ''
  try {
    const res = await axios.post('http://localhost:3001/api/run', { code: editableCode.value })
    output.value = res.data.output
    isError.value = res.data.isError
  } catch (err) {
    output.value = '无法连接到后端服务器，请确保 Node.js 服务已启动。'
    isError.value = true
  } finally {
    loading.value = false
  }
}
</script>
