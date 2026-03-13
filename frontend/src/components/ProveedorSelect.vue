<template>
  <div class="prov-select" ref="triggerRef" :class="{ 'is-open': isOpen, 'is-disabled': disabled }">

    <!-- Input row: tags + search input -->
    <div class="prov-input-row" @click="handleRowClick">
      <div class="prov-tags-wrap">
        <span
          v-for="val in modelValue"
          :key="val"
          class="prov-tag"
        >
          {{ val }}
          <button
            class="tag-remove"
            @click.stop="remove(val)"
            :disabled="disabled"
            tabindex="-1"
            type="button"
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </span>
        <input
          ref="inputRef"
          v-model="search"
          class="prov-search-input"
          :placeholder="modelValue.length === 0 ? placeholder : ''"
          :disabled="disabled"
          autocomplete="off"
          @focus="open"
          @keydown.escape.prevent="close"
          @keydown.backspace="handleBackspace"
          @keydown.arrow-down.prevent="focusFirst"
        />
      </div>
      <svg
        class="prov-chevron"
        :class="{ open: isOpen }"
        width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>

    <!-- Dropdown teleported to body to escape overflow clipping -->
    <Teleport to="body">
      <Transition name="prov-fade">
        <div
          v-if="isOpen"
          class="prov-dropdown-global"
          :style="dropdownStyle"
          ref="dropdownRef"
          @mousedown.prevent
        >
          <div v-if="filteredOptions.length === 0" class="prov-empty">Sin resultados para "{{ search }}"</div>
          <div
            v-for="opt in filteredOptions"
            :key="opt"
            class="prov-option"
            :class="{ selected: modelValue.includes(opt) }"
            @click="toggle(opt)"
          >
            <span class="opt-checkbox" :class="{ checked: modelValue.includes(opt) }">
              <svg v-if="modelValue.includes(opt)" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </span>
            <span class="opt-label">{{ opt }}</span>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options:    { type: Array, default: () => [] },
  placeholder:{ type: String, default: 'Buscar…' },
  disabled:   { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const isOpen      = ref(false);
const search      = ref('');
const triggerRef  = ref(null);
const inputRef    = ref(null);
const dropdownRef = ref(null);
const dropdownStyle = ref({});

const filteredOptions = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter((o) => o.toLowerCase().includes(q));
});

function computeStyle() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const dropHeight = Math.min(220, filteredOptions.value.length * 34 + 8);
  const above = spaceBelow < dropHeight + 8 && rect.top > dropHeight + 8;
  dropdownStyle.value = {
    position: 'fixed',
    left:     `${rect.left}px`,
    width:    `${rect.width}px`,
    zIndex:   '9999',
    ...(above
      ? { bottom: `${window.innerHeight - rect.top + 4}px`, top: 'auto' }
      : { top: `${rect.bottom + 4}px`, bottom: 'auto' }),
  };
}

function open() {
  if (props.disabled) return;
  isOpen.value = true;
  nextTick(computeStyle);
}

function close() {
  isOpen.value = false;
  search.value = '';
}

function handleRowClick() {
  if (props.disabled) return;
  if (!isOpen.value) {
    open();
    nextTick(() => inputRef.value?.focus());
  } else {
    inputRef.value?.focus();
  }
}

function toggle(opt) {
  if (props.disabled) return;
  const current = [...props.modelValue];
  const idx = current.indexOf(opt);
  if (idx === -1) current.push(opt);
  else current.splice(idx, 1);
  emit('update:modelValue', current);
  // keep dropdown open, clear search, refocus input
  search.value = '';
  nextTick(() => inputRef.value?.focus());
}

function remove(val) {
  if (props.disabled) return;
  emit('update:modelValue', props.modelValue.filter((v) => v !== val));
}

function handleBackspace() {
  if (search.value === '' && props.modelValue.length > 0) {
    remove(props.modelValue[props.modelValue.length - 1]);
  }
}

function focusFirst() {
  const first = dropdownRef.value?.querySelector('.prov-option');
  first?.focus();
}

function handleClickOutside(e) {
  const inTrigger  = triggerRef.value?.contains(e.target);
  const inDropdown = dropdownRef.value?.contains(e.target);
  if (!inTrigger && !inDropdown) close();
}

function handleScroll() {
  if (isOpen.value) computeStyle();
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  window.addEventListener('scroll', handleScroll, true);
  window.addEventListener('resize', handleScroll);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  window.removeEventListener('scroll', handleScroll, true);
  window.removeEventListener('resize', handleScroll);
});
</script>

<style scoped>
.prov-select {
  position: relative;
  width: 100%;
}

.prov-input-row {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 4px 8px 4px 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: text;
  transition: border-color 0.15s, background 0.15s;
}
.prov-select.is-open .prov-input-row {
  border-color: rgba(99, 179, 237, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.prov-select.is-disabled .prov-input-row {
  opacity: 0.45;
  cursor: not-allowed;
}

.prov-tags-wrap {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.prov-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px 2px 8px;
  background: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 99px;
  font-size: 11px;
  font-weight: 500;
  color: #93c5fd;
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-remove {
  background: none;
  border: none;
  color: #60a5fa;
  cursor: pointer;
  padding: 1px;
  display: flex;
  align-items: center;
  border-radius: 3px;
  flex-shrink: 0;
  transition: color 0.1s;
}
.tag-remove:hover { color: #fff; }
.tag-remove:disabled { opacity: 0.4; cursor: default; }

.prov-search-input {
  background: none;
  border: none;
  outline: none;
  color: #f1f5f9;
  font-size: 12px;
  font-family: inherit;
  flex: 1;
  min-width: 60px;
  padding: 2px 0;
}
.prov-search-input::placeholder { color: #475569; }
.prov-search-input:disabled { cursor: not-allowed; }

.prov-chevron {
  color: #475569;
  flex-shrink: 0;
  transition: transform 0.15s;
}
.prov-chevron.open { transform: rotate(180deg); }
</style>

<!-- Global styles for teleported dropdown -->
<style>
.prov-dropdown-global {
  background: rgba(13, 20, 40, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow-y: auto;
  max-height: 220px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  padding: 4px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.15) transparent;
}
.prov-dropdown-global::-webkit-scrollbar { width: 4px; }
.prov-dropdown-global::-webkit-scrollbar-track { background: transparent; }
.prov-dropdown-global::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

.prov-option {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 12px;
  cursor: pointer;
  font-size: 12px;
  color: #cbd5e1;
  font-family: 'Inter', system-ui, sans-serif;
  transition: background 0.1s;
  user-select: none;
}
.prov-option:hover { background: rgba(255, 255, 255, 0.07); color: #f1f5f9; }
.prov-option.selected { color: #93c5fd; }

.opt-checkbox {
  width: 15px;
  height: 15px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.1s;
}
.opt-checkbox.checked {
  background: #1d4ed8;
  border-color: #3b82f6;
  color: #fff;
}

.opt-label { flex: 1; }

.prov-empty {
  padding: 12px 14px;
  font-size: 12px;
  color: #475569;
  font-family: 'Inter', system-ui, sans-serif;
  text-align: center;
}

.prov-fade-enter-active,
.prov-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.prov-fade-enter-from,
.prov-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
