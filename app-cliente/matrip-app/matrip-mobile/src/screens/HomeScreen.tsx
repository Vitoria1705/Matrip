import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  FlatList,
  Animated,
  Easing,
} from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  ShoppingCart,
  Search,
  GraduationCap,
  Baby,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Anchor,
  Heart,
} from 'lucide-react-native';
import type { Adventure, CartItem, TicketType } from '../types/adventure';
import {
  partnerImages,
  adventures as mockAdventures,
  culinaryAdventures as mockCulinary,
  culturalAdventures as mockCultural
} from '../data/mockData';
// import { fetchAdventures } from '../services/adventure';
import AdventureDetail from '../components/AdventureDetail';
import CartDrawer from '../components/CartDrawer';
import { useCartStore } from '../store/useCartStore';
import { useFavoritesStore } from '../store/useFavoritesStore';

const PRIMARY = '#05313d';
const YELLOW = '#f4c430';
const ORANGE = '#f97316';
const DANGER = '#dc2626';

const formatBRL = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

function Header({
  onOpenCart,
  onOpenProfile,
}: {
  onOpenCart: () => void;
  onOpenProfile: () => void;
}) {
  const cartItems = useCartStore(state => state.cartItems);
  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoBox}>
          <Image source={require('../../assets/logo_matrip.png')} style={styles.logo} />
        </View>
        <Text style={styles.headerSlogan}>Seu guia de experiências turísticas</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={onOpenProfile}>
          <User size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onOpenCart}>
          <ShoppingCart size={20} color="#fff" />
          {totalCartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Hero carousel ────────────────────────────────────────
function HeroCarousel({ onSelect, allAdventures }: { onSelect: (a: Adventure) => void, allAdventures: Adventure[] }) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndexRef = useRef(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) {
      setIndex(i);
    }
    currentIndexRef.current = i;
  };

  // Generate slides dynamically from the first 3 adventures
  const slides = allAdventures.slice(0, 3).map((a, i) => ({
    id: i,
    adventureId: a.id,
    image: a.image,
    icon: Anchor,
    category: a.category,
    title: a.title,
    location: a.location,
  }));

  React.useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      let nextIndex = currentIndexRef.current + 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      
      scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }, 2500);
    return () => clearInterval(interval);
  }, [width, slides.length]);

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide) => {
          const Icon = slide.icon;
          return (
            <TouchableOpacity
              key={slide.id}
              activeOpacity={0.9}
              style={[styles.slide, { width }]}
              onPress={() => {
                const adv = allAdventures.find((a) => a.id === slide.adventureId);
                if (adv) onSelect(adv);
              }}
            >
              <Image source={slide.image} style={styles.slideImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.75)']}
                style={styles.slideGradient}
              />
              <View style={styles.slideContent}>
                <View style={styles.slideBadge}>
                  <Icon size={14} color="#fff" />
                  <Text style={styles.slideBadgeText}>{slide.category}</Text>
                </View>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <View style={styles.slideLocationRow}>
                  <MapPin size={12} color="#fff" />
                  <Text style={styles.slideLocation}>{slide.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((s, i) => (
          <View key={s.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

// ── Search bar (visual) ──────────────────────────────────
function SearchBar({ query, onChangeQuery }: { query: string, onChangeQuery: (q: string) => void }) {
  return (
    <View style={styles.searchWrapper}>
      <View style={styles.searchBox}>
        <Search size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Para onde você quer ir?"
          placeholderTextColor="#94a3b8"
          value={query}
          onChangeText={onChangeQuery}
        />
      </View>
    </View>
  );
}

// ── Adventure card list ──────────────────────────────────
function AdventureList({
  title,
  data,
  onSelect,
  onAddOneAdult,
}: {
  title: string;
  data: Adventure[];
  onSelect: (a: Adventure) => void;
  onAddOneAdult: (a: Adventure) => void;
}) {
  const { width } = useWindowDimensions();
  const CARD_WIDTH = 300;
  const SPACING = 16;
  const SNAP_INTERVAL = CARD_WIDTH + SPACING;
  const REPEAT_COUNT = 100;
  const infiniteData = React.useMemo(() => Array(REPEAT_COUNT).fill(data).flat(), [data]);
  const MIDDLE_INDEX = Math.floor(REPEAT_COUNT / 2) * data.length + Math.floor(data.length / 2);

  const flatListRef = useRef<any>(null);
  const scrollX = useRef(new Animated.Value(MIDDLE_INDEX * SNAP_INTERVAL)).current;
  const currentIndexRef = useRef(MIDDLE_INDEX);
  
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  React.useEffect(() => {
    const id = scrollX.addListener(({ value }) => {
      currentIndexRef.current = Math.round(value / SNAP_INTERVAL);
    });
    return () => scrollX.removeListener(id);
  }, [scrollX, SNAP_INTERVAL]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= infiniteData.length) return;
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const sidePadding = Math.max(0, (width - CARD_WIDTH) / 2);

  return (
    <View style={styles.listSection}>
      <Text style={styles.listTitle}>{title}</Text>
      
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        <Animated.FlatList
          ref={flatListRef}
          data={infiniteData}
          initialScrollIndex={MIDDLE_INDEX}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({
            length: SNAP_INTERVAL,
            offset: SNAP_INTERVAL * index,
            index,
          })}
          contentContainerStyle={{ paddingHorizontal: sidePadding, alignItems: 'center' }}
          renderItem={({ item: adventure, index: i }) => {
            const inputRange = [
              (i - 1) * SNAP_INTERVAL,
              i * SNAP_INTERVAL,
              (i + 1) * SNAP_INTERVAL,
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.9, 1, 0.9],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: 'clamp',
            });

            return (
              <AnimatedTouchable
                activeOpacity={0.9}
                style={[
                  styles.card,
                  {
                    width: CARD_WIDTH,
                    marginRight: i === infiniteData.length - 1 ? 0 : SPACING,
                    opacity,
                    transform: [{ scale }],
                  }
                ]}
                onPress={() => onSelect(adventure)}
              >
                <View>
                  <Image source={adventure.image} style={styles.cardImage} />
                  <TouchableOpacity 
                    style={styles.heartBtn}
                    onPress={() => toggleFavorite(adventure)}
                  >
                    <Heart 
                      size={20} 
                      color={isFavorite(adventure.id) ? DANGER : '#94a3b8'} 
                      fill={isFavorite(adventure.id) ? DANGER : 'transparent'} 
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {adventure.title}
                  </Text>
                  <Text style={styles.cardDescription} numberOfLines={3}>
                    {adventure.description}
                  </Text>

                  <View style={styles.cardPrices}>
                    <View style={styles.cardPriceRow}>
                      <User size={12} color={PRIMARY} />
                      <Text style={styles.cardPriceLabel}>
                        Adultos: <Text style={styles.cardPriceBold}>{formatBRL(adventure.prices.adulto)}</Text>
                      </Text>
                    </View>
                    <View style={styles.cardPriceRow}>
                      <GraduationCap size={12} color={PRIMARY} />
                      <Text style={styles.cardPriceLabel}>
                        Estudantes: <Text style={styles.cardPriceBold}>{formatBRL(adventure.prices.estudante)}</Text>
                      </Text>
                    </View>
                    <View style={styles.cardPriceRow}>
                      <Baby size={12} color={PRIMARY} />
                      <Text style={styles.cardPriceLabel}>
                        Crianças: <Text style={styles.cardPriceBold}>{formatBRL(adventure.prices.crianca)}</Text>
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <View>
                      <Text style={styles.cardFooterLabel}>Por apenas</Text>
                      <Text style={styles.cardFooterPrice}>{formatBRL(adventure.prices.adulto)}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.buyBtn}
                      onPress={() => onAddOneAdult(adventure)}
                    >
                      <ShoppingCart size={13} color="#fff" />
                      <Text style={styles.buyBtnText}>Comprar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </AnimatedTouchable>
            );
          }}
        />

        <View style={styles.carouselArrows} pointerEvents="box-none">
          <TouchableOpacity 
            onPress={() => scrollToIndex(currentIndexRef.current - 1)} 
            style={styles.arrowBtn} 
          >
            <ChevronLeft color="#05313d" size={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => scrollToIndex(currentIndexRef.current + 1)} 
            style={styles.arrowBtn} 
          >
            <ChevronRight color="#05313d" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ── Partners carousel ────────────────────────────────────
function PartnersCarousel() {
  const translateX = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const currentPosRef = useRef(0);
  
  // 9 imagens, 90px de largura + 12px de margin = 102px por item
  // 9 * 102 = 918
  const TOTAL_WIDTH = 918;

  React.useEffect(() => {
    const id = translateX.addListener(({ value }) => {
      currentPosRef.current = value;
    });
    return () => {
      translateX.removeListener(id);
    };
  }, [translateX]);

  const startAnimation = (currentPos = 0) => {
    if (currentPos === 0) {
      translateX.setValue(0);
      animRef.current = Animated.loop(
        Animated.timing(translateX, {
          toValue: -TOTAL_WIDTH,
          duration: 12000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      );
      animRef.current.start();
    } else {
      const distanceLeft = TOTAL_WIDTH + currentPos; 
      const duration = (distanceLeft / TOTAL_WIDTH) * 12000;
      
      animRef.current = Animated.timing(translateX, {
        toValue: -TOTAL_WIDTH,
        duration: duration,
        useNativeDriver: true,
        easing: Easing.linear,
      });
      
      animRef.current.start(({ finished }) => {
        if (finished) {
          startAnimation(0);
        }
      });
    }
  };

  React.useEffect(() => {
    startAnimation(0);
    return () => {
      animRef.current?.stop();
    };
  }, []);

  const handleTouchStart = () => {
    animRef.current?.stop();
  };

  const handleTouchEnd = () => {
    startAnimation(currentPosRef.current);
  };

  const displayImages = [...partnerImages, ...partnerImages];

  return (
    <View style={styles.listSection}>
      <Text style={styles.listTitle}>Parceiros</Text>
      <View
        style={{ overflow: 'hidden' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <Animated.View style={[styles.partnersContent, { flexDirection: 'row', transform: [{ translateX }] }]}>
          {displayImages.map((img, i) => (
            <View key={i} style={styles.partnerCard}>
              <Image source={img} style={styles.partnerImage} />
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

// ── Footer ───────────────────────────────────────────────
function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerTitle}>Matrip</Text>
      <Text style={styles.footerText}>Seu guia de experiências turísticas no Maranhão.</Text>
      <Text style={styles.footerCopy}>© 2026 Matrip. Todos os direitos reservados.</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }: any) {
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);
  const { setCartOpen, addToCart } = useCartStore();
  const [query, setQuery] = useState('');

  const allAdventures = [...mockAdventures, ...mockCulinary, ...mockCultural];

  const adventuresList = mockAdventures.filter(a => 
    a.location.toLowerCase().includes(query.toLowerCase()) || 
    a.title.toLowerCase().includes(query.toLowerCase())
  );
  
  const culinaryList = mockCulinary.filter(a => 
    a.location.toLowerCase().includes(query.toLowerCase()) || 
    a.title.toLowerCase().includes(query.toLowerCase())
  );
  
  const culturalList = mockCultural.filter(a => 
    a.location.toLowerCase().includes(query.toLowerCase()) || 
    a.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleAddOneAdult = (adventure: Adventure) => {
    const item: CartItem = {
      id: `${adventure.id}-adulto`,
      adventureId: adventure.id,
      title: adventure.title,
      image: adventure.image,
      type: 'adulto' as TicketType,
      quantity: 1,
      unitPrice: adventure.prices.adulto,
    };
    addToCart(item);
  };

  return (
    <View style={styles.container}>
      <Header
        onOpenCart={() => setCartOpen(true)}
        onOpenProfile={() => navigation.navigate('Profile')}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroCarousel onSelect={setSelectedAdventure} allAdventures={allAdventures} />
        <SearchBar query={query} onChangeQuery={setQuery} />

        {adventuresList.length > 0 && (
          <AdventureList
            title="Aventuras"
            data={adventuresList}
            onSelect={setSelectedAdventure}
            onAddOneAdult={handleAddOneAdult}
          />
        )}
        
        {culinaryList.length > 0 && (
          <AdventureList
            title="Culinária"
            data={culinaryList}
            onSelect={setSelectedAdventure}
            onAddOneAdult={handleAddOneAdult}
          />
        )}
        
        {culturalList.length > 0 && (
          <AdventureList
            title="Cultural"
            data={culturalList}
            onSelect={setSelectedAdventure}
            onAddOneAdult={handleAddOneAdult}
          />
        )}

        <PartnersCarousel />
        <Footer />
      </ScrollView>

      <AdventureDetail
        adventure={selectedAdventure}
        onClose={() => setSelectedAdventure(null)}
      />

      <CartDrawer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: PRIMARY,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  logoBox: { backgroundColor: '#fff', borderRadius: 12, padding: 4 },
  logo: { width: 32, height: 32, resizeMode: 'contain' },
  headerSlogan: { color: YELLOW, fontSize: 12, fontWeight: '600', flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { fontSize: 10, fontWeight: 'bold', color: PRIMARY },

  // Hero
  slide: { height: 240 },
  slideImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  slideGradient: { ...StyleSheet.absoluteFillObject },
  slideContent: { position: 'absolute', bottom: 20, left: 16, right: 16 },
  slideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
  },
  slideBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  slideTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  slideLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  slideLocation: { color: '#fff', fontSize: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 10 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#cbd5e1' },
  dotActive: { backgroundColor: PRIMARY, width: 18 },

  // Search
  searchWrapper: { paddingHorizontal: 16, marginTop: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },

  // Lists
  listSection: { marginTop: 24 },
  listTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 12, paddingHorizontal: 16, textAlign: 'center' },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  carouselArrows: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardImage: { width: '100%', height: 160, resizeMode: 'cover' },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBody: { padding: 12, flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginBottom: 4 },
  cardDescription: { fontSize: 12, color: '#64748b', textAlign: 'center', marginBottom: 8 },
  cardPrices: { borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingTop: 8, marginBottom: 8, gap: 4 },
  cardPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardPriceLabel: { fontSize: 12, color: PRIMARY, fontWeight: '500' },
  cardPriceBold: { fontWeight: 'bold' },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 'auto',
  },
  cardFooterLabel: { fontSize: 10, color: '#64748b' },
  cardFooterPrice: { fontSize: 14, fontWeight: 'bold', color: ORANGE },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  buyBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  // Partners
  partnersContent: { paddingHorizontal: 16 },
  partnerCard: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    marginRight: 12,
  },
  partnerImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  // Footer
  footer: { backgroundColor: PRIMARY, padding: 24, marginTop: 24, alignItems: 'center' },
  footerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  footerText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, textAlign: 'center', marginBottom: 12 },
  footerCopy: { color: 'rgba(255,255,255,0.5)', fontSize: 11, textAlign: 'center' },
});
