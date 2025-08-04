# Lexicon - Minimalist Dictionary Extension

A beautiful, fast, and intelligent dictionary extension with smart caching and comprehensive word information.

## ✨ Features

### 🔍 **Smart Dictionary Search**

- **Primary API**: Uses [Words API](https://rapidapi.com/dpventures/api/wordsapi) for comprehensive word definitions and rich linguistic data
- **Intelligent Caching**: Stores searched words locally for 1 year - no repeat API calls
- **Rich Word Data**: Provides definitions, synonyms, antonyms, examples, pronunciation, syllables, and frequency
- **Hybrid Autocomplete**: Combines local word list (15,000+ words) with Datamuse API for instant + comprehensive suggestions
- **Local Word List**: Uses SCOWL (Spell Checker Oriented Word Lists) for offline suggestions
- **Multiple Pronunciations**: Displays pronunciation guides for different dialects

### 🌟 **Word of the Day**

- **Primary Source**: [api.wotd.site](https://api.wotd.site) with Wordnik backup
- **Daily Caching**: Fetches once per day, cached in localStorage
- **Auto-cleanup**: Removes old cache entries automatically
- **Fallback System**: Beautiful curated words if APIs are unavailable

### 📚 **Comprehensive Word Information**

- **Multiple Definitions**: Shows all definitions organized by part of speech
- **Rich Examples**: Multiple usage examples for better understanding
- **Synonyms & Antonyms**: Comprehensive lists for vocabulary building
- **Word Frequency**: Indicates how commonly used a word is
- **Syllable Breakdown**: Shows syllable count and division
- **Pronunciation Guide**: Multiple pronunciation variants

### 💾 **Smart Caching Strategy**

- **Dictionary Cache**: 1-year expiry, size-limited (100 entries max)
- **Word of the Day Cache**: Daily refresh, keeps last 7 days
- **Search History**: Tracks up to 500 recent searches with full data
- **Auto-cleanup**: Removes expired entries automatically

### 🎨 **Minimalist UI**

- **Compact Design**: Clean, space-efficient layout
- **Cyberpunk Theme**: Beautiful gradient backgrounds with subtle animations
- **Responsive**: Works on all screen sizes
- **Accessibility**: Keyboard navigation and screen reader friendly

### 📊 **Advanced Features**

- **Full-Page Search History**: Dedicated history page with search and filtering
- **Route-Based Navigation**: Clean navigation between main search and history
- **Error Handling**: Graceful fallbacks for network issues
- **Performance**: Instant results for cached words

## 🛠️ Development

### Prerequisites

- Node.js (v18+)
- npm
- Words API key from [RapidAPI](https://rapidapi.com/dpventures/api/wordsapi)

### Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd dictionary-extension
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your Words API key
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
VITE_RAPIDAPI_HOST=wordsapiv1.p.rapidapi.com
```

4. **Get your Words API key**

   - Visit [Words API on RapidAPI](https://rapidapi.com/dpventures/api/wordsapi)
   - Sign up for a free account
   - Subscribe to the free tier (500 requests/month)
   - Copy your API key to the `.env` file

5. **Start development server**

```bash
npm run dev
```

6. **Build for production**

```bash
npm run build
```

5. **Enter your API key** when prompted - it will be saved securely in your browser

**Note**: The API key is stored locally in your browser and never sent to our servers.

### Browser Extension Installation

1. Build the project: `npm run build`
2. Open Chrome/Edge and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder

## 📁 Project Structure

```
src/
├── App.jsx           # Main app component with all functionality
├── main.jsx          # React entry point
└── styles.css        # Custom styles

public/
├── manifest.json     # Extension manifest
└── logo.png         # Extension icon

dist/                 # Built extension (after npm run build)
├── index.html
├── popup.js
├── popup.css
├── manifest.json
└── logo.png
```

## 🎨 Design Features

- **Glassmorphism**: Translucent cards with backdrop blur
- **Animated Background**: Floating particles and gradient mesh
- **Neon Accents**: Cyberpunk-inspired color scheme
- **Smooth Animations**: Hover effects and transitions
- **Responsive**: Optimized for extension popup size (384px width)

## 🔧 Tech Stack

- **React 18**: Modern component-based UI
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling (via CDN)
- **Browser Extension API**: Manifest V3 compatible

## 📝 Original Implementation

This React version is a faithful port of the original vanilla JavaScript implementation, preserving all functionality and styling while adding React's component structure and state management benefits.

## 🎯 Future Features

Ready for additional features like:

- Autocomplete suggestions
- Search history
- Context menu integration
- Google authentication + sync
- Achievements system
- Multi-word phrase support
- AI-powered definitions
