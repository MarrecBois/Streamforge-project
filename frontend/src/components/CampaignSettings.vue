<script setup>
import { ref, toRef } from 'vue';

const props = defineProps({
  settings: Object
});

const campaignSettings = props.settings;
const defaultSettings = {
  budget: [100, 500],
  targetGenres: [],
  targetAgeGroups: [],
  targetGenders: [],
  targetRegions: [],
  targetFormats: [],
  duration: 30,
  campaignObjective: 'brand_awareness',
  customWeights: {
    budgetFit: 0.1,
    contentRelevance: 0.2,
    audienceFit: 0.2,
    engagementQuality: 0.15,
    previousPerformance: 0.1,
    regionFit: 0.15,
    contentFormatRelevance: 0.1
  }
};



const emit = defineEmits(['settings-change']);


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
});

// Control for dropdown selections
const activeDropdown = ref(null);

function applySettings() {
  emit('settings-change', { ...campaignSettings.value  });
}

function resetSettings() {
  Object.assign(campaignSettings, JSON.parse(JSON.stringify(defaultSettings)));
  applySettings();
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 bg-white shadow-sm">
    <div class="flex flex-col space-y-1.5 p-6">
      <h3 class="text-2xl font-semibold leading-none tracking-tight">Campaign Settings</h3>
      <p class="text-sm text-gray-500">Configure your campaign parameters</p>
    </div>

    <div class="p-6 pt-0">
      <!-- Campaign Objective -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Campaign Objective</h4>
        <div class="relative">
          <button
            @click="activeDropdown = activeDropdown === 'objective' ? null : 'objective'"
            type="button"
            class="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <span>
              {{
                objectives.find(obj => obj.value === campaignSettings.campaignObjective)?.label ||
                'Select Campaign Objective'
              }}
            </span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="activeDropdown === 'objective'"
            class="absolute z-10 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg max-h-60 overflow-y-auto"
          >
            <div class="p-2 space-y-1">
              <button
                v-for="objective in objectives"
                :key="objective.value"
                @click="campaignSettings.campaignObjective = objective.value; activeDropdown = null"
                class="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded-md"
              >
                {{ objective.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Custom Weights -->
      <div v-if="campaignSettings.campaignObjective === 'custom'" class="mb-6 space-y-4">
        <div v-for="(label, key) in {
          budgetFit: 'Budget Fit',
          contentRelevance: 'Genre Relevance',
          audienceFit: 'Audience Fit',
          engagementQuality: 'Engagement Quality',
          previousPerformance: 'Previous Performance',
          regionFit: 'Region Fit',
          contentFormatRelevance: 'Content Format Relevance'
        }" :key="key">
          <label class="text-sm font-medium">
            {{ label }} ({{ campaignSettings.customWeights[key].toFixed(2) }})
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="campaignSettings.customWeights[key]"
            class="w-full"
          />
        </div>
      </div>

      <!-- Budget -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Budget per Creator ($/hour)</h4>
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="text-sm">Min</label>
            <input
              type="number"
              v-model.number="campaignSettings.budget[0]"
              min="0"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
          <div class="flex-1">
            <label class="text-sm">Max</label>
            <input
              type="number"
              v-model.number="campaignSettings.budget[1]"
              min="0"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
            />
          </div>
        </div>
      </div>

      <!-- Age Groups -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Age Groups</h4>
        <div class="space-y-2">
          <label v-for="age in ageGroups" 
          :key="age" 
          class="flex items-center space-x-2">
            <input
              type="checkbox"
              :value="age"
              v-model="campaignSettings.targetAgeGroups"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            />
            <span>{{ age }}</span>
          </label>
        </div>
      </div>

      <!-- Genders -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Gender</h4>
        <div class="space-y-2">
          <label v-for="gender in genders" 
          :key="gender" 
          class="flex items-center space-x-2 capitalize">
            <input
              type="checkbox"
              :value="gender"
              v-model="campaignSettings.targetGenders"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            />
            <span>{{ gender }}</span>
          </label>
        </div>
      </div>

      <!-- Regions -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Regions</h4>
        <div class="space-y-2">
          <label v-for="region in regions" 
          :key="region" 
          class="flex items-center space-x-2">
            <input
              type="checkbox"
              :value="region"
              v-model="campaignSettings.targetRegions"
              class="w-4 h-4 text-brand-purple focus:ring-brand-purple"
            />
            <span>{{ region }}</span>
          </label>
        </div>
      </div>

      <!-- Formats -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Preferred Content Formats</h4>
        <div class="relative">
          <button
            @click="activeDropdown = activeDropdown === 'formats' ? null : 'formats'"
            type="button"
            class="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <span>
              {{ campaignSettings.targetFormats?.length ? campaignSettings.targetFormats.join(', ') : 'Select Content Formats' }}
            </span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="activeDropdown === 'formats'"
            class="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
          >
            <div class="p-2 space-y-1">
              <label v-for="format in contentFormats" 
              :key="format" 
              class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :value="format"
                  v-model="campaignSettings.targetFormats"
                  class="w-4 h-4 text-brand-purple"
                />
                <span class="text-sm">{{ format }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Game Genres -->
      <div class="mb-6">
        <h4 class="font-medium mb-2">Target Game Genres</h4>
        <div class="relative">
          <button
            @click="activeDropdown = activeDropdown === 'genres' ? null : 'genres'"
            type="button"
            class="w-full flex justify-between items-center border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          >
            <span>
              {{ campaignSettings.targetGenres?.length ? campaignSettings.targetGenres.join(', ') : 'Select Game Genres' }}
            </span>
            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-if="activeDropdown === 'genres'"
            class="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg"
          >
            <div class="p-2 space-y-1">
              <label v-for="genre in gameGenres" 
              :key="genre" 
              class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  :value="genre"
                  v-model="campaignSettings.targetGenres"
                  class="w-4 h-4 text-brand-purple"
                />
                <span class="text-sm">{{ genre }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center p-6 pt-0 justify-between">
      <button 
        @click="resetSettings"
        class="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Reset Settings
      </button>
      <button 
        @click="applySettings"
        class="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Update Match Scores
      </button>
    </div>
  </div>
</template>
