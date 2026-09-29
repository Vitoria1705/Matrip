import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { authService } from '../services/auth';

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8); // Começa com 80% do novo tamanho em vez de 50%

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // Termina com 100% (escala real 1.0)
        duration: 2500,
        useNativeDriver: true,
      })
    ]).start(async () => {
      // Após a animação, checamos se o usuário está logado
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Animated.Image 
          source={require('../../assets/logo_matrip.png')} 
          style={[styles.logoImage, { transform: [{ scale: scaleAnim }] }]} 
          resizeMode="contain"
        />
        <Text style={styles.logoText}>Matrip</Text>
        <Text style={styles.subText}>Carregando sua próxima aventura...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fundo branco solicitado
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 220, // Aumentado o tamanho final
    height: 220, // Aumentado o tamanho final
    marginBottom: 20,
  },
  logoText: {
    color: '#05313d', // Azul escuro para contrastar no branco
    fontSize: 50,
    fontWeight: 'bold',
  },
  subText: {
    color: '#64748b', // Cinza escuro para a legenda
    marginTop: 10,
    fontSize: 16,
  },
});

