<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// Import components
import AppHeader from './components/AppHeader.vue';
import CreatorCard from './components/CreatorCard.vue';
import FilterSidebar from './components/FilterSidebar.vue';
import CampaignSettings from './components/CampaignSettings.vue';

// Initial States
const creators = ref([]);
const allCreators = ref([]);
const selectedTab = ref('filters');
const filters = ref({
  platforms: [],
  categories: [],
  followerRange: [0, 2000000],
  regions: [],
  verifiedOnly: false,
  engagementRateMin: 0
});
const campaignSettings = ref({
  budget: [100, 500],
  targetGenres: [],
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
});
const sortBy = ref('matchScore');
const sortDirection = ref('desc');

// Derived data
const availablePlatforms = computed(() => {
  const platforms = new Set();
  allCreators.value.forEach(creator => platforms.add(creator.platform));
  return Array.from(platforms);
});

const availableCategories = computed(() => {
  const categories = new Set();
  allCreators.value.forEach(creator => {
    creator.contentCategories.forEach(category => categories.add(category));
  });
  return Array.from(categories);
});

const filteredCreators = computed(() => {
  // Filtering is now handled by the backend API
  return creators.value;
});

const availableRegions = computed(() => {
  const regions = new Set();
  allCreators.value.forEach(creator => {
    regions.add(creator.location);
  });
  return Array.from(regions);
});


const sortedCreators = computed(() => {
  return [...filteredCreators.value].sort((a, b) => {
    const aValue = a[sortBy.value];
    const bValue = b[sortBy.value];

    return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue;
  });
});

// Methods
async function updateFilters(newFilters) {
  filters.value = { ...filters.value, ...newFilters };
  try {
    const params = new URLSearchParams();

    if (filters.value.platforms.length) {
      filters.value.platforms.forEach(p => params.append('platforms', p));
    }
    if (filters.value.categories.length) {
      filters.value.categories.forEach(c => params.append('categories', c));
    }
    if (filters.value.followerRange.length === 2) {
      params.append('followerRange', filters.value.followerRange[0]);
      params.append('followerRange', filters.value.followerRange[1]);
    }
    if (filters.value.regions.length) {
      filters.value.regions.forEach(r => params.append('regions', r));
    }
    if (filters.value.verifiedOnly) {
      params.append('verifiedOnly', 'true');
    }
    if (filters.value.engagementRateMin) {
      params.append('engagementRateMin', filters.value.engagementRateMin);
    }

    const response = await axios.get(`http://localhost:3000/api/creators/filter?${params.toString()}`);
    creators.value = response.data;

    const matchResponse = await axios.post(`http://localhost:3000/api/match`, {
      ...campaignSettings.value,
      creators: response.data
    });

    creators.value = matchResponse.data;
  } catch (error) {
    console.error('Error applying filters:', error);
  }
}

async function updateCampaignSettings(newSettings) {
  campaignSettings.value = { ...campaignSettings.value, ...newSettings };
  try {
    const response = await axios.post('http://localhost:3000/api/match', {
      ...campaignSettings.value,
      creators: creators.value,
      customWeights : campaignSettings.value.campaignObjective === 'custom' ? campaignSettings.value.customWeights : undefined
    });
    creators.value = response.data;
  } catch (error) {
    console.error('Error updating match scores:', error.response?.data || error.message || error);
  }
}

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
}

async function resetFilters() {
  filters.value = {
    platforms: [],
    categories: [],
    followerRange: [0, 2000000],
    regions: [],
    verifiedOnly: false,
    engagementRateMin: 0
  };
  try {
    // Re-run the match score on the full list
    const matchResponse = await axios.post(`http://localhost:3000/api/match`, {
      ...campaignSettings.value,
      creators: allCreators.value
    });
    creators.value = matchResponse.data;
  } catch (error) {
    console.error('Error resetting filters:', error);
  }
}

onMounted(async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/match', campaignSettings.value);
    allCreators.value = response.data;
    creators.value = response.data;
  } catch (error) {
    console.error('Error fetching creators:', error);
  }
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />

    <main class="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Sidebar with toggle tabs -->
        <div class="w-full md:w-1/3 lg:w-1/4">
          <!-- Tab Controls (Filters vs Campaign Settings)-->
          <div class="mb-4 flex border-b border-grey-300">
            <button
              @click="selectedTab = 'filters'"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium text-center rounded-t-lg',
                selectedTab === 'filters' ? 'bg-white text-gray-900 shadow-sm' : 'bg-gray-100 text-gray-500'
              ]">
              Filters
            </button>
            <button
              @click="selectedTab = 'campaign'"
              :class="[
                'flex-1 px-4 py-2 text-sm font-medium text-center rounded-t-lg',
                selectedTab === 'campaign' ? 'bg-white text-gray-900 shadow-sm' : 'bg-gray-100 text-gray-500'
              ]">
              Campaign Settings
            </button>
          </div>

          <!-- Tab Content -->
          <div>
            <FilterSidebar
              v-if="selectedTab === 'filters'"
              :platforms="availablePlatforms"
              :categories="availableCategories"
              :followerRange="filters.followerRange"
              :region="availableRegions"
              :verified="filters.verifiedOnly"
              :engagementRateMin="filters.engagementRateMin"
              @filter-change="updateFilters"
            />

            <CampaignSettings
              v-if="selectedTab === 'campaign'"
              @settings-change="updateCampaignSettings"
            />
          </div>
        </div>

        <!-- Main content area -->
        <div class="w-full md:w-2/3 lg:w-3/4">
          <div class="mb-4 flex justify-between items-center">
            <h2 class="text-xl font-bold">Creators ({{ filteredCreators.length }})</h2>
            <div class="flex gap-2">
              <select v-model="sortBy" class="select w-40">
                <option value="matchScore">Match Score</option>
                <option value="followers">Followers</option>
                <option value="engagementRate">Engagement</option>
              </select>
              <button @click="toggleSortDirection" class="btn btn-outline">
                {{ sortDirection === 'desc' ? '↓' : '↑' }}
              </button>
            </div>
          </div>

          <!-- Creator cards grid -->
          <div class="flex flex-wrap gap-6">
            <div
              v-for="creator in sortedCreators"
              :key="creator.id"
              class="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <CreatorCard :creator="creator" />
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="sortedCreators.length === 0" class="text-center p-12 border rounded-lg">
            <p class="text-lg text-gray-500">No creators match your filters</p>
            <button @click="resetFilters" class="btn btn-secondary mt-4">Reset Filters</button>
          </div>
        </div>
      </div>
    </main>

    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>Creator Match Dashboard</p>
    </footer>
  </div>
</template>
