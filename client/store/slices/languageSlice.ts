import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'tr' | 'en';

interface LanguageState {
  currentLanguage: Language;
  isRTL: boolean;
}

const initialState: LanguageState = {
  currentLanguage: (localStorage.getItem('language') as Language) || 'tr',
  isRTL: false, // Turkish and English are LTR languages
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
    toggleLanguage: (state) => {
      const newLanguage = state.currentLanguage === 'tr' ? 'en' : 'tr';
      state.currentLanguage = newLanguage;
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', newLanguage);
      }
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
