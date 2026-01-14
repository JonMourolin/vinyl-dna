# DeepCogs - Product Requirements Document

> A design brief for redesigning the DeepCogs vinyl collection analyzer

## Product Overview

**DeepCogs** is a web application that connects to users' Discogs accounts to analyze their vinyl record collections and provide insights about their musical taste. The app helps vinyl collectors understand their collection patterns, compare taste with friends, discover trade opportunities, and find new music recommendations.

**Target Audience:** Vinyl record collectors who use Discogs to catalog their collections.

**Core Value Proposition:** "Discover your musical DNA" - Transform raw collection data into meaningful insights about musical taste and preferences.

---

## Information Architecture

```
DeepCogs
├── Landing/Login Page (unauthenticated)
│
└── Dashboard (authenticated)
    ├── DNA (default view)
    │   ├── Summary Stats
    │   ├── Genre DNA (pie chart)
    │   ├── Era Distribution (bar chart)
    │   ├── Style Breakdown (tag cloud)
    │   ├── Top Labels (ranked list)
    │   └── Oddities & Pressings (stat cards)
    │
    ├── Compare
    │   ├── Friend Search (empty state)
    │   └── Comparison Results
    │       ├── Taste Compatibility Score
    │       ├── Trade Opportunities Summary
    │       ├── Style Comparison (dual bars)
    │       ├── Trade Offers (bidirectional)
    │       └── Albums In Common
    │
    └── Discover
        └── Smart Recommendations
            ├── Style Filter Tabs
            └── Recommendation Cards by Style
```

---

## Page-by-Page Feature Breakdown

### 1. Landing Page (Unauthenticated)

**Purpose:** Onboard new users and authenticate via Discogs OAuth.

**Layout:** Split-screen design
- **Left half:** Hero imagery (lifestyle photo of vinyl setup)
- **Right half:** Authentication content

**Content Elements:**
| Element | Type | Content |
|---------|------|---------|
| Headline | H1 | "Connect your collection" |
| Subheadline | Body text | "Sign in with your Discogs account to analyze your vinyl collection and discover your musical DNA." |
| Primary CTA | Button | "Connect with Discogs" (with icon) |
| Permissions list | Checklist | View your collection, View your wantlist, Read your profile info |
| Secondary link | Text link | "Don't have a Discogs account? Create one free" |
| Privacy notice | Footer text | "Your data stays private. We never modify your collection. Data via Discogs. Not affiliated." |

**Design Notes:**
- The permission checklist uses checkmark icons with amber/orange color
- Primary button is dark/black with high contrast
- Privacy messaging builds trust by emphasizing read-only access

---

### 2. Global Navigation (Authenticated State)

**Sidebar Navigation - Fixed Left**

| Component | Description |
|-----------|-------------|
| Logo | "DeepCogs" with "D" icon badge |
| User Profile | Avatar image, username, collection count (e.g., "403 releases"), refresh button |
| Nav Section Label | "NAVIGATION" (uppercase, muted) |
| Nav Item: DNA | Icon + "DNA" - collection analysis |
| Nav Item: Compare | Icon + "Compare" - friend comparison |
| Nav Item: Discover | Icon + "Discover" - recommendations |
| Sign Out | Bottom-positioned, icon + "Sign out" |

**Active State:** Selected nav item has highlighted background
**Icons:** Simple line icons for each nav item

---

### 3. DNA Page (Collection Analysis)

**Purpose:** Visualize and analyze the user's collection patterns.

**Page Header:**
- Title: "Collection DNA"
- Subtitle: "Analyze the patterns in your vinyl collection"

#### 3.1 Summary Stats Row
Four stat cards displayed horizontally:

| Stat | Format | Example |
|------|--------|---------|
| Total Releases | Number | "403" |
| Top Genre | Genre + percentage | "Electronic 76%" |
| Top Decade | Decade + percentage | "2010s 40%" |
| Top Label | Label name + count | "Warp Records 11 releases" |

**Design:** Cards with subtle borders, icon indicators, percentage values in accent color

#### 3.2 Genre DNA
**Visualization:** Donut/pie chart
**Data:** Genre distribution with percentages
**Display:** Labels positioned around chart with percentage values
**Example genres:** Electronic, Funk/Soul, Rock, Jazz, Hip Hop, Folk/World/Country, Pop, Latin

#### 3.3 Era Distribution
**Visualization:** Horizontal bar chart
**Data:** Release counts by decade
**Y-axis:** Decades (1970s, 1980s, 1990s, 2000s, 2010s, 2020s)
**X-axis:** Count scale (0 to max)
**Design:** Single color bars (amber/orange), decade labels on left

#### 3.4 Style Breakdown
**Visualization:** Tag cloud / pill chips
**Data:** Sub-genres with counts
**Display:** Color-coded tags, each showing style name and count in parentheses
**Sorting:** By count, descending
**Example:** "House (104)", "Deep House (68)", "Disco (59)"

**Color System:** Each style tag has a distinct color for visual variety

#### 3.5 Top Labels
**Visualization:** Horizontal bar chart with labels
**Data:** Record label names with release counts
**Display:**
- Label name on left
- Colored bar showing relative count
- "X releases" text on right
- Each label has a unique bar color

**Example labels:** Warp Records, Columbia, Music On Vinyl, Sony Music, Maverick, Timeisnow, Virgin

#### 3.6 Oddities & Pressings
**Visualization:** Row of stat cards
**Data:** Pressing type breakdown
**Categories:**
| Type | Description | Color |
|------|-------------|-------|
| Test Pressings | Pre-release test copies | Teal |
| Promos | Promotional copies | Orange |
| Limited | Limited edition releases | Purple |
| Originals | Original pressings | Green |
| Represses | Reissued pressings | Red |

**Design:** Cards with large colored numbers, label beneath

---

### 4. Compare Page

**Purpose:** Compare collections with other Discogs users and find trade opportunities.

**Page Header:**
- Title: "Compare Collections"
- Subtitle: "Find overlaps and trade opportunities with friends"

#### 4.1 Friend Search (Empty State)
**Card Component:**
- Icon: People/group icon
- Title: "Compare & Trade with a Friend"
- Description: "Enter a Discogs username to compare collections and find trade opportunities."
- Warning note: "Note: Their collection and wantlist must be public." (amber/orange text)
- Input field: Placeholder "Enter Discogs username"
- Action button: "Compare & Find Trades"

#### 4.2 Comparison Results

##### Taste Compatibility Card
**Layout:** Large featured card
**Content:**
- Large percentage number (e.g., "76%") in accent color
- Label: "Taste Compatibility"
- Explainer section: "How it works" - explains cosine similarity algorithm
- Scale reference:
  - ~90%+: Nearly identical taste
  - ~70%: Similar with different emphasis
  - ~40%: Some overlap, different tastes
  - <20%: Very different collections
- **Biggest shared preferences:** Style list with "X% of match" values
- **Biggest differences:** Style list with "X% vs Y%" comparison

##### Trade Opportunities Card
**Layout:** Summary card
**Content:**
- "Trade Opportunities" title
- Two numbers with bidirectional arrow:
  - "X You can offer"
  - "Y They can offer"
- Numbers in different colors (green vs blue)

##### Style Comparison Section
**Title:** "Style Comparison"
**Subtitle:** "How your style preferences compare (% of collection)"
**Legend:** Color indicators for "You" vs "[Other user]"
**Visualization:** Two-column grid of dual progress bars
**Each row shows:**
- Style name
- Dual progress bar (your % in orange, theirs in gray)
- Percentage values: "X% / Y%"

##### Trade Offers Section
**Two-column layout:**

**Left Column - "You can offer"**
- Green header with count badge
- Subtitle: "Records you have that [user] wants"
- List of release cards

**Right Column - "[User] can offer"**
- Blue header with count badge
- Subtitle: "Records they have that you want"
- List of release cards

**Release Card Component:**
- Album artwork thumbnail (square)
- Title (linked/clickable)
- Artist name
- Year
- Genre tag/pill
- Trade action icon

##### Albums In Common Section
**Title:** "Albums In Common (X)"
**Layout:** Grid of album cards
**Card Component:**
- Album artwork thumbnail
- Title
- Artist
- Year

---

### 5. Discover Page

**Purpose:** Surface personalized music recommendations based on collection analysis.

**Page Header:**
- Title: "Discover New Music"
- Subtitle: "Get personalized recommendations based on your taste"
- Action: "Refresh" button (top right)

#### 5.1 Smart Recommendations Section
**Card Header:**
- Title: "Smart Recommendations"
- Subtitle: "Based on similar artists from Last.fm and your collection styles"
- Cache indicator: "(cached)" badge

**Style Filter Tabs:**
- Horizontal scrollable tabs
- Tab options derived from user's top styles
- Special tab: "+Last.fm" for Last.fm-powered recommendations
- Label prefix: "Analyzing styles:"

#### 5.2 Recommendations Grid
**Layout:** Two-column grid, grouped by style

**Column Header:**
- Style name (e.g., "House", "Deep House")
- Seed info: "Based on [Artist 1], [Artist 2] in your collection"

**Recommendation Card Component:**
| Element | Description |
|---------|-------------|
| Album art | Square thumbnail |
| Title | Release title |
| Artist(s) | Artist name(s) |
| Year | Release year |
| Attribution | "Similar to [Artist]" in accent color |
| Actions | Heart icon (add to wantlist), External link icon (open in Discogs) |

---

## UI Component Library

### Color System (Current)
| Usage | Color Family |
|-------|--------------|
| Primary accent | Amber/Orange |
| Success/Offer | Green |
| Info/Receive | Blue |
| Warning/Notes | Amber |
| Charts/Tags | Multi-color palette |
| Background | Dark theme (charcoal/dark gray) |
| Cards | Slightly lighter than background |
| Text | White/light gray hierarchy |

### Typography
| Element | Style |
|---------|-------|
| Page titles | Large, serif font |
| Section headers | Medium, sans-serif, bold |
| Body text | Regular sans-serif |
| Stats/Numbers | Large, bold, often colored |
| Labels | Small, uppercase, muted |

### Common Components
1. **Stat Card** - Bordered card with icon, large number, and label
2. **Release Card** - Album art + metadata + action icons
3. **Progress Bar** - Horizontal bar with label and value
4. **Tag/Pill** - Colored chip with text and optional count
5. **Input + Button** - Form field with adjacent action button
6. **Donut Chart** - Circular chart with center hole and external labels
7. **Bar Chart** - Horizontal bars with axis labels

---

## User Flows

### Flow 1: First-Time User
```
Landing Page → Click "Connect with Discogs" → Discogs OAuth →
Redirect back → DNA page (collection loads) → Explore features
```

### Flow 2: Compare with Friend
```
Compare page → Enter username → Click "Compare & Find Trades" →
View compatibility score → Browse trade opportunities →
See common albums
```

### Flow 3: Discover New Music
```
Discover page → View recommendations by style →
Filter by style tab → Click heart to add to wantlist →
Click external link to view on Discogs
```

### Flow 4: Return Visit
```
Landing Page → Click "Connect with Discogs" →
(Already authorized) → DNA page loads immediately
```

---

## Data Entities

### User Profile
- Username
- Avatar image URL
- Collection count

### Release/Album
- Title
- Artist(s)
- Year
- Album artwork URL
- Genre
- Style(s)
- Label
- Pressing info (test pressing, promo, limited, original, repress)
- Discogs URL

### Collection Stats
- Total releases
- Genre distribution (name → percentage)
- Decade distribution (decade → count)
- Style distribution (name → count)
- Label distribution (name → count)
- Pressing breakdown (type → count)

### Comparison Data
- Taste compatibility percentage
- Shared preferences (style → match percentage)
- Differences (style → user1% vs user2%)
- Trade offers (releases user can offer)
- Trade requests (releases user wants)
- Common albums

### Recommendation
- Release data
- Similar-to artist attribution
- Source style category

---

## Interaction Patterns

### Buttons
- Primary: Dark/black fill, light text
- Secondary: Outlined or ghost style
- With icon: Icon + text combination

### Cards
- Subtle border with rounded corners
- Hover state for interactive cards
- Click areas for navigation

### Charts
- Tooltips on hover (assumed)
- Consistent color palette
- Clear labeling

### Forms
- Placeholder text in inputs
- Adjacent submit buttons
- Validation messaging (inline)

### Navigation
- Active state highlighting
- Icon + text labels
- Persistent sidebar

---

## Technical Constraints for Design

1. **Data Source:** All data comes from Discogs API - design must accommodate varying collection sizes (10 to 10,000+ releases)

2. **Loading States:** Large collections take time to fetch - need loading/progress indicators

3. **Empty States:** Handle cases where user has no releases in certain genres/decades

4. **External Links:** Releases link to Discogs - indicate external navigation

5. **Authentication:** OAuth flow requires redirect - landing page must handle return state

6. **Responsiveness:** Current design shows desktop layout - consider mobile adaptation

7. **Caching:** Recommendations are cached - indicate freshness/staleness to user

---

## Appendix: Screen Inventory

| Screen | State | Key Components |
|--------|-------|----------------|
| Landing | Unauthenticated | Hero image, OAuth CTA, permissions list |
| DNA | Authenticated | Stats row, donut chart, bar charts, tag cloud |
| Compare | Empty | Search form card |
| Compare | Results | Compatibility score, style bars, trade lists, common albums |
| Discover | Loaded | Style tabs, recommendation cards grid |

---
