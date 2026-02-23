<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="notebook-container animate-scale-up">
        <!-- Close Button -->
        <button class="close-btn" @click="$emit('close')">
          <X class="w-5 h-5" />
        </button>

        <div v-if="course" class="notebook paper paper-stack">
          <!-- Spiral Binding -->
          <div class="spiral-binding">
            <div v-for="i in 12" :key="i" class="spiral-hole"></div>
          </div>

          <!-- Left Side: Course Info -->
          <div class="notebook-left p-8 md:p-10 flex flex-col items-center justify-center text-center">
            <div class="course-cover-preview mb-6">
              <img :src="course.image" class="w-full h-full object-cover rounded-lg shadow-lg" />
            </div>
            <h2 class="text-2xl font-bold mb-2 tracking-tight">{{ course.title }}</h2>
            <div class="badge mb-6">{{ course.category.toUpperCase() }}</div>
            <p class="text-ink-secondary text-sm leading-relaxed max-w-[200px]">
              本课程共包含 {{ course.lessons.length }} 个章节。请点击右侧目录开始学习。
            </p>
          </div>

          <!-- Right Side: Lesson List (Ruled Paper) -->
          <div class="notebook-right paper-ruled">
            <div class="p-8 md:p-10">
              <div class="flex items-center gap-2 mb-8">
                <BookOpen class="w-5 h-5 text-accent" />
                <h3 class="font-bold text-lg">课程目录</h3>
              </div>

              <div class="lessons-list custom-scrollbar">
                <div 
                  v-for="(lesson, index) in course.lessons" 
                  :key="lesson.id"
                  class="lesson-item group"
                  @click="$emit('selectLesson', lesson)"
                >
                  <span class="lesson-num">{{ (index + 1).toString().padStart(2, '0') }}</span>
                  <span class="lesson-title truncate">{{ lesson.title }}</span>
                  <div class="lesson-action">
                    <Play class="w-3 h-3 fill-current" />
                    <span>开始</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { X, BookOpen, Play } from 'lucide-vue-next'

defineProps({
  show: Boolean,
  course: Object
})

defineEmits(['close', 'selectLesson'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.notebook-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 600px;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  color: white;
  background: rgba(255, 255, 255, 0.2);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.notebook {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 12px;
}

/* Central Fold Shadow */
.notebook::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 40px;
  transform: translateX(-50%);
  background: linear-gradient(to right, 
    transparent 0%, 
    rgba(0,0,0,0.03) 30%, 
    rgba(0,0,0,0.06) 50%, 
    rgba(0,0,0,0.03) 70%, 
    transparent 100%
  );
  z-index: 5;
  pointer-events: none;
}

.spiral-binding {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  transform: translateX(-50%);
  width: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 20px 0;
  z-index: 10;
  pointer-events: none;
}

.spiral-hole {
  width: 10px;
  height: 10px;
  background: #f0f0f0;
  border-radius: 50%;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
  position: relative;
  margin: 10px auto;
}

.spiral-hole::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 8px;
  border: 1.5px solid #bbb;
  border-radius: 4px;
  border-bottom: none;
  background: transparent;
}

.notebook-left {
  flex: 1;
  background: var(--surface-secondary);
  border-right: 1px solid var(--paper-line);
  position: relative;
}

.notebook-right {
  flex: 1.2;
  background: var(--paper);
  position: relative;
  display: flex;
  flex-direction: column;
}

.course-cover-preview {
  width: 160px;
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  border: 4px solid white;
}

.badge {
  background: var(--accent);
  color: white;
  font-size: 10px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 20px;
}

.lessons-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.lesson-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px dashed var(--paper-line);
  cursor: pointer;
  transition: all 0.2s;
}

.lesson-num {
  font-family: 'SF Mono', monospace;
  font-size: 11px;
  color: var(--ink-tertiary);
  width: 32px;
}

.lesson-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
}

.lesson-action {
  font-size: 11px;
  font-weight: 600;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s;
}

.lesson-item:hover .lesson-title {
  color: var(--accent);
}

.lesson-item:hover .lesson-action {
  opacity: 1;
  transform: translateX(0);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--ink-light);
  border-radius: 10px;
}

/* Animations */
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .notebook {
    flex-direction: column;
  }
  .spiral-binding {
    display: none;
  }
  .notebook-container {
    height: 80vh;
  }
  .notebook-left {
    flex: 0;
    padding: 20px;
  }
  .course-cover-preview {
    display: none;
  }
}
</style>
