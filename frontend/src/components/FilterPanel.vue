<template>
  <aside class="filter-panel" :class="{ collapsed, 'mobile-open': mobileOpen }">
    <button class="collapse-btn" @click="handleCollapseClick" :title="collapsed ? 'Expandir filtros' : 'Colapsar filtros'">
      <span>{{ collapsed ? '›' : '‹' }}</span>
    </button>

    <div v-show="!collapsed" class="panel-content">
      <div class="panel-header">
        <h2 class="panel-title">Filtros</h2>
        <button v-if="hasActiveFilters" class="reset-btn" @click="resetFilters">Restablecer</button>
      </div>

      <!-- ── 1. Tipo de Tienda ─────────────────────────────── -->
      <div class="accordion-item" :class="{ open: openSections.has('tipo') }">
        <button class="accordion-header" @click="toggleSection('tipo')">
          <span class="accordion-title">Tipo de Tienda</span>
          <span class="accordion-right">
            <span v-if="tipoActiveCount > 0 && tipoActiveCount < 4" class="badge">{{ tipoActiveCount }}</span>
            <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </button>
        <div v-show="openSections.has('tipo')" class="accordion-body">
          <div class="checkbox-group">
            <label v-for="type in SHOP_TYPES" :key="type.value" class="checkbox-item">
              <input
                type="checkbox"
                :checked="modelValue.shopTypes.includes(type.value)"
                @change="toggleShopType(type.value)"
              />
              <span class="dot" :style="{ background: type.color }"></span>
              {{ type.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- ── 2. Visita y Estado ─────────────────────────────── -->
      <div class="accordion-item" :class="{ open: openSections.has('visita') }">
        <button class="accordion-header" @click="toggleSection('visita')">
          <span class="accordion-title">Visita y Estado</span>
          <span class="accordion-right">
            <span v-if="visitaActiveCount > 0" class="badge">{{ visitaActiveCount }}</span>
            <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </button>
        <div v-show="openSections.has('visita')" class="accordion-body">
          <div class="sub-label">Estado de Visita</div>
          <div class="checkbox-group">
            <label v-for="vs in VISIT_STATUS" :key="vs.value" class="checkbox-item">
              <input
                type="checkbox"
                :checked="modelValue.showVisitStatus.includes(vs.value)"
                @change="toggleVisitStatus(vs.value)"
              />
              <span class="dot" :style="{ background: vs.color }"></span>
              {{ vs.label }}
            </label>
          </div>
          <div class="sub-label" style="margin-top: 10px;">Estado de la Tienda</div>
          <div class="checkbox-group">
            <label v-for="st in VISITED_STATUSES" :key="st.value" class="checkbox-item">
              <input
                type="checkbox"
                :checked="modelValue.showVisitedStatuses.includes(st.value)"
                @change="toggleVisitedStatus(st.value)"
              />
              <span class="dot" :style="{ background: st.color }"></span>
              {{ st.label }}
            </label>
          </div>

          <div class="sub-label" style="margin-top: 12px;">Rango de Visita</div>
          <div class="date-range-row">
            <div class="date-field">
              <span class="date-field-label">De</span>
              <input
                type="date"
                class="date-input"
                :value="modelValue.visitDateFrom ?? ''"
                :max="modelValue.visitDateTo ?? ''"
                @change="setFilter('visitDateFrom', $event.target.value || null)"
              />
            </div>
            <div class="date-field">
              <span class="date-field-label">Hasta</span>
              <input
                type="date"
                class="date-input"
                :value="modelValue.visitDateTo ?? ''"
                :min="modelValue.visitDateFrom ?? ''"
                @change="setFilter('visitDateTo', $event.target.value || null)"
              />
            </div>
          </div>
          <div v-if="modelValue.visitDateFrom || modelValue.visitDateTo" class="date-clear-row">
            <button class="date-clear-btn" @click="clearDateRange">Limpiar fechas</button>
          </div>
        </div>
      </div>

      <!-- ── 3. Evaluación ─────────────────────────────────── -->
      <div class="accordion-item" :class="{ open: openSections.has('eval') }">
        <button class="accordion-header" @click="toggleSection('eval')">
          <span class="accordion-title">
            Evaluación
            <span class="eval-note">solo visitadas</span>
          </span>
          <span class="accordion-right">
            <span v-if="evalActiveCount > 0" class="badge badge-green">{{ evalActiveCount }}</span>
            <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </button>
        <div v-show="openSections.has('eval')" class="accordion-body">

          <section class="filter-section">
            <label class="section-label">
              Score General Mín.
              <span class="rating-val">{{ modelValue.minScoreGeneral > 0 ? modelValue.minScoreGeneral : 'Cualquiera' }}</span>
            </label>
            <input type="range" min="0" max="10" step="1"
              :value="modelValue.minScoreGeneral"
              @input="setFilter('minScoreGeneral', parseInt($event.target.value))"
              class="range-input"
            />
            <div class="range-labels"><span>Cualquiera</span><span>10</span></div>
          </section>

          <section class="filter-section">
            <label class="section-label">
              Pains Mín.
              <span class="rating-val">{{ modelValue.minScorePains > 0 ? modelValue.minScorePains : 'Cualquiera' }}</span>
            </label>
            <input type="range" min="0" max="10" step="1"
              :value="modelValue.minScorePains"
              @input="setFilter('minScorePains', parseInt($event.target.value))"
              class="range-input"
            />
            <div class="range-labels"><span>Cualquiera</span><span>10</span></div>
          </section>

          <section class="filter-section">
            <label class="section-label">
              Prob. de Venta Mín.
              <span class="rating-val">{{ modelValue.minScoreProbabilidad > 0 ? modelValue.minScoreProbabilidad : 'Cualquiera' }}</span>
            </label>
            <input type="range" min="0" max="10" step="1"
              :value="modelValue.minScoreProbabilidad"
              @input="setFilter('minScoreProbabilidad', parseInt($event.target.value))"
              class="range-input"
            />
            <div class="range-labels"><span>Cualquiera</span><span>10</span></div>
          </section>

          <section class="filter-section">
            <label class="section-label">
              Satisf. Proveedores Mín.
              <span class="rating-val">{{ modelValue.minScoreSatisfaccion > 0 ? modelValue.minScoreSatisfaccion : 'Cualquiera' }}</span>
            </label>
            <input type="range" min="0" max="10" step="1"
              :value="modelValue.minScoreSatisfaccion"
              @input="setFilter('minScoreSatisfaccion', parseInt($event.target.value))"
              class="range-input"
            />
            <div class="range-labels"><span>Cualquiera</span><span>10</span></div>
          </section>

          <section class="filter-section">
            <label class="section-label">Tamaño de Tienda</label>
            <div class="chip-group">
              <button v-for="opt in TAMANO_OPTS" :key="opt" class="chip-btn"
                :class="{ active: modelValue.tamanoTienda.includes(opt) }"
                @click="toggleEvalFilter('tamanoTienda', opt)"
              >{{ opt }}</button>
            </div>
          </section>

          <section class="filter-section">
            <label class="section-label">Crédito</label>
            <div class="chip-group">
              <button v-for="opt in CREDITO_OPTS" :key="opt" class="chip-btn"
                :class="{ active: modelValue.credito.includes(opt) }"
                @click="toggleEvalFilter('credito', opt)"
              >{{ opt }}</button>
            </div>
          </section>

          <section class="filter-section">
            <label class="section-label">Método de Pago</label>
            <div class="chip-group">
              <button v-for="opt in PAGO_OPTS" :key="opt" class="chip-btn"
                :class="{ active: modelValue.metodoPago.includes(opt) }"
                @click="toggleEvalFilter('metodoPago', opt)"
              >{{ opt }}</button>
            </div>
          </section>

          <section class="filter-section">
            <label class="section-label">Entrega</label>
            <div class="chip-group">
              <button v-for="opt in ENTREGA_OPTS" :key="opt" class="chip-btn"
                :class="{ active: modelValue.entrega.includes(opt) }"
                @click="toggleEvalFilter('entrega', opt)"
              >{{ opt }}</button>
            </div>
          </section>

          <section class="filter-section">
            <label class="section-label">Contacto Personal</label>
            <div class="chip-group">
              <button v-for="opt in CONTACTO_OPTS" :key="opt" class="chip-btn"
                :class="{ active: modelValue.contactoPersonal.includes(opt) }"
                @click="toggleEvalFilter('contactoPersonal', opt)"
              >{{ opt }}</button>
            </div>
          </section>

          <section class="filter-section">
            <label class="section-label">Proveedor Principal</label>
            <ProveedorSelect
              :model-value="modelValue.principalProveedor"
              :options="PROVEEDOR_OPTS"
              placeholder="Buscar proveedor…"
              @update:modelValue="setFilter('principalProveedor', $event)"
            />
          </section>

        </div>
      </div>

      <!-- ── 4. Calificación ───────────────────────────────── -->
      <div class="accordion-item" :class="{ open: openSections.has('calif') }">
        <button class="accordion-header" @click="toggleSection('calif')">
          <span class="accordion-title">Calificación Mín.</span>
          <span class="accordion-right">
            <span v-if="modelValue.minRating > 0" class="badge">{{ modelValue.minRating }}★</span>
            <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </button>
        <div v-show="openSections.has('calif')" class="accordion-body">
          <section class="filter-section" style="border-bottom: none;">
            <label class="section-label">
              Mínimo
              <span class="rating-val">{{ modelValue.minRating > 0 ? modelValue.minRating + '★' : 'Cualquiera' }}</span>
            </label>
            <input
              type="range" min="0" max="5" step="0.5"
              :value="modelValue.minRating"
              @input="setFilter('minRating', parseFloat($event.target.value))"
              class="range-input"
            />
            <div class="range-labels">
              <span>Cualquiera</span>
              <span>5★</span>
            </div>
          </section>
        </div>
      </div>

    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProveedorSelect from './ProveedorSelect.vue';

const props = defineProps({
  modelValue: { type: Object, required: true },
  allStates: { type: Array, default: () => [] },
  mobileOpen: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'close']);
const collapsed = ref(false);
const openSections = ref(new Set(['tipo', 'visita']));

function toggleSection(key) {
  const next = new Set(openSections.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  openSections.value = next;
}

function handleCollapseClick() {
  if (window.innerWidth <= 640) emit('close');
  else collapsed.value = !collapsed.value;
}

// ── Constants ────────────────────────────────────────────────────────────────
const SHOP_TYPES = [
  { value: 'Repair', label: 'Reparación', color: '#3b82f6' },
  { value: 'Parts',  label: 'Refacciones', color: '#f59e0b' },
  { value: 'Both',   label: 'Ambos',      color: '#10b981' },
  { value: 'Other',  label: 'Otro',       color: '#9ca3af' },
];
const VISIT_STATUS = [
  { value: 'visitada',    label: 'Visitada',    color: '#22c55e' },
  { value: 'no_visitada', label: 'No Visitada', color: '#64748b' },
];
const VISITED_STATUSES = [
  { value: 'visita_exitosa',          label: 'Visita Exitosa',     color: '#22c55e' },
  { value: 'cerrada',                 label: 'Cerrada',            color: '#f59e0b' },
  { value: 'cerrada_permanentemente', label: 'Cerrada Permanente', color: '#ef4444' },
];
const TAMANO_OPTS   = ['Pequeña', 'Mediana', 'Grande', 'Muy grande'];
const CREDITO_OPTS  = ['Sí', 'No'];
const PAGO_OPTS     = ['Efectivo', 'Tarjeta', 'Transferencia'];
const ENTREGA_OPTS  = ['Tienda física', 'Delivery'];
const CONTACTO_OPTS = ['Sí', 'No'];
const PROVEEDOR_OPTS = [
  'Remo', 'Supermoto', 'Mudi Motos', 'Motometa', 'Moto Refacciones',
  'La Casa de la Moto', 'Refacciones Italika', 'Surtimoto',
  'Suzuki Motos Pro Shop', 'Rogmar', 'Motopartes Casa', 'Windsor Motopartes',
  'Sayto', 'Motos y Equipos', 'IMR', 'Palamoto', 'Remo Motos México',
];

// ── Active filter counts for badges ─────────────────────────────────────────
const tipoActiveCount = computed(() => props.modelValue.shopTypes.length);

const visitaActiveCount = computed(() => {
  let c = 0;
  if (props.modelValue.showVisitStatus.length < 2) c++;
  if (props.modelValue.showVisitedStatuses.length < 3) c++;
  if (props.modelValue.visitDateFrom || props.modelValue.visitDateTo) c++;
  return c;
});

const evalActiveCount = computed(() => {
  const m = props.modelValue;
  let c = 0;
  if (m.minScoreGeneral > 0) c++;
  if (m.minScorePains > 0) c++;
  if (m.minScoreProbabilidad > 0) c++;
  if (m.minScoreSatisfaccion > 0) c++;
  c += m.tamanoTienda.length;
  c += m.credito.length;
  c += m.metodoPago.length;
  c += m.entrega.length;
  c += m.principalProveedor.length;
  c += m.contactoPersonal.length;
  return c;
});

const hasActiveFilters = computed(() =>
  props.modelValue.shopTypes.length < 4 ||
  props.modelValue.showVisitStatus.length < 2 ||
  props.modelValue.showVisitedStatuses.length < 3 ||
  !!props.modelValue.visitDateFrom ||
  !!props.modelValue.visitDateTo ||
  props.modelValue.minRating > 0 ||
  evalActiveCount.value > 0
);

// ── Filter togglers ──────────────────────────────────────────────────────────
function toggleShopType(type) {
  const current = [...props.modelValue.shopTypes];
  const idx = current.indexOf(type);
  if (idx === -1) current.push(type); else current.splice(idx, 1);
  emit('update:modelValue', { ...props.modelValue, shopTypes: current });
}

function toggleVisitStatus(val) {
  const current = [...(props.modelValue.showVisitStatus ?? [])];
  const idx = current.indexOf(val);
  if (idx === -1) current.push(val); else current.splice(idx, 1);
  emit('update:modelValue', { ...props.modelValue, showVisitStatus: current });
}

function toggleVisitedStatus(val) {
  const current = [...(props.modelValue.showVisitedStatuses ?? [])];
  const idx = current.indexOf(val);
  if (idx === -1) current.push(val); else current.splice(idx, 1);
  emit('update:modelValue', { ...props.modelValue, showVisitedStatuses: current });
}

function toggleEvalFilter(key, val) {
  const current = [...(props.modelValue[key] ?? [])];
  const idx = current.indexOf(val);
  if (idx === -1) current.push(val); else current.splice(idx, 1);
  emit('update:modelValue', { ...props.modelValue, [key]: current });
}

function setFilter(key, val) {
  emit('update:modelValue', { ...props.modelValue, [key]: val });
}

function resetFilters() {
  emit('update:modelValue', {
    viewMode:             props.modelValue.viewMode,
    shopTypes:            ['Repair', 'Parts', 'Both', 'Other'],
    sources:              ['denue', 'google', 'both'],
    state:                [],
    minRating:            0,
    showPurchases:        true,
    showAvgOrder:         true,
    showVisitStatus:      ['visitada', 'no_visitada'],
    showVisitedStatuses:  ['visita_exitosa', 'cerrada', 'cerrada_permanentemente'],
    visitDateFrom:        null,
    visitDateTo:          null,
    minScoreGeneral:      0,
    minScorePains:        0,
    minScoreProbabilidad: 0,
    minScoreSatisfaccion: 0,
    tamanoTienda:         [],
    credito:              [],
    metodoPago:           [],
    entrega:              [],
    principalProveedor:   [],
    contactoPersonal:     [],
  });
}

function clearDateRange() {
  emit('update:modelValue', { ...props.modelValue, visitDateFrom: null, visitDateTo: null });
}
</script>

<style scoped>
.filter-panel {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 260px;
  background: rgba(10, 15, 30, 0.92);
  backdrop-filter: blur(12px);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  display: flex;
  flex-direction: row;
  z-index: 10;
  transition: width 0.2s ease;
}

.filter-panel.collapsed { width: 36px; }

.collapse-btn {
  flex-shrink: 0;
  width: 36px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.collapse-btn:hover { color: #f1f5f9; }

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 14px 14px 14px 4px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.panel-content::-webkit-scrollbar { width: 4px; }
.panel-content::-webkit-scrollbar-track { background: transparent; }
.panel-content::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.12); border-radius: 2px; }

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.reset-btn {
  font-size: 11px;
  color: #60a5fa;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 6px;
  font-family: inherit;
}
.reset-btn:hover { text-decoration: underline; }

/* ── Accordion ──────────────────────────────────────── */
.accordion-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.accordion-item:last-child { border-bottom: none; }

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  gap: 8px;
}
.accordion-header:hover { color: #f1f5f9; }

.accordion-title {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.accordion-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.chevron {
  color: #475569;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}
.accordion-item.open .chevron { transform: rotate(180deg); }

.badge {
  font-size: 10px;
  font-weight: 700;
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 99px;
  padding: 1px 6px;
  line-height: 1.4;
}
.badge-green {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.3);
}

.eval-note {
  font-size: 10px;
  font-weight: 400;
  color: #475569;
}

.accordion-body {
  padding-bottom: 12px;
}

.sub-label {
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 6px;
}

/* ── Filter section (inside accordion) ──────────────── */
.filter-section {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.filter-section:last-child { border-bottom: none; }

.section-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 7px;
}

.rating-val {
  color: #f59e0b;
  font-weight: 700;
  text-transform: none;
  letter-spacing: 0;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #cbd5e1;
  cursor: pointer;
}
.checkbox-item input { cursor: pointer; accent-color: #3b82f6; }

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.range-input {
  width: 100%;
  accent-color: #3b82f6;
  cursor: pointer;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #475569;
  margin-top: 2px;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.chip-btn {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
  transition: all 0.15s;
  white-space: nowrap;
  font-family: inherit;
}
.chip-btn:hover { border-color: rgba(255, 255, 255, 0.28); color: #e2e8f0; }
.chip-btn.active {
  background: #1d4ed8;
  border-color: #2563eb;
  color: #fff;
}


/* ── Date range ─────────────────────────────────────── */
.date-range-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.date-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-field-label {
  font-size: 10px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex-shrink: 0;
  width: 46px;
}

.date-input {
  flex: 1;
  min-width: 0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: #cbd5e1;
  font-size: 11px;
  font-family: inherit;
  padding: 4px 6px;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
  color-scheme: dark;
}
.date-input:hover { border-color: rgba(255, 255, 255, 0.28); }
.date-input:focus { border-color: #3b82f6; }

.date-clear-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
}

.date-clear-btn {
  background: none;
  border: none;
  font-size: 11px;
  color: #60a5fa;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
}
.date-clear-btn:hover { text-decoration: underline; }

/* ── Mobile ──────────────────────────────────────────── */
@media (max-width: 640px) {
  .filter-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 85vw;
    max-width: 300px;
    z-index: 200;
    transform: translateX(100%);
    transition: transform 0.25s ease;
  }
  .filter-panel.mobile-open { transform: translateX(0); }
  .collapse-btn { font-size: 18px; transform: scaleX(-1); }
  .checkbox-item { padding: 6px 0; font-size: 14px; }
}
</style>
