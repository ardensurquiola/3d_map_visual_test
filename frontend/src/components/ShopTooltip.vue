<template>
  <div
    v-if="visible"
    class="shop-tooltip"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="tooltip-header">
      <span class="shop-type-badge" :class="typeClass">{{ shop.shop_type || 'Unknown' }}</span>
      <span class="source-badge">{{ sourceLabel }}</span>
    </div>

    <h3 class="tooltip-name">{{ shop.name || shop.company_name || 'Unnamed' }}</h3>

    <div v-if="shop.formatted_address" class="tooltip-row">
      <span class="icon">📍</span>
      <span>{{ shop.formatted_address }}</span>
    </div>

    <div v-if="shop.phone" class="tooltip-row">
      <span class="icon">📞</span>
      <span>{{ shop.phone }}</span>
    </div>

    <div v-if="shop.rating" class="tooltip-row">
      <span class="icon">⭐</span>
      <span>{{ shop.rating }} / 5 ({{ shop.review_count || 0 }} reviews)</span>
    </div>

    <div v-if="shop.purchases != null" class="tooltip-row">
      <span class="icon">🛒</span>
      <span>{{ Number(shop.purchases).toLocaleString() }} purchases</span>
    </div>

    <div v-if="shop.average_order != null" class="tooltip-row">
      <span class="icon">💰</span>
      <span>Avg. order ${{ Number(shop.average_order).toLocaleString('en-US', { minimumFractionDigits: 2 }) }} MXN</span>
    </div>

    <div v-if="shop.website" class="tooltip-row">
      <span class="icon">🌐</span>
      <a :href="shop.website" target="_blank" rel="noopener noreferrer">Website</a>
    </div>

    <div v-if="shop.google_maps_url" class="tooltip-actions">
      <a :href="shop.google_maps_url" target="_blank" rel="noopener noreferrer" class="maps-link">
        View on Google Maps →
      </a>
    </div>
  </div>

  <!-- Hex cell tooltip (density mode) -->
  <div
    v-else-if="hexVisible"
    class="shop-tooltip hex-tooltip"
    :style="{ left: hexX + 'px', top: hexY + 'px' }"
  >
    <strong>{{ hexCount }} shops</strong>
    <div v-if="hexElevation > 0" class="tooltip-row small">
      ~{{ hexElevation.toLocaleString() }} total purchases
    </div>
    <div v-else class="tooltip-row small">in this area</div>
  </div>

  <!-- Crime zone tooltip -->
  <div
    v-else-if="crimeVisible"
    class="shop-tooltip crime-tooltip"
    :style="{ left: crimeX + 'px', top: crimeY + 'px' }"
  >
    <div class="crime-header">
      <span class="crime-badge" :class="crimeBadgeClass">{{ crimeZone.risk_level }}</span>
      <span class="crime-state">{{ crimeZone.state }}</span>
    </div>
    <div class="crime-name">{{ crimeZone.name }}</div>
    <div class="crime-info">{{ crimeZone.info }}</div>
    <div class="crime-bar-wrap">
      <div class="crime-bar-bg">
        <div class="crime-bar-fill" :style="{ width: (crimeZone.crime_index * 100).toFixed(0) + '%', background: crimeBarColor }"></div>
      </div>
      <span class="crime-index-val">{{ (crimeZone.crime_index * 100).toFixed(0) }}/100</span>
    </div>
  </div>

  <!-- Compare mode tooltip -->
  <div
    v-else-if="compareVisible"
    class="shop-tooltip compare-tooltip"
    :style="{ left: compareX + 'px', top: compareY + 'px' }"
  >
    <div class="compare-header">
      <span class="compare-badge" :class="isPurchasesCol ? 'badge-blue' : 'badge-amber'">
        {{ isPurchasesCol ? '🛒 Purchases' : '💰 Avg Order' }}
      </span>
    </div>
    <div class="compare-location">{{ compareCell.count }} shops in this area</div>
    <div class="compare-row">
      <span class="compare-label">Total Purchases</span>
      <span class="compare-val blue">{{ Number(compareCell.total_purchases).toLocaleString() }}</span>
    </div>
    <div class="compare-row">
      <span class="compare-label">Avg. Order</span>
      <span class="compare-val amber">${{ Number(compareCell.avg_order).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} MXN</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  pickInfo: {
    type: Object,
    default: null,
  },
});

// Point layer tooltip
const visible = computed(() => {
  return (
    props.pickInfo?.picked &&
    props.pickInfo?.layer?.id === 'scatter-layer' &&
    props.pickInfo?.object
  );
});
const shop = computed(() => props.pickInfo?.object ?? {});
const x = computed(() => (props.pickInfo?.x ?? 0) + 12);
const y = computed(() => (props.pickInfo?.y ?? 0) + 12);

// Hex layer tooltip
const hexVisible = computed(() => {
  return (
    props.pickInfo?.picked &&
    props.pickInfo?.layer?.id === 'hexagon-layer' &&
    props.pickInfo?.object
  );
});
const hexCount = computed(() => props.pickInfo?.object?.count ?? 0);
const hexElevation = computed(() => props.pickInfo?.object?.elevationValue ?? 0);

// Crime zone tooltip
const crimeVisible = computed(() =>
  props.pickInfo?.picked &&
  props.pickInfo?.layer?.id === 'crime-zones-layer' &&
  props.pickInfo?.object
);
const crimeZone = computed(() => props.pickInfo?.object?.properties ?? {});
const crimeX = computed(() => (props.pickInfo?.x ?? 0) + 14);
const crimeY = computed(() => (props.pickInfo?.y ?? 0) + 14);
const crimeBadgeClass = computed(() => {
  const idx = crimeZone.value.crime_index ?? 0;
  if (idx >= 0.85) return 'badge-critical';
  if (idx >= 0.70) return 'badge-high';
  return 'badge-medium';
});
const crimeBarColor = computed(() => {
  const t = crimeZone.value.crime_index ?? 0;
  const r = 255;
  const g = Math.round(200 * (1 - t * 0.95));
  return `rgb(${r},${g},0)`;
});

// Compare layer tooltip
const compareVisible = computed(() => {
  const id = props.pickInfo?.layer?.id;
  return (
    props.pickInfo?.picked &&
    (id === 'purchases-column' || id === 'avgorder-column') &&
    props.pickInfo?.object
  );
});
const isPurchasesCol = computed(() => props.pickInfo?.layer?.id === 'purchases-column');
const compareCell = computed(() => props.pickInfo?.object ?? {});
const compareX = computed(() => (props.pickInfo?.x ?? 0) + 12);
const compareY = computed(() => (props.pickInfo?.y ?? 0) + 12);
const hexX = computed(() => (props.pickInfo?.x ?? 0) + 12);
const hexY = computed(() => (props.pickInfo?.y ?? 0) + 12);

const typeClass = computed(() => {
  const map = { Repair: 'type-repair', Parts: 'type-parts', Both: 'type-both', Other: 'type-other' };
  return map[shop.value?.shop_type] ?? 'type-other';
});

const sourceLabel = computed(() => {
  const map = { denue: 'DENUE', google: 'Google', both: 'Both' };
  return map[shop.value?.source] ?? shop.value?.source ?? '';
});
</script>

<style scoped>
.shop-tooltip {
  position: fixed;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.96);
  color: #f1f5f9;
  border-radius: 10px;
  padding: 12px 16px;
  max-width: 300px;
  pointer-events: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  font-size: 13px;
  line-height: 1.5;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.tooltip-header {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
}

.shop-type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.type-repair  { background: #1d4ed8; color: #bfdbfe; }
.type-parts   { background: #92400e; color: #fde68a; }
.type-both    { background: #065f46; color: #a7f3d0; }
.type-other   { background: #374151; color: #d1d5db; }

.source-badge {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 99px;
  background: rgba(255,255,255,0.1);
  color: #94a3b8;
}

.tooltip-name {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.3;
}

.tooltip-row {
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
  color: #cbd5e1;
}
.tooltip-row.small { font-size: 12px; color: #94a3b8; }

.icon { flex-shrink: 0; }

.tooltip-actions {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.maps-link {
  color: #60a5fa;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
}
.maps-link:hover { text-decoration: underline; }

.hex-tooltip {
  padding: 8px 12px;
  text-align: center;
}

.compare-tooltip {
  min-width: 220px;
}

.compare-header {
  margin-bottom: 8px;
}

.compare-badge {
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 99px;
}
.badge-blue  { background: rgba(59,130,246,0.2); color: #93c5fd; }
.badge-amber { background: rgba(245,158,11,0.2); color: #fcd34d; }

.compare-location {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 10px;
}

.compare-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  gap: 12px;
}

.compare-label {
  font-size: 12px;
  color: #94a3b8;
}

.compare-val {
  font-size: 14px;
  font-weight: 700;
}
.compare-val.blue  { color: #60a5fa; }
.compare-val.amber { color: #fbbf24; }

/* ── Crime zone tooltip ──────────────────────────────── */
.crime-tooltip {
  min-width: 210px;
  padding: 10px 14px;
}

.crime-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 6px;
}

.crime-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge-critical { background: rgba(220, 38, 38, 0.25); color: #fca5a5; border: 1px solid rgba(220,38,38,0.4); }
.badge-high     { background: rgba(234, 88, 12, 0.25); color: #fdba74; border: 1px solid rgba(234,88,12,0.4); }
.badge-medium   { background: rgba(202, 138, 4,  0.25); color: #fde047; border: 1px solid rgba(202,138,4, 0.4); }

.crime-state {
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.crime-name {
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 5px;
}

.crime-info {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 10px;
  line-height: 1.4;
}

.crime-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.crime-bar-bg {
  flex: 1;
  height: 6px;
  border-radius: 99px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
}

.crime-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.3s ease;
}

.crime-index-val {
  font-size: 11px;
  font-weight: 700;
  color: #f87171;
  flex-shrink: 0;
}
</style>
