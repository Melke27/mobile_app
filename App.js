import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ItemsProvider } from './src/context/ItemsContext';
import { permissionsService } from './src/services/permissionsService';

const App = () => {
  useEffect(() => {
    permissionsService.requestNotificationPermission().catch(() => undefined);
  }, []);

  return (
    <AuthProvider>
      <ItemsProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ItemsProvider>
    </AuthProvider>
  );
};

export default App;
