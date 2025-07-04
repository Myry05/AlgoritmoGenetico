export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'online' | 'offline' | 'away' | 'busy';
  language: 'es' | 'en';
  isEmailVerified: boolean;
  phoneNumber?: string;
  dateOfBirth?: string;
  country?: string;
  city?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Chat {
  _id: string;
  name?: string;
  description?: string;
  type: 'private' | 'group';
  participants: ChatParticipant[];
  createdBy: User;
  lastMessage?: Message;
  lastActivity: string;
  isActive: boolean;
  avatar?: string;
  settings: ChatSettings;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  user: User;
  role: 'member' | 'admin' | 'owner';
  joinedAt: string;
  lastReadAt: string;
}

export interface ChatSettings {
  allowFileSharing: boolean;
  allowVoiceCalls: boolean;
  allowVideoCalls: boolean;
  messageRetention: number;
}

export interface Message {
  _id: string;
  content: string;
  sender: User;
  chat: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'system';
  replyTo?: Message;
  attachments: MessageAttachment[];
  reactions: MessageReaction[];
  readBy: MessageRead[];
  isEdited: boolean;
  editedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface MessageAttachment {
  url: string;
  publicId?: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
}

export interface MessageReaction {
  user: User;
  emoji: string;
  createdAt: string;
}

export interface MessageRead {
  user: User;
  readAt: string;
}

export interface VideoCall {
  callId: string;
  callType: 'video' | 'audio';
  chat: {
    id: string;
    name: string;
    type: 'private' | 'group';
  };
  participants: CallParticipant[];
  caller: CallParticipant;
  status: 'calling' | 'connecting' | 'connected' | 'ended' | 'rejected';
  startedAt?: string;
  endedAt?: string;
  duration?: number;
}

export interface CallParticipant {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiListResponse<T = any> extends ApiResponse<{
  items: T[];
  pagination: PaginationData;
}> {}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Loading: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  EmailVerification: { email: string };
};

export type MainTabParamList = {
  Chats: undefined;
  Contacts: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: { chatId: string };
  CreateChat: undefined;
  ChatSettings: { chatId: string };
  VideoCall: { callData: VideoCall };
};

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  language?: 'es' | 'en';
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileForm {
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
  language?: 'es' | 'en';
  dateOfBirth?: string;
  country?: string;
  city?: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateChatForm {
  name?: string;
  description?: string;
  type: 'private' | 'group';
  participants: string[];
}

export interface SendMessageForm {
  content: string;
  type?: 'text' | 'image' | 'video' | 'audio' | 'file';
  replyTo?: string;
}

// Socket event types
export interface SocketEvents {
  // Chat events
  join_chat: (chatId: string) => void;
  leave_chat: (chatId: string) => void;
  send_message: (data: { chatId: string; message: string; timestamp: string }) => void;
  receive_message: (data: {
    chatId: string;
    message: string;
    sender: User;
    timestamp: string;
  }) => void;
  
  // Video call events
  call_user: (data: { userToCall: string; signalData: any; from: string; name: string }) => void;
  answer_call: (data: { to: string; signal: any }) => void;
  end_call: (data: { to: string }) => void;
  reject_call: (data: { to: string }) => void;
  call_accepted: (signal: any) => void;
  call_ended: () => void;
  call_rejected: () => void;
  
  // Typing events
  typing: (data: { chatId: string; isTyping: boolean }) => void;
  user_typing: (data: { userId: string; username: string; isTyping: boolean }) => void;
  
  // Status events
  update_status: (status: 'online' | 'offline' | 'away' | 'busy') => void;
  user_status_update: (data: { userId: string; status: string }) => void;
}

// Redux state types
export interface RootState {
  auth: AuthState;
  chat: ChatState;
  video: VideoState;
  app: AppState;
}

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  typingUsers: Record<string, string[]>;
}

export interface VideoState {
  currentCall: VideoCall | null;
  callHistory: VideoCall[];
  isInCall: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  language: 'es' | 'en';
  theme: 'light' | 'dark';
  notifications: boolean;
  isConnected: boolean;
}