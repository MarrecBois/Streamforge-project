<script setup>
import { ref, watch, toRefs } from 'vue';

const props = defineProps({
  filters : Object,
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
  },
  region: {
    type: Array,
    default: () => []
  },
  verifiedOnly: {
    type: Boolean,
    default: false
  },
  engagementRateMin: {
    type: Number,
    default: 0
  },
});

const emit = defineEmits(['filter-change']);

const filters = props.filters;

const activeDropdown = ref(null);

function applyFilters() {
  emit('filter-change', { ...filters });
}

function resetFilters() {
  props.filters.platforms = [];
  props.filters.categories = [];
  props.filters.followerRange = [0, 2000000];
  props.filters.regions = [];
  props.filters.verifiedOnly = false;
  props.filters.engagementRateMin = 0;
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
              v-model="filters.platforms"
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
              v-model.number="filters.followerRange[0]"
              min="0"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            >
          </div>
          <div class="flex-1">
            <label class="text-sm">Max</label>
            <input 
              type="number" 
              v-model.number="filters.followerRange[1]"
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
            @click="activeDropdown = activeDropdown === 'categories' ? null : 'categories'"
            type="button"
            class="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <span>
              {{ filters.categories.length ? filters.categories.join(', ') : 'Select Categories' }}
            </span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="activeDropdown === 'categories'"
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
                  v-model="filters.categories"
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
            @click="activeDropdown = activeDropdown === 'regions' ? null : 'regions'"
            type="button"
            class="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <span>
              {{ filters.regions.length ? filters.regions.join(', ') : 'Select Regions' }}
            </span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="activeDropdown === 'regions'"
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
                  v-model="filters.regions"
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
            v-model="filters.verifiedOnly"
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
          v-model.number="filters.engagementRateMin"
          min="0"
          max="100"
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
