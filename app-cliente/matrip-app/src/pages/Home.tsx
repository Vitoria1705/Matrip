import { useState } from "react";
import { Adventure, CartItem, TicketType } from "@/types/adventure";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import AdventureDetail from "@/components/shared/AdventureDetail";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { SearchBar } from "@/components/home/SearchBar";
import { AdventureList } from "@/components/home/AdventureList";
import { PartnersCarousel } from "@/components/home/PartnersCarousel";
import { adventures, culinaryAdventures, culturalAdventures } from "@/data/mockData";

// ── Cart helpers ─────────────────────────────────────────
function mergeCart(prev: CartItem[], newItems: CartItem[]): CartItem[] {
  const map = new Map(prev.map((i) => [i.id, { ...i }]));
  newItems.forEach((item) => {
    if (map.has(item.id)) {
      map.get(item.id)!.quantity += item.quantity;
    } else {
      map.set(item.id, { ...item });
    }
  });
  return Array.from(map.values());
}

const Home = () => {
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleAddToCart = (items: CartItem[]) => {
    setCartItems((prev) => mergeCart(prev, items));
  };

  const handleAddOneAdult = (adventure: Adventure, e: React.MouseEvent) => {
    e.stopPropagation();
    const item: CartItem = {
      id: `${adventure.id}-adulto`,
      adventureId: adventure.id,
      title: adventure.title,
      image: adventure.image,
      type: "adulto" as TicketType,
      quantity: 1,
      unitPrice: adventure.prices.adulto,
    };
    setCartItems((prev) => mergeCart(prev, [item]));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--background))" }}>
      <Header totalCartCount={totalCartCount} onOpenCart={() => setCartOpen(true)} />

      <HeroCarousel onSelectAdventure={setSelectedAdventure} />
      
      <SearchBar />

      <AdventureList 
        title="Aventuras" 
        adventures={adventures} 
        onSelectAdventure={setSelectedAdventure} 
        onAddOneAdult={handleAddOneAdult} 
      />

      <AdventureList 
        title="Culinária" 
        adventures={culinaryAdventures} 
        onSelectAdventure={setSelectedAdventure} 
        onAddOneAdult={handleAddOneAdult} 
      />

      <AdventureList 
        title="Cultural" 
        adventures={culturalAdventures} 
        onSelectAdventure={setSelectedAdventure} 
        onAddOneAdult={handleAddOneAdult} 
      />

      <PartnersCarousel />

      <Footer />

      <AdventureDetail
        adventure={selectedAdventure}
        isOpen={!!selectedAdventure}
        onClose={() => setSelectedAdventure(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
      />
    </div>
  );
};

export default Home;
