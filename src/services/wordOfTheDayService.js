// Enhanced Word of the Day service with smart daily caching
class WordOfTheDayService {
  constructor() {
    this.WOTD_CACHE_KEY = 'wotd_cache';
    this.FALLBACK_WORDS = [
      {
        word: 'serendipity',
        definition:
          'The occurrence and development of events by chance in a happy or beneficial way',
        example: 'A fortunate stroke of serendipity brought them together',
        partOfSpeech: 'noun',
      },
      {
        word: 'ephemeral',
        definition: 'Lasting for a very short time',
        example: 'The beauty of cherry blossoms is ephemeral',
        partOfSpeech: 'adjective',
      },
      {
        word: 'petrichor',
        definition:
          'A pleasant smell accompanying the first rain after a long period of dry weather',
        example: 'The petrichor after the storm was refreshing',
        partOfSpeech: 'noun',
      },
      {
        word: 'sonder',
        definition:
          'The realization that each passerby has a life as vivid and complex as your own',
        example: 'Walking through the busy street, she felt a moment of sonder',
        partOfSpeech: 'noun',
      },
      {
        word: 'luminous',
        definition: 'Full of or shedding light; bright or shining',
        example: 'The luminous moon lit up the entire garden',
        partOfSpeech: 'adjective',
      },
      {
        word: 'resilience',
        definition:
          'The ability to recover quickly from difficulties; toughness',
        example: 'Her resilience helped her overcome every challenge',
        partOfSpeech: 'noun',
      },
      {
        word: 'wanderlust',
        definition: 'A strong desire to travel and explore the world',
        example: 'His wanderlust led him to visit over thirty countries',
        partOfSpeech: 'noun',
      },
    ];
  }

  // Get today's date string for cache key
  getTodayKey() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(today.getDate()).padStart(2, '0')}`;
  }

  // Get cached WOTD for today
  getCachedWOTD() {
    try {
      const cache = JSON.parse(
        localStorage.getItem(this.WOTD_CACHE_KEY) || '{}'
      );
      const todayKey = this.getTodayKey();
      return cache[todayKey] || null;
    } catch (error) {
      console.error('Error reading WOTD cache:', error);
      return null;
    }
  }

  // Cache WOTD for today
  cacheWOTD(wordData) {
    try {
      const cache = JSON.parse(
        localStorage.getItem(this.WOTD_CACHE_KEY) || '{}'
      );
      const todayKey = this.getTodayKey();

      // Store today's WOTD
      cache[todayKey] = {
        ...wordData,
        cachedAt: Date.now(),
      };

      // Clean up old entries (keep only last 7 days)
      const today = new Date();
      const validKeys = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        validKeys.push(key);
      }

      // Remove old entries
      const cleanCache = {};
      validKeys.forEach((key) => {
        if (cache[key]) {
          cleanCache[key] = cache[key];
        }
      });

      localStorage.setItem(this.WOTD_CACHE_KEY, JSON.stringify(cleanCache));
    } catch (error) {
      console.error('Error caching WOTD:', error);
    }
  }

  // Get fallback word based on day
  getFallbackWord() {
    const today = new Date();
    const dayIndex = today.getDate() % this.FALLBACK_WORDS.length;
    return this.FALLBACK_WORDS[dayIndex];
  }

  // Fetch from api.wotd.site
  async fetchFromWOTDSite() {
    try {
      const response = await fetch('https://api.wotd.site/word');

      if (!response.ok) {
        throw new Error(`WOTD API failed: ${response.status}`);
      }

      const data = await response.json();

      // Format the data to match our structure
      return {
        word: data.word || 'explore',
        definition: data.definition || 'To investigate or travel through',
        example: data.example || `Let's explore new vocabulary together`,
        partOfSpeech: data.part_of_speech || 'verb',
        source: 'wotd.site',
      };
    } catch (error) {
      console.error('Error fetching from WOTD site:', error);
      throw error;
    }
  }

  // Fetch from Wordnik as backup
  async fetchFromWordnik() {
    try {
      const response = await fetch(
        'https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
      );

      if (!response.ok) {
        throw new Error(`Wordnik API failed: ${response.status}`);
      }

      const data = await response.json();

      // Format the data to match our structure
      return {
        word: data.word,
        definition:
          data.definitions?.[0]?.text ||
          data.note ||
          'A fascinating word to explore today',
        example:
          data.examples?.[0]?.text ||
          `Discover how to use "${data.word}" in context`,
        partOfSpeech: data.definitions?.[0]?.partOfSpeech || 'word',
        source: 'wordnik',
      };
    } catch (error) {
      console.error('Error fetching from Wordnik:', error);
      throw error;
    }
  }

  // Main fetch method with fallback chain
  async fetchWordOfTheDay() {
    // First check cache
    const cached = this.getCachedWOTD();
    if (cached) {
      return cached;
    }

    // Try primary API first
    try {
      const wotd = await this.fetchFromWOTDSite();
      this.cacheWOTD(wotd);
      return wotd;
    } catch {
      console.log('Primary WOTD API failed, trying backup...');
    }

    // Try Wordnik as backup
    try {
      const wotd = await this.fetchFromWordnik();
      this.cacheWOTD(wotd);
      return wotd;
    } catch {
      console.log('Backup WOTD API failed, using fallback...');
    }

    // Use fallback word
    const fallback = this.getFallbackWord();
    const fallbackWithSource = {
      ...fallback,
      source: 'fallback',
    };
    this.cacheWOTD(fallbackWithSource);
    return fallbackWithSource;
  }

  // Clean up old cache entries
  cleanupCache() {
    try {
      const cache = JSON.parse(
        localStorage.getItem(this.WOTD_CACHE_KEY) || '{}'
      );
      const today = new Date();
      const validKeys = [];

      // Keep only last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        validKeys.push(key);
      }

      const cleanCache = {};
      validKeys.forEach((key) => {
        if (cache[key]) {
          cleanCache[key] = cache[key];
        }
      });

      localStorage.setItem(this.WOTD_CACHE_KEY, JSON.stringify(cleanCache));
    } catch (err) {
      console.error('Error cleaning WOTD cache:', err);
    }
  }
}

// Export singleton instance
export const wordOfTheDayService = new WordOfTheDayService();
