<template>
  <div class="fuente-wrapper" ref="wrapperRef">
    <button class="fuente-btn" :class="{ active: isOpen, filtered: isFiltered }" @click="isOpen = !isOpen">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12"/>
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
      </svg>
      <span class="fuente-label">{{ label }}</span>
      <svg class="chevron" :class="{ open: isOpen }" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <Transition name="dropdown-fade">
      <div v-if="isOpen" class="fuente-dropdown">
        <div class="dropdown-title">Fuente de Datos</div>
        <label v-for="src in SOURCES" :key="src.value" class="fuente-option">
          <input
            type="checkbox"
            :checked="modelValue.includes(src.value)"
            @change="toggle(src.value)"
          />
          <span class="option-dot" :style="{ background: src.color }"></span>
          <span>{{ src.label }}</span>
        </label>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: { type: Array, default: () => ['denue', 'google', 'both'] },
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const wrapperRef = ref(null);

const SOURCES = [
  { value: 'denue',  label: 'Solo DENUE',            color: '#60a5fa' },
  { value: 'google', label: 'Solo Google',            color: '#34d399' },
  { value: 'both',   label: 'Coincidentes (ambas)',   color: '#a78bfa' },
];

const ALL_VALUES = SOURCES.map((s) => s.value);

const isFiltered = computed(() => props.modelValue.length < ALL_VALUES.length);

const label = computed(() => {
  if (props.modelValue.length === 0) return 'Fuente: Ninguna';
  if (props.modelValue.length === ALL_VALUES.length) return 'Fuente: Todas';
  if (props.modelValue.length === 1) {
    return SOURCES.find((s) => s.value === props.modelValue[0])?.label ?? 'Fuente';
  }
  return `Fuente: ${props.modelValue.length}`;
});

function toggle(val) {
  const current = [...props.modelValue];
  const idx = current.indexOf(val);
  if (idx === -1) current.push(val);
  else current.splice(idx, 1);
  emit('update:modelValue', current);
}

function handleClickOutside(e) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<style scoped>
.fuente-wrapper {
  position: relative;
  flex-shrink: 0;
}

.fuente-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 11px;
  height: 34px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
  white-space: nowrap;
}
.fuente-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border-color: rgba(255, 255, 255, 0.18);
}
.fuente-btn.active {
  border-color: rgba(99, 130, 246, 0.45);
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.1);
}
.fuente-btn.filtered {
  border-color: rgba(245, 158, 11, 0.4);
  color: #fcd34d;
  background: rgba(245, 158, 11, 0.08);
}

.fuente-label { flex: 1; }

.chevron {
  transition: transform 0.15s;
  flex-shrink: 0;
}
.chevron.open { transform: rotate(180deg); }

.fuente-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 200px;
  background: rgba(13, 20, 40, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 8px 0;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  z-index: 200;
}

.dropdown-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
  padding: 4px 14px 8px;
}

.fuente-option {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  color: #cbd5e1;
  transition: background 0.1s;
}
.fuente-option:hover { background: rgba(255, 255, 255, 0.06); }
.fuente-option input { accent-color: #3b82f6; cursor: pointer; }

.option-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.97);
}

@media (max-width: 640px) {
  .fuente-wrapper { display: none; }
}
</style>
