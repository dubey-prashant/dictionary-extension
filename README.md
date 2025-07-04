# Lexicon - Minimalist Dictionary Extension

A beautiful, fast, and intelligent dictionary extension with smart caching and AI-powered fallback.

## ✨ Features

### 🔍 **Smart Dictionary Search**

- **Primary API**: Uses [dictionaryapi.dev](https://dictionaryapi.dev) for comprehensive word definitions
- **Intelligent Caching**: Stores searched words locally for 7 days - no repeat API calls
- **Auto-complete**: Real-time word suggestions as you type
- **Audio Pronunciation**: Play audio pronunciation when available

### 🌟 **Word of the Day**

- **Primary Source**: [api.wotd.site](https://api.wotd.site) with Wordnik backup
- **Daily Caching**: Fetches once per day, cached in localStorage
- **Auto-cleanup**: Removes old cache entries automatically
- **Fallback System**: Beautiful curated words if APIs are unavailable

### 🤖 **AI-Powered Fallback**

- **Smart Trigger**: When a word isn't found in the dictionary, shows "Search with AI" option
- **Gemini Integration**: Uses Google's Gemini API for comprehensive definitions
- **Secure Storage**: API key stored locally in browser
- **Formatted Results**: AI responses formatted for easy reading

### 💾 **Smart Caching Strategy**

- **Dictionary Cache**: 7-day expiry, size-limited (100 entries max)
- **Word of the Day Cache**: Daily refresh, keeps last 7 days
- **Search History**: Tracks up to 50 recent searches with success status
- **Auto-cleanup**: Removes expired entries automatically

### 🎨 **Minimalist UI**

- **Compact Design**: Clean, space-efficient layout
- **Cyberpunk Theme**: Beautiful gradient backgrounds with subtle animations
- **Responsive**: Works on all screen sizes
- **Accessibility**: Keyboard navigation and screen reader friendly

### 📊 **Advanced Features**

- **Search History**: Quick access to recently searched words
- **Cache Statistics**: View cache usage and clear if needed
- **Error Handling**: Graceful fallbacks for network issues
- **Performance**: Instant results for cached words

## 🛠️ Development

### Prerequisites

- Node.js (v18+)
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

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
