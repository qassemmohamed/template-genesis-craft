
import axios from '@/lib/axios';

export interface TranslationResult {
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

export interface TranslationMemory {
  id?: string;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  domain?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TranslationHistory {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string,
  domain?: string
): Promise<TranslationResult> => {
  try {
    const response = await axios.post('/api/translate', {
      text,
      source: sourceLang,
      target: targetLang,
      domain
    });

    return {
      sourceText: text,
      targetText: response.data.translation,
      sourceLang,
      targetLang,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error('Failed to translate text');
  }
};

export const saveToMemory = async (translation: TranslationMemory): Promise<TranslationMemory> => {
  try {
    const response = await axios.post('/api/translation-memory', translation);
    return response.data;
  } catch (error) {
    console.error('Error saving to translation memory:', error);
    throw new Error('Failed to save translation to memory');
  }
};

export const getMemoryEntries = async (
  sourceLang?: string, 
  targetLang?: string,
  domain?: string
): Promise<TranslationMemory[]> => {
  try {
    let url = '/api/translation-memory';
    const params = new URLSearchParams();
    
    if (sourceLang) params.append('sourceLang', sourceLang);
    if (targetLang) params.append('targetLang', targetLang);
    if (domain) params.append('domain', domain);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching translation memory:', error);
    throw new Error('Failed to fetch translation memory');
  }
};

export const getTranslationHistory = async (): Promise<TranslationHistory[]> => {
  try {
    const response = await axios.get('/api/translation-history');
    return response.data;
  } catch (error) {
    console.error('Error fetching translation history:', error);
    throw new Error('Failed to fetch translation history');
  }
};

export const uploadMemoryFile = async (file: File): Promise<{ count: number }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post('/api/translation-memory/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading memory file:', error);
    throw new Error('Failed to upload memory file');
  }
};

export const deleteMemoryEntry = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/translation-memory/${id}`);
  } catch (error) {
    console.error('Error deleting memory entry:', error);
    throw new Error('Failed to delete memory entry');
  }
};
