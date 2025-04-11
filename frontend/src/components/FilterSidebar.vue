<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  platforms: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  },
  followerRange: {
    type: Array,
    default: () => [0, 2000000]
  }
});

const emit = defineEmits(['filter-change']);

const selectedPlatforms = ref([]);
const selectedCategories = ref([]);
const followerMin = ref(props.followerRange[0]);
const followerMax = ref(props.followerRange[1]);

watch(
  () => props.followerRange,
  (newRange) => {
    followerMin.value = newRange[0];
    followerMax.value = newRange[1];
  }
);

function applyFilters() {
  emit('filter-change', {
    platforms: selectedPlatforms.value,
    categories: selectedCategories.value,
    followerRange: [followerMin.value, followerMax.value]
  });
}

function resetFilters() {
  selectedPlatforms.value = [];
  selectedCategories.value = [];
  followerMin.value = 0;
  followerMax.value = 2000000;
  applyFilters();
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="flex flex-col space-y-1.5 p-6">
      <h3 class="text-2xl font-semibold leading-none tracking-tight">Filters</h3>
      <p class="text-sm text-gray-500">Refine your creator selection</p>
    </div>

    <div class="p-6 pt-0">
      <!-- Platforms -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Platforms</h4>
        <div class="space-y-2">
          <label 
            v-for="platform in platforms" 
            :key="platform" 
            class="flex items-center space-x-2"
          >
            <input 
              type="checkbox" 
              :value="platform" 
              v-model="selectedPlatforms"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ platform }}</span>
          </label>
        </div>
      </div>

      <!-- Follower Range -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Follower Range</h4>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="text-sm">Min</label>
            <input 
              type="number" 
              v-model.number="followerMin"
              min="0"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
          </div>
          <div class="flex-1">
            <label class="text-sm">Max</label>
            <input 
              type="number" 
              v-model.number="followerMax"
              min="0"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
          </div>
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Content Categories</h4>
        <div class="space-y-2">
          <label 
            v-for="category in categories" 
            :key="category" 
            class="flex items-center space-x-2"
          >
            <input 
              type="checkbox" 
              :value="category" 
              v-model="selectedCategories"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ category }}</span>
          </label>
        </div>
      </div>
    </div>

    <div class="flex items-center p-6 pt-0 justify-between">
      <button 
        @click="resetFilters"
        class="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
        Reset
      </button>
      <button 
        @click="applyFilters"
        class="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
        Apply Filters
      </button>
    </div>
  </div>
</template>
