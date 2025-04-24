// Translation utility functions for localStorage management and history tracking

interface Translation {
  id: string;
  source: string;
  target: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain: string;
  dateAdded: string;
  lastModified?: string;
}

interface TranslationHistory {
  id: string;
  translationId: string;
  source: string;
  target: string;
  sourceLanguage: string;
  targetLanguage: string;
  domain: string;
  timestamp: string;
  action: "create" | "update" | "ai-enhance";
}

// Get all translations from localStorage
export const getStoredTranslations = (): Translation[] => {
  const stored = localStorage.getItem("translations");
  return stored ? JSON.parse(stored) : [];
};

// Save a translation to localStorage
export const saveTranslation = (
  translation: Omit<Translation, "id" | "dateAdded">,
): Translation => {
  const translations = getStoredTranslations();

  // Check if translation already exists
  const existingIndex = translations.findIndex(
    (t) =>
      t.source.toLowerCase() === translation.source.toLowerCase() &&
      t.sourceLanguage === translation.sourceLanguage &&
      t.targetLanguage === translation.targetLanguage,
  );

  const now = new Date().toISOString();
  let newTranslation: Translation;

  if (existingIndex !== -1) {
    // Update existing translation
    newTranslation = {
      ...translations[existingIndex],
      target: translation.target,
      domain: translation.domain,
      lastModified: now,
    };
    translations[existingIndex] = newTranslation;

    // Add to history
    addToHistory({
      translationId: newTranslation.id,
      source: newTranslation.source,
      target: newTranslation.target,
      sourceLanguage: newTranslation.sourceLanguage,
      targetLanguage: newTranslation.targetLanguage,
      domain: newTranslation.domain,
      action: "update",
    });
  } else {
    // Create new translation
    newTranslation = {
      id: Date.now().toString(),
      ...translation,
      dateAdded: now,
    };
    translations.push(newTranslation);

    // Add to history
    addToHistory({
      translationId: newTranslation.id,
      source: newTranslation.source,
      target: newTranslation.target,
      sourceLanguage: newTranslation.sourceLanguage,
      targetLanguage: newTranslation.targetLanguage,
      domain: newTranslation.domain,
      action: "create",
    });
  }

  localStorage.setItem("translations", JSON.stringify(translations));
  return newTranslation;
};

// Delete a translation from localStorage
export const deleteTranslation = (id: string): void => {
  const translations = getStoredTranslations();
  const filteredTranslations = translations.filter((t) => t.id !== id);
  localStorage.setItem("translations", JSON.stringify(filteredTranslations));
};

// Clear all translations from localStorage
export const clearAllTranslations = (): void => {
  localStorage.removeItem("translations");
  localStorage.removeItem("translationHistory");
};

// Get translation history from localStorage
export const getTranslationHistory = (): TranslationHistory[] => {
  const stored = localStorage.getItem("translationHistory");
  return stored ? JSON.parse(stored) : [];
};

// Add an entry to translation history
export const addToHistory = (
  entry: Omit<TranslationHistory, "id" | "timestamp">,
): void => {
  const history = getTranslationHistory();

  const newEntry: TranslationHistory = {
    id: Date.now().toString(),
    ...entry,
    timestamp: new Date().toISOString(),
  };

  history.push(newEntry);
  localStorage.setItem("translationHistory", JSON.stringify(history));
};

// Mock function to enhance translation with AI
export const enhanceWithAI = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
): Promise<string> => {
  // This is a mock of an AI enhancement API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock AI enhancement (in real app this would call an actual API)
      let enhancedText = text;

      // Add some simulated AI enhancements
      if (targetLanguage === "de") {
        // German-specific enhancements
        enhancedText = `${text} [AI optimized for German formality]`;
      } else if (targetLanguage === "fr") {
        // French-specific enhancements
        enhancedText = `${text} [AI optimized for French expressions]`;
      } else {
        // General enhancement
        enhancedText = `${text} [AI enhanced]`;
      }

      resolve(enhancedText);
    }, 1000);
  });
};

// Simple real-time translation function (mock implementation)
export const translateInRealTime = async (
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
): Promise<string> => {
  if (!text) return "";

  // Check if we already have this translation in localStorage
  const translations = getStoredTranslations();
  const existingTranslation = translations.find(
    (t) =>
      t.source.toLowerCase() === text.toLowerCase() &&
      t.sourceLanguage === sourceLanguage &&
      t.targetLanguage === targetLanguage,
  );

  if (existingTranslation) {
    return existingTranslation.target;
  }

  // Mock translation API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Very simple mock translations (in real app this would call a translation API)
      if (sourceLanguage === "en" && targetLanguage === "ar") {
        if (text.toLowerCase().includes("hello")) resolve("مرحبا");
        else if (text.toLowerCase().includes("welcome")) resolve("أهلا وسهلا");
        else if (text.toLowerCase().includes("tax")) resolve("ضريبة " + text);
        else resolve(text + " (مترجم)");
      } else if (sourceLanguage === "en" && targetLanguage === "fr") {
        if (text.toLowerCase().includes("hello")) resolve("Bonjour");
        else if (text.toLowerCase().includes("welcome")) resolve("Bienvenue");
        else if (text.toLowerCase().includes("tax")) resolve("Taxe " + text);
        else resolve(text + " (traduit)");
      } else if (sourceLanguage === "en" && targetLanguage === "de") {
        if (text.toLowerCase().includes("hello")) resolve("Hallo");
        else if (text.toLowerCase().includes("welcome")) resolve("Willkommen");
        else if (text.toLowerCase().includes("tax")) resolve("Steuer " + text);
        else resolve(text + " (übersetzt)");
      } else {
        resolve(text + " (translated to " + targetLanguage + ")");
      }
    }, 500);
  });
};
