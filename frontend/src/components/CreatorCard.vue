<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  creator: {
    type: Object,
    required: true
  }
});



//Implement computed properties and helper functions to format data
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Compute values to be displayed on the creator card
const matchScore = computed(() => props.creator.matchScore ?? 0);
const matchBarWidth = computed(() => `${Math.min(matchScore.value, 100)}%`);

// Change the colour of the match score bar based on how 'good' the score is
const matchScoreColour = computed(() => {
  if (matchScore.value >= 60) return "green";
  if (matchScore.value >= 40) return "yellow";
  return 'red';
});

const matchBarClass = computed (() => {
  const colourMap = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-300',
    red: 'bg-red-500'
  };

  return colourMap[matchScoreColour.value];
});

// Compute an icon to show the platform the creator uses
const platformIcon = computed(() => {
  const platform = props.creator.platform.toLowerCase();
  return `/platform-icons/${platform}.png`;
});

// Compute the background colour of the card according to the platform
const platformBgClass = computed(() => {
  const platform = props.creator.platform.toLowerCase();
  
  const bgMap = {
    youtube: 'bg-red-200',
    twitch: 'bg-purple-200',
    tiktok: 'bg-neutral-300'
  };

  return bgMap[platform] || 'bg-blue-100'; // if unrecognized platform, put pale blue
});

// Compute the background colour for the content formats
const formatBubbleClass = computed(() => {
  const platform = props.creator.platform.toLowerCase();

  const bubbleMap = {
    youtube: 'bg-red-300',
    twitch: 'bg-purple-300',
    tiktok: 'bg-neutral-400'
  };

  return bubbleMap[platform] || 'bg-blue-200';
});

// Allow creator card to be expanded by clicking on it
const isExpanded = ref(false);

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div class="border rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    :class="platformBgClass"
    @click="toggleExpand"
    >
    <div class="p-4 space-y-3">
      
      <!-- Username + Platform + Expand Icon -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold truncate flex items-center">{{ creator.username }}
        <img 
          v-if="creator.verified"
          src="/verified.png"
          alt="verified"
          class="ml-2 h-4 w-4"
          >
        </h3>
        <div class="flex items-center space-x-2">
          <img
            :src="platformIcon"
            :alt="creator.platform + ' logo'"
            class="h-6 w-6 object-contain rounded-sm"
          >
          <svg
            class="h-4 w-4 transition-transform duration-300"
            :class="{ 'rotate-180': isExpanded }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <!-- Match Score -->
      <div>
        <div class="flex justify-between items-center text-sm font-semibold mb-1">
          <span class="text-base">Match Score: {{ matchScore }}%</span>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded-full">
          <div 
            class="h-2 bg-green-500 rounded-full transition-all duration-300"
            :class="matchBarClass"
            :style="{ width: matchBarWidth }"
          ></div>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="flex justify-between text-sm text-black mt-2">
        <div>
          <span class="block font-medium">{{ formatNumber(creator.followers) }}</span>
          <span class="text-xs text-gray-700">Followers</span>
        </div>
        <div>
          <span class="block font-medium">{{ creator.engagementRate }}%</span>
          <span class="text-xs text-gray-700">Engagement</span>
        </div>
      </div>

      <!-- Content Categories -->
      <div class="mt-3 text-sm text-gray-600 flex flex-wrap gap-1">
        <span 
          v-for="category in creator.contentCategories" 
          :key="category" 
          :class="['bg-gray-100 text-black px-2 py-0.5 rounded-full text-xs', formatBubbleClass]"
        >
          {{ category }}
        </span>
      </div>
    </div>
    <transition
      name="expand"
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-96 opacity-100"
      leave-from-class="max-h-96 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <!-- Expanded Info -->
      <div v-if="isExpanded" 
      :class="['overflow-hidden p-4 text-sm space-y-2', platformBgClass]">
        <p><strong>Region:</strong> {{ creator.location }}</p>
        <p><strong>Average Viewers:</strong> {{ formatNumber(creator.avgViewers) }}</p>
        <p><strong>Hourly Rate:</strong> ${{ creator.hourlyRate }}</p>
        <p><strong>Content Formats:</strong> {{ creator.contentFormats.join(', ') }}</p>
        <p><strong>Sponsorship History:</strong> {{ creator.sponsorshipHistory.join(', ') }}</p>
        <p><strong>Previous Campaign Performance Score:</strong> {{ creator.previousCampaignPerformance }}%</p>
      </div>
    </transition>
  </div>
</template>
