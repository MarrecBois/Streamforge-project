<script setup>
import { ref } from 'vue';

const emit = defineEmits(['settings-change']);

const budgetMin = ref(100);
const budgetMax = ref(500);
const selectedGenres = ref([]);
const targetAgeGroups = ref([]);
const targetGenders = ref([]);
const targetRegions = ref([]);
const targetFormats = ref([]);
const campaignObjective = ref('brand_awareness');
const showFormats = ref(false);
const showGenres = ref(false);

const gameGenres = [
  'FPS',
  'MOBA',
  'Battle Royale',
  'RPG',
  'Strategy',
  'Platformer',
  'Simulation',
  'Open World',
  'Indie',
  'Mobile'
];

const ageGroups = [
  '18-24',
  '25-34',
  '35+'
];

const genders = [
  'male',
  'female',
  'other'
];

const regions = [
  'US',
  'EU',
  'APAC'
];

const contentFormats = [
  'Short-form',
  'Live Content',
  'Educational',
  'Cinematic',
  'Entertainment'
];

// Options for campaign objectives
const objectives = [
  { value: 'brand_awareness', label: 'Brand Awareness' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'community_engagement', label: 'Community Engagement' },
  { value: 'conversion', label: 'Conversions & Sales' },
  { value: 'custom', label: 'Custom Weighting' },
];

// Default values for custom weighting
const customWeights = ref({
  budgetFit: 0.1,
  contentRelevance: 0.2,
  audienceFit: 0.2,
  engagementQuality: 0.15,
  previousPerformance: 0.1,
  regionFit: 0.15,
  contentFormatRelevance: 0.1
})

function applySettings() {
  emit('settings-change', {
    budget: [budgetMin.value, budgetMax.value],
    targetGenres: selectedGenres.value,
    targetAgeGroups: targetAgeGroups.value,
    targetGenders: targetGenders.value,
    targetRegions: targetRegions.value,
    targetFormats: targetFormats.value,
    campaignObjective: campaignObjective.value,
    customWeights: campaignObjective.value === 'custom' ? customWeights.value : null
  });
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="flex flex-col space-y-1.5 p-6">
      <h3 class="text-2xl font-semibold leading-none tracking-tight">Campaign Settings</h3>
      <p class="text-sm text-gray-500">Configure your campaign parameters</p>
    </div>
    
    <div class="p-6 pt-0">
      <!-- Campaign objective -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Campaign Objective</h4>
        <select 
          v-model="campaignObjective"
          class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
        >
          <option 
            v-for="objective in objectives" 
            :key="objective.value"
            :value="objective.value"
          >
            {{ objective.label }}
          </option>
        </select>
      </div>

      <!-- Custom Weighting Sliders -->
      <div v-if="campaignObjective === 'custom'" class="mb-6 space-y-4">
        <div v-for="(label, key) in {
          budgetFit: 'Budget Fit',
          contentRelevance: 'Content Relevance',
          audienceFit: 'Audience Fit',
          engagementQuality: 'Engagement Quality',
          previousPerformance: 'Previous Performance',
          regionFit: 'Region Fit',
          contentFormatRelevance: 'Content Format Relevance'
        }" :key="key">
          <label class="text-sm font-medium">{{ label }} ({{ customWeights[key].toFixed(2) }})</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="customWeights[key]"
            class="w-full"
          />
        </div>
      </div>
      
      <!-- Budget range settings -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Budget per Creator ($/hour)</h4>
        <div class="px-2">
          <div class="flex gap-4 mb-2">
            <div class="flex-1">
              <label class="text-sm">Min</label>
              <input 
                type="number" 
                v-model.number="budgetMin"
                min="0"
                max="1000"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
              >
            </div>
            <div class="flex-1">
              <label class="text-sm">Max</label>
              <input 
                type="number" 
                v-model.number="budgetMax"
                min="0"
                max="1000"
                class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
              >
            </div>
          </div>
        </div>
      </div>
      
      <!-- Target audience age -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Age Groups</h4>
        <div class="space-y-2">
          <label 
            v-for="age in ageGroups" 
            :key="age"
            class="flex items-center space-x-2"
          >
            <input 
              type="checkbox"
              :value="age"
              v-model="targetAgeGroups"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ age }}</span>
          </label>
        </div>
      </div>
      
      <!-- Target audience gender -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Gender</h4>
        <div class="space-y-2">
          <label 
            v-for="gender in genders" 
            :key="gender"
            class="flex items-center space-x-2 capitalize"
          >
            <input 
              type="checkbox"
              :value="gender"
              v-model="targetGenders"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ gender }}</span>
          </label>
        </div>
      </div>

      <!-- Target regions -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Regions</h4>
        <div class="space-y-2">
          <label 
            v-for="region in regions" 
            :key="region"
            class="flex items-center space-x-2"
          >
            <input 
              type="checkbox"
              :value="region"
              v-model="targetRegions"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            >
            <span>{{ region }}</span>
          </label>
        </div>
      </div>
      
      <!-- Target content formats -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Preferred Content Formats</h4>
        <div class="relative">
          <button
            @click="showFormats = !showFormats"
            type="button"
            class="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <span>Select Content Formats</span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="showFormats"
            class="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
          >
            <div class="p-2 space-y-1">
              <label
                v-for="format in contentFormats"
                :key="format"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="format"
                  v-model="targetFormats"
                  class="w-4 h-4 text-brand-purple"
                >
                <span class="text-sm">{{ format }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Target game genres -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Game Genres</h4>
        <div class="relative">
          <button
            @click="showGenres = !showGenres"
            type="button"
            class="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <span>Select Game Genres</span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="showGenres"
            class="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
          >
            <div class="p-2 space-y-1">
              <label
                v-for="genre in gameGenres"
                :key="genre"
                class="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  :value="genre"
                  v-model="selectedGenres"
                  class="w-4 h-4 text-brand-purple"
                >
                <span class="text-sm">{{ genre }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center p-6 pt-0 justify-end">
      <button 
        @click="applySettings" 
        class="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">
        Update Match Scores
      </button>
    </div>
  </div>
</template>