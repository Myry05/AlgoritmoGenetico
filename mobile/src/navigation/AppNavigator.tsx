import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAppSelector } from '@/store/hooks';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { RootStackParamList } from '@/types';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAppSelector(state => state.auth);

  if (isLoading) {
    return <LoadingScreen message="Verificando autenticación..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};