<template>
  <div class="state-wrapper" ref="wrapperRef">
    <button
      class="state-btn"
      :class="{ active: isOpen, filtered: isFiltered }"
      @click="isOpen = !isOpen"
      title="Filtrar por estado"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
      <span class="state-label">{{ label }}</span>
      <svg class="chevron" :class="{ open: isOpen }" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <Transition name="dropdown-fade">
      <div v-if="isOpen" class="state-dropdown">
        <div class="dropdown-header">
          <span class="dropdown-title">Estado</span>
          <div class="dropdown-actions">
            <button class="action-link" @click="selectAll">Todos</button>
            <span class="action-sep">·</span>
            <button class="action-link" @click="clearAll">Ninguno</button>
          </div>
        </div>

        <div class="search-wrap">
          <input
            v-model="search"
            class="search-input"
            placeholder="Buscar estado…"
            @click.stop
          />
        </div>

        <div class="options-list">
          <label
            v-for="s in filteredStates"
            :key="s"
            class="state-option"
          >
            <input
              type="checkbox"
              :checked="modelValue.includes(s)"
              @change="toggle(s)"
            />
            <span>{{ s }}</span>
          </label>
          <div v-if="filteredStates.length === 0" class="no-results">Sin resultados</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  allStates:  { type: Array, default: () => [] },
});

const emit = defineEmits(['update:modelValue']);

const isOpen  = ref(false);
const search  = ref('');
const wrapperRef = ref(null);

const isFiltered = computed(() => props.modelValue.length > 0 && props.modelValue.length < props.allStates.length);

const label = computed(() => {
  if (props.modelValue.length === 0 || props.modelValue.length === props.allStates.length) return 'Todo México';
  if (props.modelValue.length === 1) return props.modelValue[0];
  return `${props.modelValue.length} estados`;
});

const filteredStates = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return props.allStates;
  return props.allStates.filter((s) => s.toLowerCase().includes(q));
});

function toggle(val) {
  const current = [...props.modelValue];
  const idx = current.indexOf(val);
  if (idx === -1) current.push(val);
  else current.splice(idx, 1);
  emit('update:modelValue', current);
}

function selectAll() { emit('update:modelValue', [...props.allStates]); }
function clearAll()  { emit('update:modelValue', []); }

function handleClickOutside(e) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    isOpen.value = false;
    search.value = '';
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onBeforeUnmount(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<style scoped>
.state-wrapper {
  position: relative;
  flex-shrink: 0;
}

.state-btn {
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
  max-width: 160px;
}
.state-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border-color: rgba(255, 255, 255, 0.18);
}
.state-btn.active {
  border-color: rgba(99, 130, 246, 0.45);
  color: #93c5fd;
  background: rgba(59, 130, 246, 0.1);
}
.state-btn.filtered {
  border-color: rgba(245, 158, 11, 0.4);
  color: #fcd34d;
  background: rgba(245, 158, 11, 0.08);
}

.state-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  transition: transform 0.15s;
  flex-shrink: 0;
}
.chevron.open { transform: rotate(180deg); }

.state-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 230px;
  background: rgba(13, 20, 40, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  z-index: 200;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 6px;
}

.dropdown-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #475569;
}

.dropdown-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-link {
  background: none;
  border: none;
  font-size: 11px;
  color: #60a5fa;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}
.action-link:hover { text-decoration: underline; }

.action-sep { font-size: 11px; color: #334155; }

.search-wrap {
  padding: 4px 10px 8px;
}

.search-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #cbd5e1;
  font-size: 12px;
  font-family: inherit;
  padding: 5px 9px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.search-input::placeholder { color: #475569; }
.search-input:focus { border-color: #3b82f6; }

.options-list {
  max-height: 240px;
  overflow-y: auto;
  padding-bottom: 6px;
}
.options-list::-webkit-scrollbar { width: 4px; }
.options-list::-webkit-scrollbar-track { background: transparent; }
.options-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }

.state-option {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 14px;
  cursor: pointer;
  font-size: 13px;
  color: #cbd5e1;
  transition: background 0.1s;
}
.state-option:hover { background: rgba(255, 255, 255, 0.06); }
.state-option input { accent-color: #3b82f6; cursor: pointer; flex-shrink: 0; }

.no-results {
  padding: 10px 14px;
  font-size: 12px;
  color: #475569;
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
  .state-wrapper { display: none; }
}
</style>
