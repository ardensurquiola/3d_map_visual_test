import { ref, computed } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config.js';

const shops = ref([]);
const loading = ref(false);
const error = ref(null);
let fetched = false;

export function useShops() {
  async function fetchShops() {
    if (fetched) return;
    loading.value = true;
    error.value = null;
    try {
      const snapshot = await getDocs(collection(db, 'shops'));
      shops.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      fetched = true;
    } catch (e) {
      error.value = e.message;
      console.error('Failed to fetch shops:', e);
    } finally {
      loading.value = false;
    }
  }

  // Derived lists for filter options
  const allStates = computed(() => {
    const set = new Set(shops.value.map((s) => s.state).filter(Boolean));
    return Array.from(set).sort();
  });

  return {
    shops,
    loading,
    error,
    allStates,
    fetchShops,
  };
}
