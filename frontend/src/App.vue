<template>
  <!-- Auth loading splash -->
  <div v-if="authLoading" class="auth-splash">
    <span class="auth-splash-logo">🏍</span>
  </div>

  <!-- Login screen -->
  <LoginView v-else-if="!user" />

  <!-- Main app -->
  <div v-else class="app">
    <!-- Header -->
    <header class="app-header">
      <!-- Left: logo + title -->
      <div class="header-left">
        <span class="logo">🏍</span>
        <div class="header-titles">
          <h1 class="app-title">Tiendas de Motos México</h1>
          <p class="app-subtitle">Mapa 3D de densidad — deck.gl + Google Maps</p>
        </div>
      </div>

      <!-- Search group: Estado select + SearchBar -->
      <div class="header-search-group">
        <StateDropdown
          v-model="filters.state"
          :all-states="allStates"
        />
        <SearchBar :shops="shops" @fly-to="onFlyTo" />
      </div>

      <!-- View mode tabs -->
      <div class="view-mode-tabs">
        <button
          class="view-tab"
          :class="{ active: filters.viewMode === 'hex' }"
          @click="filters.viewMode = 'hex'"
        >Densidad</button>
        <button
          class="view-tab"
          :class="{ active: filters.viewMode === 'points' }"
          @click="filters.viewMode = 'points'"
        >Tiendas</button>
        <button
          class="view-tab compare-tab"
          :class="{ active: filters.viewMode === 'compare' }"
          @click="filters.viewMode = 'compare'"
        >Ventas<span class="tab-extra"> Men. + Orden Prom.</span></button>
      </div>

      <!-- Right: stats + fuente + user menu -->
      <div class="header-right">
        <!-- Loading / Error / Stats -->
        <div v-if="loading" class="loading-badge">
          <span class="pulse"></span> Cargando…
        </div>
        <div v-else-if="error" class="error-badge" :title="error">
          ⚠ Error
        </div>
        <div v-else class="stats-pill">
          <span class="stats-total">{{ shops.length.toLocaleString() }}</span>
          <span class="stats-sep">·</span>
          <span class="stats-filtered" :class="{ dimmed: filteredShops.length === shops.length }">
            {{ filteredShops.length.toLocaleString() }}<span class="stats-label-txt"> mostradas</span>
          </span>
        </div>

        <!-- Fuente de Datos dropdown -->
        <FuenteDropdown
          v-model="filters.sources"
          class="fuente-dropdown-header"
        />

        <!-- User avatar menu -->
        <UserMenu
          :user="user"
          :display-name="userDisplayName"
          @open-profile="profileOpen = true"
          @sign-out="signOut"
        />

        <!-- Mobile-only filter toggle -->
        <button class="mobile-filter-btn" @click="mobileFilterOpen = true" title="Abrir filtros">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Map + Filters layout -->
    <div class="main-layout">
      <MapView
        ref="mapViewRef"
        :layers="layers"
        :on-layer-click="onLayerClick"
        :on-saved-place-click="onSavedPlaceClick"
        class="map-area"
      />

      <!-- Bottom legend bar -->
      <BottomLegendBar
        :view-mode="filters.viewMode"
        :show-purchases="filters.showPurchases"
        :show-avg-order="filters.showAvgOrder"
        @update:showPurchases="filters.showPurchases = $event"
        @update:showAvgOrder="filters.showAvgOrder = $event"
      />

      <!-- Mobile backdrop -->
      <div v-if="mobileFilterOpen" class="mobile-backdrop" @click="mobileFilterOpen = false" />

      <FilterPanel
        v-model="filters"
        :all-states="allStates"
        :mobile-open="mobileFilterOpen"
        @close="mobileFilterOpen = false"
      />

      <!-- Profile panel -->
      <ProfilePanel
        :visible="profileOpen"
        @close="profileOpen = false"
      />

      <!-- Click panels -->
      <HexShopListPanel
        :shops="clickedHexShops"
        @close="clickedHexShops = null"
        @select-shop="openShopFromHex"
      />
      <ShopDetailPanel
        :shop="clickedShop"
        @close="clickedShop = null"
      />
      <PlaceDetailPanel
        :place="selectedPlace"
        @close="selectedPlace = null; mapViewRef?.clearPin()"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import MapView from './components/MapView.vue';
import FilterPanel from './components/FilterPanel.vue';
import SearchBar from './components/SearchBar.vue';
import ShopDetailPanel from './components/ShopDetailPanel.vue';
import HexShopListPanel from './components/HexShopListPanel.vue';
import PlaceDetailPanel from './components/PlaceDetailPanel.vue';
import UserMenu from './components/UserMenu.vue';
import ProfilePanel from './components/ProfilePanel.vue';
import BottomLegendBar from './components/BottomLegendBar.vue';
import FuenteDropdown from './components/FuenteDropdown.vue';
import StateDropdown from './components/StateDropdown.vue';
import { useShops } from './composables/useShops.js';
import { useDeckLayers } from './composables/useDeckLayers.js';
import { useVisited } from './composables/useVisited.js';
import { useSavedPlaces } from './composables/useSavedPlaces.js';
import { useAuth } from './composables/useAuth.js';
import LoginView from './components/LoginView.vue';

const { user, authLoading, userDisplayName, signOut } = useAuth();
const { shops, loading, error, allStates, fetchShops } = useShops();
const mobileFilterOpen = ref(false);
const profileOpen = ref(false);
const { visitedShops, visitedIds, visitedStatusMap, fetchVisited, migrateFromShopStatuses, migrateToNewStatusModel } = useVisited();
const { savedPlaces, fetchSavedPlaces } = useSavedPlaces();
const mapViewRef = ref(null);

function onFlyTo(payload) {
  mapViewRef.value?.flyTo(payload);

  if (payload.place) {
    selectedPlace.value = payload.place;
    clickedShop.value = null;
    clickedHexShops.value = null;
    mapViewRef.value?.placePin({ lat: payload.lat, lng: payload.lng, label: payload.place.name || '' });
  } else if (payload.shop) {
    selectedPlace.value = null;
    clickedShop.value = payload.shop;
    clickedHexShops.value = null;
    const label = payload.shop.name || payload.shop.company_name || '';
    mapViewRef.value?.placePin({ lat: payload.lat, lng: payload.lng, label });
  }
}

function onSavedPlaceClick(place) {
  selectedPlace.value = place;
  clickedShop.value = null;
  clickedHexShops.value = null;
  mapViewRef.value?.flyTo({ lat: place.lat, lng: place.lng, zoom: 15 });
  mapViewRef.value?.placePin({ lat: place.lat, lng: place.lng, label: place.name || '' });
}

const filters = ref({
  viewMode:             'points',
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

const filteredShops = computed(() => {
  const visitedMap = new Map(visitedShops.value.map((v) => [v.id, v]));

  return shops.value.filter((s) => {
    if (!filters.value.shopTypes.includes(s.shop_type)) return false;
    if (!filters.value.sources.includes(s.source)) return false;
    if (filters.value.state.length > 0 && !filters.value.state.includes(s.state)) return false;
    if (filters.value.minRating > 0) {
      if (!s.rating || s.rating < filters.value.minRating) return false;
    }

    const isVisitada = visitedIds.value.has(s.id);
    const vs = filters.value.showVisitStatus;
    if ( isVisitada && !vs.includes('visitada'))    return false;
    if (!isVisitada && !vs.includes('no_visitada')) return false;

    if (isVisitada) {
      const vStatus = visitedStatusMap.value.get(s.id) ?? 'visita_exitosa';
      if (!filters.value.showVisitedStatuses.includes(vStatus)) return false;
    }

    if (isVisitada && (filters.value.visitDateFrom || filters.value.visitDateTo)) {
      const vd = visitedMap.get(s.id);
      const rawTs = vd?.statusAt;
      const visitMs = rawTs
        ? (typeof rawTs.toDate === 'function' ? rawTs.toDate().getTime() : rawTs.seconds * 1000)
        : null;
      if (!visitMs) return false;
      if (filters.value.visitDateFrom) {
        const fromMs = new Date(filters.value.visitDateFrom + 'T00:00:00').getTime();
        if (visitMs < fromMs) return false;
      }
      if (filters.value.visitDateTo) {
        const toMs = new Date(filters.value.visitDateTo + 'T23:59:59').getTime();
        if (visitMs > toMs) return false;
      }
    }

    if (isVisitada) {
      const vd = visitedMap.get(s.id);
      if (filters.value.minScoreGeneral > 0) {
        if (!vd?.score_general || vd.score_general < filters.value.minScoreGeneral) return false;
      }
      if (filters.value.minScorePains > 0) {
        if (!vd?.score_pains || vd.score_pains < filters.value.minScorePains) return false;
      }
      if (filters.value.minScoreProbabilidad > 0) {
        if (!vd?.score_probabilidad || vd.score_probabilidad < filters.value.minScoreProbabilidad) return false;
      }
      if (filters.value.minScoreSatisfaccion > 0) {
        if (!vd?.score_satisfaccion || vd.score_satisfaccion < filters.value.minScoreSatisfaccion) return false;
      }
      if (filters.value.tamanoTienda.length > 0) {
        if (!filters.value.tamanoTienda.includes(vd?.tamano_tienda)) return false;
      }
      if (filters.value.credito.length > 0) {
        if (!filters.value.credito.includes(vd?.credito)) return false;
      }
      if (filters.value.metodoPago.length > 0) {
        const shopPagos = Array.isArray(vd?.metodo_pago) ? vd.metodo_pago : (vd?.metodo_pago ? [vd.metodo_pago] : []);
        if (!shopPagos.some((p) => filters.value.metodoPago.includes(p))) return false;
      }
      if (filters.value.entrega.length > 0) {
        if (!filters.value.entrega.includes(vd?.entrega)) return false;
      }
      if (filters.value.principalProveedor.length > 0) {
        const shopProveedores = Array.isArray(vd?.principal_proveedor)
          ? vd.principal_proveedor
          : (vd?.principal_proveedor ? [vd.principal_proveedor] : []);
        if (!shopProveedores.some((p) => filters.value.principalProveedor.includes(p))) return false;
      }
      if (filters.value.contactoPersonal.length > 0) {
        if (!filters.value.contactoPersonal.includes(vd?.contacto_personal)) return false;
      }
    }

    return true;
  });
});

const viewMode = computed(() => filters.value.viewMode);
const showPurchases = computed(() => filters.value.showPurchases);
const showAvgOrder = computed(() => filters.value.showAvgOrder);
const onHover = ref((info) => info);

const clickedShop = ref(null);
const clickedHexShops = ref(null);
const selectedPlace = ref(null);

const HEX_RADIUS_DEG = 0.045;
const COMPARE_GRID_SIZE = 0.05;

function findShopsInHex(clickLng, clickLat) {
  return filteredShops.value.filter((s) =>
    s.latitude != null &&
    s.longitude != null &&
    Math.abs(s.latitude - clickLat) < HEX_RADIUS_DEG &&
    Math.abs(s.longitude - clickLng) < HEX_RADIUS_DEG
  );
}

function findShopsInCompareCell(cellLat, cellLng) {
  const latKey = Math.floor(cellLat / COMPARE_GRID_SIZE);
  const lngKey = Math.floor(cellLng / COMPARE_GRID_SIZE);
  return filteredShops.value.filter((s) =>
    s.latitude != null &&
    s.longitude != null &&
    Math.floor(s.latitude / COMPARE_GRID_SIZE) === latKey &&
    Math.floor(s.longitude / COMPARE_GRID_SIZE) === lngKey
  );
}

function findNearestShopToClick(clickLat, clickLng, cellLat, cellLng) {
  const shopList = findShopsInCompareCell(cellLat, cellLng);
  if (!shopList.length) return null;
  if (shopList.length === 1) return shopList[0];
  const refLat = clickLat ?? cellLat;
  const refLng = clickLng ?? cellLng;
  return shopList.reduce((nearest, s) => {
    const d  = (s.latitude - refLat) ** 2 + (s.longitude - refLng) ** 2;
    const nd = (nearest.latitude - refLat) ** 2 + (nearest.longitude - refLng) ** 2;
    return d < nd ? s : nearest;
  });
}

function onLayerClick(info) {
  const layerId = info.layer?.id;

  if (layerId === 'scatter-layer' && info.object) {
    clickedShop.value = info.object;
    clickedHexShops.value = null;
    if (info.object.latitude != null && info.object.longitude != null) {
      mapViewRef.value?.placePin({
        lat: info.object.latitude,
        lng: info.object.longitude,
        label: info.object.name || info.object.company_name || '',
      });
    }

  } else if (layerId === 'hexagon-layer') {
    const [clickLng, clickLat] = info.coordinate ?? [];
    let shopList = info.object?.points ?? info.object?.data ?? [];
    if (!shopList.length && clickLat != null) {
      shopList = findShopsInHex(clickLng, clickLat);
    }
    if (shopList.length) {
      clickedHexShops.value = shopList;
      clickedShop.value = null;
      mapViewRef.value?.clearPin();
    }

  } else if (layerId === 'purchases-column' || layerId === 'avgorder-column') {
    if (!info.object) return;
    const shop = info.object;
    clickedShop.value = shop;
    clickedHexShops.value = null;
    if (shop.latitude != null && shop.longitude != null) {
      mapViewRef.value?.placePin({
        lat: shop.latitude,
        lng: shop.longitude,
        label: shop.name || shop.company_name || '',
      });
    }
  }
}

function openShopFromHex(shop) {
  clickedHexShops.value = null;
  clickedShop.value = shop;
  if (shop.latitude != null && shop.longitude != null) {
    mapViewRef.value?.placePin({ lat: shop.latitude, lng: shop.longitude, label: shop.name || shop.company_name || '' });
    mapViewRef.value?.flyTo({ lat: shop.latitude, lng: shop.longitude, zoom: 17 });
  }
}

const onClickCallback = ref(onLayerClick);
const { layers } = useDeckLayers(filteredShops, viewMode, onHover, showPurchases, showAvgOrder, onClickCallback);

watch(viewMode, (mode) => {
  if (mode === 'compare') {
    mapViewRef.value?.setTilt(55);
    mapViewRef.value?.setHeading(20);
  } else {
    mapViewRef.value?.setTilt(0);
    mapViewRef.value?.setHeading(0);
  }
});

watch(savedPlaces, (places) => {
  if (mapViewRef.value) {
    mapViewRef.value.syncSavedMarkers(places);
  } else {
    setTimeout(() => mapViewRef.value?.syncSavedMarkers(places), 2000);
  }
}, { deep: true });

watch(user, (u) => {
  if (u) {
    fetchShops();
    fetchVisited();
    fetchSavedPlaces();
    migrateFromShopStatuses();
    migrateToNewStatusModel();
  }
}, { immediate: true });
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #0f172a;
  font-family: 'Inter', system-ui, sans-serif;
}

/* ── Header ───────────────────────────────────────────── */
.app-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(10, 15, 30, 0.97);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  z-index: 20;
  flex-shrink: 0;
  min-width: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.logo { font-size: 22px; }

.app-title {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
  white-space: nowrap;
}

.app-subtitle {
  margin: 0;
  font-size: 10px;
  color: #334155;
  white-space: nowrap;
}

/* ── Search group ─────────────────────────────────────── */
.header-search-group {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  max-width: 460px;
  gap: 0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  /* No overflow:hidden — would clip the dropdown */
  transition: border-color 0.15s;
  position: relative;
}
.header-search-group:focus-within {
  border-color: rgba(99, 179, 237, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
}

.estado-select {
  flex-shrink: 0;
  padding: 0 10px;
  height: 34px;
  background: rgba(255, 255, 255, 0.04);
  border: none;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 7px 0 0 7px;
  color: #94a3b8;
  font-size: 12px;
  font-family: inherit;
  outline: none;
  cursor: pointer;
  max-width: 130px;
  min-width: 80px;
}
.estado-select option { background: #1e293b; }
.estado-select:focus { color: #e2e8f0; }

/* Override SearchBar's own border/background since it's inside the group */
.header-search-group :deep(.search-box) {
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none !important;
}
.header-search-group :deep(.search-box.focused) {
  background: transparent;
  border: none;
  box-shadow: none !important;
}

/* ── View mode tabs ───────────────────────────────────── */
.view-mode-tabs {
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 8px;
  padding: 3px;
  flex-shrink: 0;
}

.view-tab {
  padding: 5px 12px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: transparent;
  color: #64748b;
  transition: all 0.15s;
  white-space: nowrap;
  font-family: inherit;
}
.view-tab:hover { color: #cbd5e1; background: rgba(255, 255, 255, 0.06); }
.view-tab.active { background: #1d4ed8; color: #fff; font-weight: 600; }
.compare-tab { color: #a78bfa; }
.compare-tab:hover { color: #c4b5fd; background: rgba(139, 92, 246, 0.1); }
.compare-tab.active { background: #6d28d9; color: #fff; }

/* ── Header right ─────────────────────────────────────── */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: auto;
}

/* Stats pill */
.stats-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.stats-total { color: #f1f5f9; font-weight: 700; }
.stats-sep { color: #334155; }
.stats-filtered { color: #34d399; }
.stats-filtered.dimmed { color: #475569; }

/* Loading / error badges */
.loading-badge,
.error-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.loading-badge {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.25);
}
.error-badge {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.25);
  cursor: help;
}

.pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3b82f6;
  animation: pulse 1.2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.75); }
}

/* Mobile filter button */
.mobile-filter-btn {
  display: none;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 8px;
  color: #e2e8f0;
  cursor: pointer;
  padding: 0;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}
.mobile-filter-btn:hover { background: rgba(255, 255, 255, 0.13); }

/* ── Main layout ──────────────────────────────────────── */
.main-layout {
  position: relative;
  flex: 1;
  overflow: hidden;
  display: flex;
}

.map-area {
  flex: 1;
  height: 100%;
}

/* Mobile backdrop */
.mobile-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 190;
}

/* ── Auth splash ──────────────────────────────────────── */
.auth-splash {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0f1117;
  font-size: 64px;
  z-index: 9999;
}

/* ── Mobile ───────────────────────────────────────────── */
@media (max-width: 640px) {
  /* Three-row stacked header */
  .app-header {
    flex-wrap: wrap;
    padding: 10px 12px 8px;
    gap: 0;
    row-gap: 8px;
    align-items: center;
  }

  /* ── Row 1: Logo + title + [spacer] + stats + avatar + filter ── */
  .header-left {
    order: 1;
    flex: 1;
    min-width: 0;
  }

  /* Show title, hide only the subtitle */
  .app-subtitle { display: none; }
  .app-title { font-size: 13px; }

  .header-right {
    order: 2;
    flex-shrink: 0;
    margin-left: 0;
    gap: 7px;
  }

  /* Stats: always visible on mobile, compact */
  .stats-pill {
    display: flex;
    padding: 3px 8px;
    font-size: 11px;
    gap: 4px;
  }
  .stats-label-txt { display: none; }

  /* Hide fuente on mobile */
  .fuente-dropdown-header { display: none; }

  /* ── Row 2: Search bar (full width) ── */
  .header-search-group {
    order: 3;
    flex: none;
    width: 100%;
    max-width: none;
  }

  .estado-select { display: none; }

  /* ── Row 3: View mode tabs (full width, each tab equal) ── */
  .view-mode-tabs {
    order: 4;
    width: 100%;
    flex-basis: 100%;
    padding: 3px;
    gap: 3px;
  }

  .view-tab {
    flex: 1;
    text-align: center;
    padding: 7px 4px;
    font-size: 11px;
  }

  /* Shorten "Ventas Men. + Orden Prom." → "Ventas" */
  .tab-extra { display: none; }

  .mobile-filter-btn { display: flex; }
  .mobile-backdrop { display: block; }
}
</style>
