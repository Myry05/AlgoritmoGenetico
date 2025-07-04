import React, { useEffect } from 'react';
import { StatusBar, Alert, AppState, AppStateStatus } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { store, persistor } from '@/store';
import { AppNavigator } from '@/navigation/AppNavigator';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuthStatus, updateUserStatus } from '@/store/slices/authSlice';
import { initializeSocket, disconnectSocket } from '@/services/socketService';
import { theme } from '@/theme';
import '@/utils/i18n';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Check authentication status on app start
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection when authenticated
      initializeSocket();
      
      // Update user status to online
      dispatch(updateUserStatus('online'));
    } else {
      // Disconnect socket when not authenticated
      disconnectSocket();
    }
  }, [isAuthenticated, user, dispatch]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (isAuthenticated && user) {
        if (nextAppState === 'active') {
          // App became active
          dispatch(updateUserStatus('online'));
        } else if (nextAppState === 'background' || nextAppState === 'inactive') {
          // App went to background
          dispatch(updateUserStatus('away'));
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, user, dispatch]);

  return (
    <NavigationContainer>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={theme.colors.surface} 
      />
      <AppNavigator />
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <PaperProvider theme={theme}>
          <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <AppContent />
            </GestureHandlerRootView>
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;