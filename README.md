# Lexicon - Dictionary Extension (React Version)

A beautiful, futuristic dictionary browser extension built with React, featuring a sci-fi cyberpunk glassmorphism design.

## 🚀 Features

- **Beautiful UI**: Sci-fi cyberpunk design with glassmorphism effects
- **Fast Lookups**: Instant word definitions, examples, and pronunciations
- **Audio Pronunciation**: Click speaker icon to hear word pronunciation
- **Compact Design**: Space-efficient with expandable definitions
- **Modern Tech**: Built with React + Vite + Tailwind CSS

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
