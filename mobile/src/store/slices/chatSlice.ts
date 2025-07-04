import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatState, Chat, Message } from '@/types';

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: {},
  isLoading: false,
  error: null,
  typingUsers: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    setTypingUsers: (state, action: PayloadAction<{ chatId: string; users: string[] }>) => {
      const { chatId, users } = action.payload;
      state.typingUsers[chatId] = users;
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
  setChats,
  setCurrentChat,
  addMessage,
  setMessages,
  setTypingUsers,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;