import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState as AppStateType } from '@/types';

const initialState: AppStateType = {
  language: 'es',
  theme: 'light',
  notifications: true,
  isConnected: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'es' | 'en'>) => {
      state.language = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setNotifications: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
  },
});

export const { 
  setLanguage, 
  setTheme, 
  setNotifications, 
  setConnectionStatus 
} = appSlice.actions;

export default appSlice.reducer;