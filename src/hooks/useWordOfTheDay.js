import { useState, useEffect } from 'react';

export const useWordOfTheDay = () => {
  const [wordOfTheDay, setWordOfTheDay] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      setIsLoading(true);
      try {
        // Use Wordnik API for word of the day
        const response = await fetch(
          'https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch word of the day');
        }

        const data = await response.json();

        // Format the data to match our structure
        const formattedWord = {
          word: data.word,
          definition:
            data.definitions?.[0]?.text ||
            data.note ||
            'A fascinating word to explore today',
          example:
            data.examples?.[0]?.text ||
            `Discover how to use "${data.word}" in context`,
          partOfSpeech: data.definitions?.[0]?.partOfSpeech || 'word',
        };

        setWordOfTheDay(formattedWord);
      } catch (error) {
        console.error('Error fetching word of the day:', error);

        // Fallback to a simple word if API fails
        const fallbackWords = [
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
        ];

        const today = new Date();
        const dayIndex = today.getDate() % fallbackWords.length;
        setWordOfTheDay(fallbackWords[dayIndex]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordOfTheDay();
  }, []);

  return { wordOfTheDay, isLoading };
};
