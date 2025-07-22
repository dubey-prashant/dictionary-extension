import { GoogleGenerativeAI } from '@google/generative-ai';

class SearchService {
  constructor() {
    this.DICTIONARY_CACHE_KEY = 'dictionary_cache';
    this.SEARCH_HISTORY_KEY = 'search_history';
    this.CACHE_EXPIRY_DAYS = 365;
    this.MAX_HISTORY_ITEMS = 500;
  }

  // Get cached dictionary result
  getCachedWord(word) {
    try {
      const cache = JSON.parse(
        localStorage.getItem(this.DICTIONARY_CACHE_KEY) || '{}'
      );
      const cached = cache[word.toLowerCase()];

      if (!cached) return null;

      // Check if cache is expired
      const now = Date.now();
      const cacheAge = now - cached.timestamp;
      const expiryTime = this.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

      if (cacheAge > expiryTime) {
        // Remove expired entry
        delete cache[word.toLowerCase()];
        localStorage.setItem(this.DICTIONARY_CACHE_KEY, JSON.stringify(cache));
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Error reading dictionary cache:', error);
      return null;
    }
  }

  // Cache dictionary result
  cacheWord(word, data) {
    try {
      const cache = JSON.parse(
        localStorage.getItem(this.DICTIONARY_CACHE_KEY) || '{}'
      );
      cache[word.toLowerCase()] = {
        data,
        timestamp: Date.now(),
      };

      // Limit cache size (keep only last 100 entries)
      const entries = Object.entries(cache);
      if (entries.length > 100) {
        // Sort by timestamp and keep only the 80 most recent
        const sorted = entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
        const trimmed = Object.fromEntries(sorted.slice(0, 80));
        localStorage.setItem(
          this.DICTIONARY_CACHE_KEY,
          JSON.stringify(trimmed)
        );
      } else {
        localStorage.setItem(this.DICTIONARY_CACHE_KEY, JSON.stringify(cache));
      }
    } catch (error) {
      console.error('Error caching dictionary result:', error);
    }
  }

  // Add to search history with full result data
  addToHistory(word, result) {
    try {
      let history = JSON.parse(
        localStorage.getItem(this.SEARCH_HISTORY_KEY) || '[]'
      );

      // Remove existing entry if present
      history = history.filter(
        (item) => item.word.toLowerCase() !== word.toLowerCase()
      );

      // Add new entry at the beginning with full result data
      const historyEntry = {
        word: word.toLowerCase(),
        displayWord: word,
        timestamp: Date.now(),
        found: !!result,
      };

      // Store full result data if available
      if (result) {
        if (result.isAIResult) {
          historyEntry.aiResult = result;
        } else {
          historyEntry.dictionaryResult = result;
        }
      }

      history.unshift(historyEntry);

      // Limit history size
      if (history.length > this.MAX_HISTORY_ITEMS) {
        history = history.slice(0, this.MAX_HISTORY_ITEMS);
      }

      localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error updating search history:', error);
    }
  }

  // Get search history
  getSearchHistory() {
    try {
      return JSON.parse(localStorage.getItem(this.SEARCH_HISTORY_KEY) || '[]');
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  // Search dictionary with caching
  async searchDictionary(word) {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      throw new Error('Please enter a word to search');
    }

    // Check cache first
    const cached = this.getCachedWord(trimmedWord);
    if (cached) {
      this.addToHistory(trimmedWord, cached);
      return cached;
    }

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          trimmedWord
        )}`
      );

      const data = await response.json();

      if (data.title || !Array.isArray(data)) {
        // Word not found
        this.addToHistory(trimmedWord, null);
        throw new NotFoundError(
          `"${trimmedWord}" could not be found in the dictionary.`
        );
      }

      // Cache and save to history
      this.cacheWord(trimmedWord, data);
      this.addToHistory(trimmedWord, data);

      return data;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      // Network or other error
      this.addToHistory(trimmedWord, null);
      throw new Error(
        'Unable to fetch word definition. Please check your internet connection and try again.'
      );
    }
  }

  // Search with Gemini AI (fallback)
  async searchWithAI(word, apiKey) {
    if (!apiKey) {
      throw new Error('API key is required for AI search');
    }

    const trimmedWord = word.trim();
    if (!trimmedWord) {
      throw new Error('Please enter a word to search');
    }

    try {
      // Initialize the Gemini AI client
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Define the word or phrase "${trimmedWord}" in a comprehensive way. Include:
1. Definition(s) with part of speech
2. Example sentence(s)
3. Etymology if relevant
4. Synonyms if applicable

Format your response as a clear, well-structured explanation suitable for a dictionary application.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      if (!aiResponse) {
        throw new Error('No response from AI service');
      }

      // Format AI response to match our expected structure
      const aiResult = {
        isAIResult: true,
        word: trimmedWord,
        aiDefinition: aiResponse,
        timestamp: Date.now(),
      };

      // Add to history
      this.addToHistory(trimmedWord, aiResult);

      return aiResult;
    } catch (error) {
      this.addToHistory(trimmedWord, null);

      // Handle specific Gemini API errors
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error.message.includes('RATE_LIMIT_EXCEEDED')) {
        throw new Error(
          'Rate limit exceeded. Please wait a moment and try again.'
        );
      }

      throw new Error(`AI search failed: ${error.message}`);
    }
  }

  // Clean up old cache entries
  cleanupCache() {
    try {
      const cache = JSON.parse(
        localStorage.getItem(this.DICTIONARY_CACHE_KEY) || '{}'
      );
      const now = Date.now();
      const expiryTime = this.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

      let cleaned = false;
      for (const word in cache) {
        const cacheAge = now - cache[word].timestamp;
        if (cacheAge > expiryTime) {
          delete cache[word];
          cleaned = true;
        }
      }

      if (cleaned) {
        localStorage.setItem(this.DICTIONARY_CACHE_KEY, JSON.stringify(cache));
      }
    } catch (error) {
      console.error('Error cleaning cache:', error);
    }
  }
}

// Custom error for word not found
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Export singleton instance
export const searchService = new SearchService();
export { NotFoundError };
