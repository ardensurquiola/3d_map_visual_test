<template>
  <Transition name="bar-fade">
    <div v-if="viewMode !== 'hex'" class="legend-bar">

      <!-- Points mode: shop type color key -->
      <template v-if="viewMode === 'points'">
        <span class="bar-label">Tipo de tienda:</span>
        <div v-for="type in SHOP_TYPES" :key="type.value" class="legend-item">
          <span class="legend-dot" :style="{ background: type.color }"></span>
          <span>{{ type.label }}</span>
        </div>
      </template>

      <!-- Compare mode: column color key + column toggles -->
      <template v-else-if="viewMode === 'compare'">
        <span class="bar-label">Columnas:</span>
        <label class="legend-toggle" :class="{ inactive: !showPurchases }">
          <input
            type="checkbox"
            :checked="showPurchases"
            @change="emit('update:showPurchases', $event.target.checked)"
          />
          <span class="legend-dot" style="background: #3b82f6;"></span>
          <span>Compras Totales</span>
        </label>
        <label class="legend-toggle" :class="{ inactive: !showAvgOrder }">
          <input
            type="checkbox"
            :checked="showAvgOrder"
            @change="emit('update:showAvgOrder', $event.target.checked)"
          />
          <span class="legend-dot" style="background: #f59e0b;"></span>
          <span>Pedido Prom. (MXN)</span>
        </label>
        <span class="bar-hint">Alturas independientes — más alto = valor relativamente mayor. Acerca y ladea el mapa para ver 3D.</span>
      </template>

    </div>
  </Transition>
</template>

<script setup>
defineProps({
  viewMode: { type: String, default: 'points' },
  showPurchases: { type: Boolean, default: true },
  showAvgOrder: { type: Boolean, default: true },
});

defineEmits(['update:showPurchases', 'update:showAvgOrder']);

const SHOP_TYPES = [
  { value: 'Repair', label: 'Reparación', color: '#3b82f6' },
  { value: 'Parts',  label: 'Refacciones', color: '#f59e0b' },
  { value: 'Both',   label: 'Ambos',       color: '#10b981' },
  { value: 'Other',  label: 'Otro',        color: '#9ca3af' },
];
</script>

<style scoped>
.legend-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  height: 38px;
  background: rgba(10, 15, 30, 0.88);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  overflow-x: auto;
  flex-wrap: nowrap;
  scrollbar-width: none;
}
.legend-bar::-webkit-scrollbar { display: none; }

.bar-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #475569;
  white-space: nowrap;
  flex-shrink: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  white-space: nowrap;
  flex-shrink: 0;
}

.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color 0.15s;
}
.legend-toggle input { display: none; }
.legend-toggle:hover { color: #e2e8f0; }
.legend-toggle.inactive { opacity: 0.45; }
.legend-toggle.inactive .legend-dot { filter: grayscale(1); }

.bar-hint {
  font-size: 10px;
  color: #334155;
  margin-left: auto;
  white-space: nowrap;
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bar-fade-enter-active,
.bar-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.bar-fade-enter-from,
.bar-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 640px) {
  .bar-hint { display: none; }
  .legend-bar { gap: 12px; padding: 0 12px; }
}
</style>
