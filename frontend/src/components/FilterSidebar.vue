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
const selectedRegions = ref([]);
const verifiedOnly = ref(false);
const engagementRateMin = ref(0);
const showCategories = ref(false);
const showRegions = ref(false);

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
    followerRange: [followerMin.value, followerMax.value],
    regions: selectedRegions.value,
    verifiedOnly: verifiedOnly.value,
    engagementRateMin: engagementRateMin.value
  });
}

function resetFilters() {
  selectedPlatforms.value = [];
  selectedCategories.value = [];
  selectedRegions.value = [];
  verifiedOnly.value = false;
  engagementRateMin.value = 0;
  followerMin.value = 0;
  followerMax.value = 2000000;
  applyFilters();
}

const allRegions = [
  "US-West", "US-East", "US-Central", "US-South",
  "EU-Central", "EU-West", "EU-North", "EU-South",
  "APAC"
];
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
        <div class="relative">
          <button
            @click="showCategories = !showCategories"
            type="button"
            class="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <span>Select Categories</span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="showCategories"
            class="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
          >
            <div class="p-2 space-y-1">
              <label
                v-for="category in categories"
                :key="category"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="category"
                  v-model="selectedCategories"
                  class="w-4 h-4 text-brand-purple"
                >
                <span class="text-sm">{{ category }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Regions -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Regions</h4>
        <div class="relative">
          <button
            @click="showRegions = !showRegions"
            type="button"
            class="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <span>Select Regions</span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="showRegions"
            class="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
          >
            <div class="p-2 space-y-1">
              <label
                v-for="region in allRegions"
                :key="region"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="region"
                  v-model="selectedRegions"
                  class="w-4 h-4 text-brand-purple"
                >
                <span class="text-sm">{{ region }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Verified Only -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Verified Only</h4>
        <label class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            v-model="verifiedOnly"
            class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
          >
          <span>Only show verified creators</span>
        </label>
      </div>

      <!-- Engagement Rate Min -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Minimum Engagement Rate (%)</h4>
        <input 
          type="number"
          v-model.number="engagementRateMin"
          min="0"
          step="0.1"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
        >
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
