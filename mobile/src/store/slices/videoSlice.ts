import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VideoState, VideoCall } from '@/types';

const initialState: VideoState = {
  currentCall: null,
  callHistory: [],
  isInCall: false,
  isLoading: false,
  error: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setCurrentCall: (state, action: PayloadAction<VideoCall | null>) => {
      state.currentCall = action.payload;
      state.isInCall = action.payload !== null;
    },
    addToCallHistory: (state, action: PayloadAction<VideoCall>) => {
      state.callHistory.unshift(action.payload);
    },
    setCallHistory: (state, action: PayloadAction<VideoCall[]>) => {
      state.callHistory = action.payload;
    },
    updateCallStatus: (state, action: PayloadAction<VideoCall['status']>) => {
      if (state.currentCall) {
        state.currentCall.status = action.payload;
      }
    },
    endCall: (state) => {
      if (state.currentCall) {
        state.currentCall.status = 'ended';
        state.currentCall.endedAt = new Date().toISOString();
        state.currentCall = null;
        state.isInCall = false;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentCall,
  addToCallHistory,
  setCallHistory,
  updateCallStatus,
  endCall,
  setLoading,
  setError,
} = videoSlice.actions;

export default videoSlice.reducer;