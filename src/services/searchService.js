class SearchService {
  constructor() {
    this.DICTIONARY_CACHE_KEY = 'dictionary_cache';
    this.SEARCH_HISTORY_KEY = 'search_history';
    this.CACHE_EXPIRY_DAYS = 365;
    this.MAX_HISTORY_ITEMS = 500;
  }

  /**
   * Our standardized dictionary schema:
   * {
   *   word: string,
   *   pronunciation: {
   *     text: string,
   *     audio?: string
   *   },
   *   meanings: [
   *     {
   *       partOfSpeech: string,
   *       definitions: [
   *         {
   *           definition: string,
   *           example?: string,
   *           synonyms?: string[],
   *           antonyms?: string[]
   *         }
   *       ]
   *     }
   *   ],
   *   source: string, // 'wordsapi' | 'dictionaryapi'
   *   timestamp: number
   * }
   */

  // Transform Words API data to our schema
  transformWordsAPIData(data) {
    const meanings = new Map();

    // Group definitions by part of speech
    if (data.results && Array.isArray(data.results)) {
      data.results.forEach((result) => {
        const partOfSpeech = result.partOfSpeech || 'unknown';

        if (!meanings.has(partOfSpeech)) {
          meanings.set(partOfSpeech, {
            partOfSpeech,
            definitions: [],
          });
        }

        const definition = {
          definition: result.definition,
        };

        if (result.examples && result.examples.length > 0) {
          definition.example = result.examples[0];
        }

        if (result.synonyms && result.synonyms.length > 0) {
          definition.synonyms = result.synonyms;
        }

        if (result.antonyms && result.antonyms.length > 0) {
          definition.antonyms = result.antonyms;
        }

        meanings.get(partOfSpeech).definitions.push(definition);
      });
    }

    return {
      word: data.word,
      pronunciation: data.pronunciation
        ? {
            text: data.pronunciation.all,
          }
        : null,
      meanings: Array.from(meanings.values()),
      source: 'wordsapi',
      timestamp: Date.now(),
    };
  }

  // Transform Dictionary API data to our schema
  transformDictionaryAPIData(data) {
    const meanings = [];

    if (data.meanings && Array.isArray(data.meanings)) {
      data.meanings.forEach((meaning) => {
        const meaningObj = {
          partOfSpeech: meaning.partOfSpeech,
          definitions: [],
        };

        if (meaning.definitions && Array.isArray(meaning.definitions)) {
          meaning.definitions.forEach((def) => {
            const definition = {
              definition: def.definition,
            };

            if (def.example) {
              definition.example = def.example;
            }

            if (def.synonyms && def.synonyms.length > 0) {
              definition.synonyms = def.synonyms;
            }

            if (def.antonyms && def.antonyms.length > 0) {
              definition.antonyms = def.antonyms;
            }

            meaningObj.definitions.push(definition);
          });
        }

        meanings.push(meaningObj);
      });
    }

    // Extract pronunciation
    let pronunciation = null;
    if (
      data.phonetics &&
      Array.isArray(data.phonetics) &&
      data.phonetics.length > 0
    ) {
      const phonetic = data.phonetics.find((p) => p.text) || data.phonetics[0];
      if (phonetic) {
        pronunciation = {
          text: phonetic.text,
        };
        if (phonetic.audio) {
          pronunciation.audio = phonetic.audio;
        }
      }
    }

    return {
      word: data.word,
      pronunciation,
      meanings,
      source: 'dictionaryapi',
      timestamp: Date.now(),
    };
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
        historyEntry.dictionaryResult = result;
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

  // Search Words API (RapidAPI)
  async searchWordsAPI(word) {
    const trimmedWord = word.trim();

    if (!trimmedWord) {
      throw new Error('Please enter a word to search');
    }

    try {
      const response = await fetch(
        `https://wordsapiv1.p.rapidapi.com/words/${encodeURIComponent(
          trimmedWord
        )}/`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Host': import.meta.env.VITE_RAPIDAPI_HOST,
            'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundError(
            `"${trimmedWord}" could not be found in Words API.`
          );
        }
        throw new Error(`Words API HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.word) {
        throw new NotFoundError(
          `"${trimmedWord}" could not be found in Words API.`
        );
      }

      return this.transformWordsAPIData(data);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Unable to fetch from Words API: ' + error.message);
    }
  }

  // Search Dictionary API (Free API)
  async searchDictionaryAPI(word) {
    const trimmedWord = word.trim();

    if (!trimmedWord) {
      throw new Error('Please enter a word to search');
    }

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          trimmedWord
        )}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundError(
            `"${trimmedWord}" could not be found in Dictionary API.`
          );
        }
        throw new Error(
          `Dictionary API HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new NotFoundError(
          `"${trimmedWord}" could not be found in Dictionary API.`
        );
      }

      return this.transformDictionaryAPIData(data[0]);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new Error('Unable to fetch from Dictionary API: ' + error.message);
    }
  }

  // Main search function using Dictionary API as primary
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
      // Use Dictionary API as primary source
      const standardData = await this.searchDictionaryAPI(trimmedWord);

      // Cache in our standard format
      this.cacheWord(trimmedWord, standardData);

      // Add to history
      this.addToHistory(trimmedWord, standardData);

      return standardData;
    } catch (error) {
      // Add failed search to history
      this.addToHistory(trimmedWord, null);

      // If it fails, throw the error
      if (error instanceof NotFoundError) {
        throw new NotFoundError(
          `"${trimmedWord}" could not be found in the dictionary.`
        );
      }

      // For network errors, throw a general error
      throw new Error(
        'Unable to fetch word definition. Please check your internet connection and try again.'
      );
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
