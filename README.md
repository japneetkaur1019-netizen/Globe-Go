# 🌍 GlobeGo — Next-Gen AI Travel Planning Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Lucide](https://img.shields.io/badge/Lucide-Icons-F05032?logo=lucide&logoColor=white)](https://lucide.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **GlobeGo** is an intelligent, Expedia-grade AI travel planning platform designed to craft personalized, end-to-end travel itineraries with dynamic budget optimization, real-time currency conversion, personalized destination matching, and comprehensive travel management dashboards.

---

## ✨ Key Features

### 🧠 Intelligent AI Trip Planner
- **Multi-Mode AI Experience**:
  - **Quick Wizard**: Step-by-step interactive planner with duration, budget, style, and travel party preferences.
  - **Natural Language Chat**: Natural language trip prompt parser (e.g., *"Plan a 5-day adventure in Tokyo under $2,500 for 2 adults"*).
  - **Budget Optimizer**: Automatic expense categorization, overspend warnings, and budget-saving recommendations.
  - **Destination Matcher**: Suggests trending and curated destinations matching climate, vibe, and activities.
  - **Interactive Travel Q&A**: Real-time travel guidance, visa information, packing checklists, and local etiquette.

### 📅 Complete Day-by-Day Itineraries
- Detailed morning, afternoon, and evening schedules with realistic activity durations and local tips.
- Curated recommendations for top-rated hotels, must-try local delicacies, and immersive experiences.
- One-click trip modification, regeneration, export, and bookmarking.

### 💱 Real-Time Multi-Currency Support
- Switch between **INR (₹)**, **USD ($)**, and **EUR (€)** dynamically across the entire application with synchronized exchange rate conversions.

### 📊 Personalized Dashboard & Rewards
- **Saved Trips Management**: View, revisit, modify, and manage past and upcoming itineraries.
- **Travel Stats & Badges**: Gamified achievements (e.g., *Globe Trotter*, *Budget Master*, *Culture Seeker*), mileage tracker, and travel personality analytics.
- **Preference Engine**: Save preferred travel styles (Luxury, Solo, Family, Adventure), climates, and pace.

### 🎨 Expedia-Grade Design System
- **Pure CSS Tokens**: Zero bulky UI library overhead; built with clean custom CSS properties (`var(--...)`).
- **Seamless Light & Dark Mode**: Persistent theme toggle with high-contrast WCAG AA accessibility.
- **Rich Micro-Interactions**: Glassmorphism cards, glowing gradients, interactive hero reels, and animated SVG globes.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation

```bash
# Clone repository
git clone https://github.com/japneetkaur1019-netizen/Globe-Go.git

# Navigate to project directory
cd Globe-Go

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be running at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🗺️ Application Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Home** | Hero search, trending destinations, curated deals, and quick AI preference setup |
| `/ai-planner` | **AI Travel Planner** | Complete AI itinerary builder with multi-mode input, budget math, and recommendations |
| `/dashboard` | **Dashboard** | Saved trips, travel stats, upcoming itineraries, and notifications |
| `/preferences` | **Preferences** | Custom travel persona configuration (style, climate, pace, budget tier) |
| `/stats` | **Stats & Rewards** | Travel achievements, badges, carbon offset tracker, and exploration metrics |

---

## 🧩 Project Structure

```
globe-go/
├── docs/
│   ├── CSS_DESIGN_SYSTEM_REFERENCE.md   # Master CSS design system specifications
│   └── CSS_DESIGN_SYSTEM_REFERENCE.html # Interactive HTML reference guide
├── public/                              # Static public assets
├── src/
│   ├── assets/                          # App logos & icons
│   ├── components/                      # Reusable modular UI components
│   │   ├── AIConversation.jsx           # Natural language conversational AI interface
│   │   ├── AIModeSelector.jsx           # Mode switcher (Quick, Chat, Budget, etc.)
│   │   ├── AIPlannerInput.jsx           # Structured trip input controls
│   │   ├── ActivityRecommendations.jsx  # Activity list cards
│   │   ├── BudgetAdvicePanel.jsx        # Smart budget tips and reallocation
│   │   ├── BudgetBreakdown.jsx          # Cost distribution chart & breakdown
│   │   ├── DynamicHeroReel.jsx          # Hero carousel & trending banners
│   │   ├── FoodRecommendations.jsx      # Culinary and dining recommendations
│   │   ├── Footer.jsx                   # Global footer with quick links & badges
│   │   ├── HotelRecommendations.jsx     # Accommodations cards & ratings
│   │   ├── Itinerary.jsx / Day.jsx      # Day-by-day interactive itinerary
│   │   ├── ModifyTripModal.jsx          # Trip customization modal
│   │   ├── Navbar.jsx                   # Sticky global navigation & currency switcher
│   │   ├── NotificationCenter.jsx       # Real-time toast notifications & alerts
│   │   ├── WorldGlobeBackground.jsx     # Interactive animated SVG globe
│   │   └── ...
│   ├── context/
│   │   └── AppContext.jsx               # Global state with localStorage synchronization
│   ├── data/
│   │   ├── activities.js                # Curated experiences database
│   │   ├── destinations.js              # Destination catalog & metadata
│   │   ├── food.js                      # Local food & restaurant catalog
│   │   ├── hotels.js                    # Hotel listings & amenities catalog
│   │   └── mockAI.js                    # Core AI engine adapter (pluggable with LLMs)
│   ├── pages/
│   │   ├── AITravelPlanner.jsx          # Main AI planning suite
│   │   ├── Dashboard.jsx                # User dashboard & saved trips
│   │   ├── Home.jsx                     # Landing page & exploration hub
│   │   ├── TravelPreferences.jsx        # Travel style & preference manager
│   │   └── TravelStatsAchievements.jsx  # Gamification & rewards page
│   ├── styles/
│   │   └── design-system.css            # Complete design tokens, components & themes
│   ├── utils/
│   │   ├── budgetCalculator.js          # Category cost calculations & conversions
│   │   ├── preferenceEngine.js          # Destination scoring & recommendation logic
│   │   └── tripParser.js                # Natural language prompt parsing engine
│   ├── App.jsx                          # Main routing & layout wrapper
│   ├── index.css                        # Reset, font imports & accessibility utilities
│   └── main.jsx                         # React 19 application entry point
├── package.json
└── vite.config.js
```

---

## 🤖 AI Engine Architecture & Extensibility

GlobeGo is engineered with a **clean adapter pattern**. The AI logic is encapsulated in `src/data/mockAI.js` and utility parsers:

- **`src/utils/tripParser.js`**: Parses free-text prompts for destination, duration, budget limits, currency, and group size.
- **`src/utils/budgetCalculator.js`**: Calculates category budgets (Hotels, Flights, Activities, Food, Misc) and benchmarks against user limits.
- **`src/utils/preferenceEngine.js`**: Scores destinations using weighted preference vectors.
- **`src/data/mockAI.js`**: Generates full structured trip models (`generateTrip()`).

> 💡 **Plugging in Real AI**: To connect OpenAI, Google Gemini, or Anthropic Claude, simply replace the `generateTrip()` implementation in `src/data/mockAI.js` with your API caller. The UI components will seamlessly consume the returned JSON structure without any modifications!

---

## 🎨 Design System & Accessibility

For full details on the color palette, typography hierarchy, button variants, card elevations, and responsive breakpoints, check out:
- 📖 [CSS Design System Reference Markdown](./docs/CSS_DESIGN_SYSTEM_REFERENCE.md)
- 🌐 [Interactive HTML Preview](./docs/CSS_DESIGN_SYSTEM_REFERENCE.html)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
