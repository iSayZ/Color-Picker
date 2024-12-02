interface PaletteHistory {
  colors: string[];
  timestamp: number;
  name?: string;
}

const COOKIE_NAME = 'color-extractor-history';
const MAX_HISTORY_ITEMS = 50;

export const saveToHistory = (colors: string[], name?: string) => {
  try {
    const history = getHistory();
    const newEntry: PaletteHistory = {
      colors,
      timestamp: Date.now(),
      name,
    };

    // Add new entry at the beginning
    history.unshift(newEntry);

    // Keep only the last MAX_HISTORY_ITEMS
    if (history.length > MAX_HISTORY_ITEMS) {
      history.length = MAX_HISTORY_ITEMS;
    }

    // Save to cookie with 1 year expiration
    const oneYear = 365 * 24 * 60 * 60;
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(history)}; max-age=${oneYear}; path=/`;
  } catch (error) {
    console.error('Error saving to history:', error);
  }
};

export const getHistory = (): PaletteHistory[] => {
  try {
    const cookies = document.cookie.split(';');
    const historyCookie = cookies.find(cookie => cookie.trim().startsWith(`${COOKIE_NAME}=`));
    
    if (!historyCookie) return [];

    const historyValue = historyCookie.split('=')[1];
    return JSON.parse(decodeURIComponent(historyValue));
  } catch (error) {
    console.error('Error reading history:', error);
    return [];
  }
};

export const clearHistory = () => {
  document.cookie = `${COOKIE_NAME}=; max-age=0; path=/`;
};

export const renamePalette = (timestamp: number, newName: string) => {
  const history = getHistory();
  const paletteIndex = history.findIndex(item => item.timestamp === timestamp);
  
  if (paletteIndex !== -1) {
    history[paletteIndex].name = newName;
    const oneYear = 365 * 24 * 60 * 60;
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(history)}; max-age=${oneYear}; path=/`;
  }
};
