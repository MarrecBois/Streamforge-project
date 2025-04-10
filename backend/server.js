const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load creator data
const creatorsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/creators.json'), 'utf8')
);

// GET all creators
app.get('/api/creators', (req, res) => {
  res.json(creatorsData);
});

// GET filtered creators
app.get('/api/creators/filter', (req, res) => {
  // Implement filtering logic based on query parameters
  let filteredCreators = [...creatorsData];
  const { platforms, categories, followerRange, engagementRateMin, regions, verifiedOnly } = req.query;
  
  // Filter by platform
  if (platforms && platforms.length > 0) {
    const platformArray = Array.isArray(platforms) ? platforms : [platforms];
    filteredCreators = filteredCreators.filter(creator => 
      platformArray.includes(creator.platform)
    );
  }
  
  // Filter by content categories
  if (categories && categories.length > 0) {
    const categoryArray = Array.isArray(categories) ? categories : [categories];
    filteredCreators = filteredCreators.filter(creator => 
      creator.contentCategories.some(category => categoryArray.includes(category))
    );
  }
  
  // Filter by follower range
  if (followerRange) {
    const [min, max] = Array.isArray(followerRange) ? followerRange : [parseInt(followerRange[0]), parseInt(followerRange[1])];
    filteredCreators = filteredCreators.filter(creator => 
      creator.followers >= min && creator.followers <= max
    );
  }
  
  // Filter by minimum engagement rate
  if (engagementRateMin) {
    const minRate = parseFloat(engagementRateMin);
    filteredCreators = filteredCreators.filter(creator => 
      creator.engagementRate >= minRate
    );
  }
  
  // Filter by regions
  if (regions && regions.length > 0) {
    const regionArray = Array.isArray(regions) ? regions : [regions];
    filteredCreators = filteredCreators.filter(creator => 
      regionArray.includes(creator.location)
    );
  }
  
  // Filter by verified status
  if (verifiedOnly === 'true') {
    filteredCreators = filteredCreators.filter(creator => creator.verified);
  }
  
  res.json(filteredCreators);
});

// POST calculate match scores
app.post('/api/match', (req, res) => {
  // Implementation of the match score calculation algorithm
  const campaignSettings = req.body;
  
  // Calculate match scores for all creators
  const creatorsWithScores = creatorsData.map(creator => {
    const matchScore = calculateMatchScore(creator, campaignSettings);
    return {
      ...creator,
      matchScore
    };
  });
  
  res.json(creatorsWithScores);
});

// Match score calculation algorithm
function calculateMatchScore(creator, campaignSettings) {
  // Have different weights for each factor based on the campaign objective. Default is 'Brand Awareness'
  const objective = campaignSettings.campaignObjective ?? 'Brand Awareness';

  const weightsByObjective = {
    'Brand Awareness': {
      budgetFit: 0.10,
      contentRelevance: 0.20,
      audienceFit: 0.20,
      engagementQuality: 0.15,
      previousPerformance: 0.10,
      regionFit: 0.15,
      contentFormatRelevance: 0.10
    },
    'Product Launch': {
      budgetFit: 0.15,
      contentRelevance: 0.25,
      audienceFit: 0.15,
      engagementQuality: 0.15,
      previousPerformance: 0.15,
      regionFit: 0.10,
      contentFormatRelevance: 0.05
    },
    'Community Engagement': {
      budgetFit: 0.10,
      contentRelevance: 0.20,
      audienceFit: 0.25,
      engagementQuality: 0.25,
      previousPerformance: 0.10,
      regionFit: 0.05,
      contentFormatRelevance: 0.05
    },
    'Conversions & Sales': {
      budgetFit: 0.20,
      contentRelevance: 0.20,
      audienceFit: 0.20,
      engagementQuality: 0.15,
      previousPerformance: 0.15,
      regionFit: 0.05,
      contentFormatRelevance: 0.05
    }
  };

  const weights = weightsByObjective[objective];

  // Calculate individual component scores
  const budgetFitScore = calculateBudgetFit(creator, campaignSettings);
  const contentRelevanceScore = calculateContentRelevance(creator, campaignSettings);
  const audienceFitScore = calculateAudienceFit(creator, campaignSettings);
  const engagementQualityScore = calculateEngagementQuality(creator);
  const previousPerformanceScore = normalizePreviousPerformance(creator);
  const regionFitScore = calculateRegionFit(creator, campaignSettings);
  const formatRelevanceScore = calculateFormatRelevance(creator, campaignSettings);
  
  // Combine scores using weights
  const matchScore = (
    (budgetFitScore * weights.budgetFit) +
    (contentRelevanceScore * weights.contentRelevance) +
    (audienceFitScore * weights.audienceFit) +
    (engagementQualityScore * weights.engagementQuality) +
    (previousPerformanceScore * weights.previousPerformance) +
    (regionFitScore * weights.regionFit) +
    (formatRelevanceScore * weights.contentFormatRelevance)
  ) * 100;
  
  // Ensure score is between 0-100
  return Math.min(100, Math.max(0, Math.round(matchScore)));
}

// Calculate how well creator's rate fits within campaign budget
function calculateBudgetFit(creator, campaignSettings) {
  if (!campaignSettings.budget || !Array.isArray(campaignSettings.budget) || campaignSettings.budget.length !== 2) {
    return 0.5; // Default score if budget isn't properly specified
  }
  
  const [minBudget, maxBudget] = campaignSettings.budget;
  const creatorRate = creator.hourlyRate;
  
  if (creatorRate < minBudget) {
    // Below budget - full score
    return 1;
  } else if (creatorRate <= maxBudget) {
    // Within budget range - linear decay from 1 -> 0.5 as rate goes from minBudget to maxBudget
    const range = maxBudget - minBudget;
    if (range === 0) return 0.5; // Avoid dividing by 0
    const progress = (creatorRate - minBudget) / range;
    return 1.0 - (0.5 * progress);  // If at the top end of the budget, the score will be 0.5
  } else {
    // Over budget - Decrease score as you go more over budget from 0.5 -> 0
    const amtOver = creatorRate - maxBudget;
    const decrease = amtOver / maxBudget;
    return Math.max(0, 0.5 - decrease);
  }
}

// Calculate how relevant creator's content is to the campaign
function calculateContentRelevance(creator, campaignSettings) {
  if (!campaignSettings.targetGenres || !Array.isArray(campaignSettings.targetGenres) || campaignSettings.targetGenres.length === 0) {
    return 0.5; // Default score if target genres aren't specified
  }
  
  const targetGenres = campaignSettings.targetGenres;
  const creatorCategories = creator.contentCategories;
  
  // Count matching categories
  const matchingCategories = creatorCategories.filter(category => 
    targetGenres.includes(category)
  ).length;
  
  if (creatorCategories.length === 0) return 0;
  
  // Calculate relevance score based on percentage of matching categories out of the target categories desired
  return matchingCategories / targetGenres.length;
}

// Calculate audience demographic fit
function calculateAudienceFit(creator, campaignSettings) {
  if (!creator.audienceDemographics || 
      !campaignSettings.targetAgeGroups || 
      !campaignSettings.targetGenders) {
    return 0.5; // Default score if demographics aren't specified
  }
  
  const targetAgeGroups = campaignSettings.targetAgeGroups;
  const targetGenders = campaignSettings.targetGenders;
  
  // Skip if no target demographics selected
  if (targetAgeGroups.length === 0 && targetGenders.length === 0) {
    return 0.5;
  }
  
  let ageScore = 0.5;
  let genderScore = 0.5;
  
  // Calculate age group match
  if (targetAgeGroups.length > 0) {
    const creatorAgeGroups = creator.audienceDemographics.age;
    let targetAgePercentage = 0;
    
    // Sum up the percentages of target age groups
    targetAgeGroups.forEach(ageGroup => {
      if (creatorAgeGroups[ageGroup]) {
        targetAgePercentage += creatorAgeGroups[ageGroup];
      }
    });
    
    ageScore = targetAgePercentage / 100;
  }
  
  // Calculate gender match
  if (targetGenders.length > 0) {
    const creatorGenders = creator.audienceDemographics.gender;
    let targetGenderPercentage = 0;
    
    // Sum up the percentages of target genders
    targetGenders.forEach(gender => {
      if (creatorGenders[gender]) {
        targetGenderPercentage += creatorGenders[gender];
      }
    });
    
    genderScore = targetGenderPercentage / 100;
  }
  
  // Average age and gender scores for overall demographic match (70% age and 30% gender)
  return (ageScore * 0.7) + (genderScore * 0.3);
}

// Calculate engagement quality score
function calculateEngagementQuality(creator) {
  // Normalize engagement rate to a 0-1 scale (considering 15% as excellent)
  // Use a log scale so going from 1% - 5% engagement is worth more than goin from 11% -> 15% engagement
  const cappedEngagement = Math.min(creator.engagementRate, 15);
  const normalizedEngagement = Math.log(1 + cappedEngagement) / Math.log(16);
  
  // Normalize follower count to a 0-1 scale (considering 1M as maximum, so all big creators will get 1000000)
  const normalizedFollowers = Math.min(1, creator.followers / 1000000);
  
  // Engagement quality considers both metrics, with emphasis on engagement rate
  return (normalizedEngagement * 0.7) + (normalizedFollowers * 0.3);
}

// Normalize previous performance score
function normalizePreviousPerformance(creator) {
  // Convert campaign performance (0-100) to a 0-1 scale
  return creator.previousCampaignPerformance / 100;
}

// Calculate region match
function calculateRegionFit(creator, campaignSettings) {
  if (!campaignSettings.targetRegions ||
    !Array.isArray(campaignSettings.targetRegions) ||
    campaignSettings.targetRegions.length === 0
  ) {
    return 0.5; // Default score if no target regions specified
  }

  // Map each sub region to its major region
  const regionMap = {
    "US-West": "US",
    "US-East": "US",
    "US-Central": "US",
    "US-South": "US",
    "EU-Central": "EU",
    "EU-West": "EU",
    "EU-North": "EU",
    "EU-South": "EU",
    "APAC": "APAC"
  };

  const creatorRegion = regionMap[creator.location];
  const match = campaignSettings.targetRegions.includes(creatorRegion);
  return match ? 1 : 0;
}


// Calculate content format relevance match 
function calculateFormatRelevance(creator, campaignSettings) {
  if (!campaignSettings.targetFormats ||
    !Array.isArray(campaignSettings.targetFormats) ||
    campaignSettings.targetFormats.length === 0
  ) {
    return 0.5; // Default score if no target formats specified
  }

  // Different target format groups contain sub formats for creator content
  const formatGroups = {
    "Short-form": [
      "Short Clips", "Quick Tips", "Glitch Demos", "Short Speedruns",
      "Reactions", "Reaction Content", "Comedy Skits", "Game Shows", "Challenges"
    ],
    "Live Content": [
      "Live Gameplay", "Pro Matches", "Relaxing Streams",
      "Story Playthroughs", "Let's Play", "First Impressions"
    ],
    "Educational": [
      "Tutorials", "Strategy Guides", "Coaching", "Meta Analysis",
      "VOD Reviews", "Character Builds", "Weapon Analysis", "Devlogs", "Tech Demos"
    ],
    "Cinematic": [
      "Documentaries", "Retrospectives", "Interviews",
      "Reviews", "Lore Discussions", "Analysis", "Collections"
    ],
    "Entertainment": [
      "Reaction Content", "Comedy Skits", "Game Shows", "Variety", "Just Chatting"
    ]
  };

  const creatorGroups = new Set();

  for (const [group, formats] of Object.entries(formatGroups)) {
    if (creator.contentFormats.some(format => formats.includes(format))) {
      creatorGroups.add(group);
    }
  }

  const targetFormats = campaignSettings.targetFormats;

  // Count matching format groups
  const matchingGroups = targetFormats.filter(format =>
    creatorGroups.has(format)
  );
  
  // Return percentage of target formats that the creator has
  return matchingGroups.length / campaignSettings.targetFormats.length;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});