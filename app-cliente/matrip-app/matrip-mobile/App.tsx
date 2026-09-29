import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Telas (Vamos criar nos próximos passos)
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SplashScreen from './src/screens/SplashScreen';
import MyTripsScreen from './src/screens/MyTripsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import FAQScreen from './src/screens/FAQScreen';

import { authService } from './src/services/auth';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Splash');

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authService.isAuthenticated();
      // O SplashScreen vai decidir a navegação real, mas definimos o estado inicial aqui se quisermos.
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="MyTrips" component={MyTripsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
