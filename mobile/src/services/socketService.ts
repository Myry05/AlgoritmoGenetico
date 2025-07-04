import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '@/store';
import { SocketEvents } from '@/types';

const SOCKET_URL = __DEV__ ? 'http://localhost:3000' : 'https://your-production-api.com';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  async initializeSocket(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        console.warn('No auth token found, cannot initialize socket');
        return;
      }

      this.socket = io(SOCKET_URL, {
        auth: {
          token
        },
        transports: ['websocket'],
        forceNew: true,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.isConnected = false;
    });

    // Chat events
    this.socket.on('receive_message', (data) => {
      console.log('📨 Message received:', data);
      // Dispatch to Redux store
      // store.dispatch(addMessage(data));
    });

    this.socket.on('user_typing', (data) => {
      console.log('⌨️ User typing:', data);
      // store.dispatch(setUserTyping(data));
    });

    // Video call events
    this.socket.on('call_user', (data) => {
      console.log('📞 Incoming call:', data);
      // store.dispatch(setIncomingCall(data));
    });

    this.socket.on('call_accepted', (signal) => {
      console.log('✅ Call accepted:', signal);
      // Handle call acceptance
    });

    this.socket.on('call_ended', () => {
      console.log('📞 Call ended');
      // store.dispatch(endCall());
    });

    this.socket.on('call_rejected', () => {
      console.log('❌ Call rejected');
      // store.dispatch(rejectCall());
    });

    // User status events
    this.socket.on('user_status_update', (data) => {
      console.log('👤 User status update:', data);
      // store.dispatch(updateUserStatus(data));
    });
  }

  // Chat methods
  joinChat(chatId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_chat', chatId);
    }
  }

  leaveChat(chatId: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_chat', chatId);
    }
  }

  sendMessage(data: { chatId: string; message: string; timestamp: string }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', data);
    }
  }

  sendTyping(data: { chatId: string; isTyping: boolean }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', data);
    }
  }

  // Video call methods
  callUser(data: { userToCall: string; signalData: any; from: string; name: string }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('call_user', data);
    }
  }

  answerCall(data: { to: string; signal: any }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('answer_call', data);
    }
  }

  endCall(data: { to: string }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('end_call', data);
    }
  }

  rejectCall(data: { to: string }): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('reject_call', data);
    }
  }

  // User status methods
  updateStatus(status: 'online' | 'offline' | 'away' | 'busy'): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('update_status', status);
    }
  }

  // Connection management
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  reconnect(): void {
    if (this.socket) {
      this.socket.connect();
    } else {
      this.initializeSocket();
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton instance
const socketService = new SocketService();

export const initializeSocket = () => socketService.initializeSocket();
export const disconnectSocket = () => socketService.disconnect();
export const reconnectSocket = () => socketService.reconnect();
export const isSocketConnected = () => socketService.isSocketConnected();

export const {
  joinChat,
  leaveChat,
  sendMessage,
  sendTyping,
  callUser,
  answerCall,
  endCall,
  rejectCall,
  updateStatus,
  getSocket,
} = socketService;

export default socketService;