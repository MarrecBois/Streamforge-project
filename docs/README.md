# Streamforge Intern Project Write-Up

## Modifications to Existing Algorithm

### Budget Calculation
Updated the budget fit scoring algorithm to better reflect brand preferences. Previously, creators scored 1 if their rate was anywhere within the budget range. Now, creators score 1 if they’re below budget, and the score linearly decreases to 0.5 as their rate approaches the top of the budget. If a creator exceeds the budget, their score drops below 0.5, reaching 0 as they become increasingly unaffordable. This better rewards cost-efficiency and penalizes overspending.

### Content Relevance
We updated content relevance to focus on how well a creator covers the campaign’s target genres. Previously, creators were penalized for diverse content. Now, the score is based on the proportion of target genres covered, ensuring full credit if campaign requirements are met, even if the creator produces additional content.

### Audience Fit
Demographic fit was updated to use a 70/30 weight split between age and gender. Age is generally more influential in marketing and targeting strategies, so this change better aligns with typical campaign priorities.

### Engagement Quality
Two updates were made:
- The follower normalization cap was lowered to 1 million.
- A logarithmic scale was applied to engagement rate normalization, modeling diminishing returns and rewarding moderate engagement improvements more than marginal ones.

### Previous Performance
This metric remains unchanged. A future improvement could include applying a non-linear transformation (e.g., squaring the score) to increase differentiation between creators.

## Additional Features for Match Score Algorithm

### Region Fit
A new region alignment score rewards creators whose location matches campaign target regions (e.g., US, EU, APAC). Locations are mapped from subregions (e.g., "US-East") to broad categories for simplicity.

### Content Format Relevance
This score evaluates alignment between a creator’s content formats and campaign preferences (e.g., short clips, tutorials). Formats are grouped into categories like "Short-form" or "Educational" to improve usability.

### Weighting by Campaign Objective
Each campaign objective (e.g., Brand Awareness, Conversion) uses a different set of score weights, prioritizing the most relevant factors.

### Customizable Weighting with Sliders
When "Custom Weighting" is selected, users can adjust sliders for each match score factor. On the backend, weights are automatically normalized so they don’t need to manually sum to 1.

## Frontend Notes

### Campaign Settings Structure
The frontend now sends `targetRegions` and `targetFormats` to the backend, allowing for region- and content-specific targeting. The backend maps subregions and formats into broader groups to maintain flexibility without complexity.

## Creator Card Component

### Visual Clarity
Match score is visually emphasized using a labeled percentage and a colored progress bar (green/yellow/red). Background color is set by platform (YouTube, Twitch, TikTok), and platform icons replace plain text.

### Responsive Design
Tailwind utility classes ensure the layout is clean and responsive across screen sizes.

## Expandable Creator Cards
Clicking a creator card reveals additional details: region, average viewers, hourly rate, verified status, and content formats. This supports deeper evaluation without cluttering the initial view.

## UI and Readability Improvements
- Filter sidebar uses collapsible dropdowns to reduce clutter.
- Creator card layouts were refined for consistency.
- Buttons, dropdowns, and visual elements were unified for a more polished look.

## Filter Component

Implemented filters for:
- Platform
- Content category
- Follower range
- Region
- Verified status
- Minimum engagement rate

These are passed to the backend via query parameters and dynamically update the results.

## Future Improvements

### Mobile Optimization Testing
Although responsive Tailwind classes are used, the dashboard needs more extensive testing on physical devices. Improvements may include collapsing sidebars, refining spacing, and enhancing touch interaction support.

### Stakeholder Feedback & Iteration
User testing and stakeholder reviews would help prioritize UI and UX improvements—especially copy, navigation, and filtering workflows.

### Migration to VueShadCN Components
VueShadCN components weren’t used in this project due to late discovery and time constraints. For a production version, I would replace major UI components with VueShadCN alternatives for improved accessibility and design consistency.
