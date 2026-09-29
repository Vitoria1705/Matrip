import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, MapPin, Heart, ShoppingBag } from 'lucide-react-native';

import { useFavoritesStore } from '../store/useFavoritesStore';
import type { Adventure } from '../types/adventure';

const PRIMARY = '#05313d';
const GRADIENT_END = '#11586a';
const DANGER = '#dc2626';

export default function FavoritesScreen({ navigation }: any) {
  const { favorites, toggleFavorite } = useFavoritesStore();


  const renderFavorite = ({ item }: { item: Adventure }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.cardImage} />
      
      <TouchableOpacity 
        style={styles.heartBtn} 
        onPress={() => toggleFavorite(item)}
      >
        <Heart size={20} color={DANGER} fill={DANGER} />
      </TouchableOpacity>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        
        <View style={styles.detailRow}>
          <MapPin size={14} color="#64748b" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.priceText}>
            R$ {item.prices.adulto.toFixed(2)}
          </Text>
          <TouchableOpacity 
            style={styles.buyBtn} 
            onPress={() => Alert.alert('Comprar', 'Redirecionando para a compra do pacote...')}
          >
            <ShoppingBag size={16} color="#fff" />
            <Text style={styles.buyBtnText}>Comprar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={[PRIMARY, GRADIENT_END]} style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Lista de Desejos</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        
        {favorites.length > 0 ? (
          <FlatList
            data={favorites}
            keyExtractor={item => item.id}
            renderItem={renderFavorite}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Heart size={64} color="#cbd5e1" style={{ marginBottom: 16 }} />
            <Text style={styles.emptyStateTitle}>Sua lista está vazia</Text>
            <Text style={styles.emptyStateText}>
              Explore pacotes na página inicial e toque no coração para salvá-los aqui.
            </Text>
            <TouchableOpacity 
              style={styles.exploreBtn} 
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreBtnText}>Explorar Pacotes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  backBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  topTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  heartBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: PRIMARY,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  exploreBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exploreBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
