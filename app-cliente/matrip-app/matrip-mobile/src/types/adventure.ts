import type { ImageSourcePropType } from 'react-native';

export interface Adventure {
  id: number;
  image: ImageSourcePropType;
  title: string;
  location: string;
  description: string;
  category: string;
  duration: string;
  includes: string[];
  prices: { adulto: number; estudante: number; crianca: number };
  tourDate?: string;
  itinerary?: string[];
  frequency?: string;
  classification?: string;
  importantInfo?: string[];
}

export type TicketType = 'adulto' | 'estudante' | 'crianca';

export interface CartItem {
  id: string;
  adventureId: number;
  title: string;
  image: ImageSourcePropType;
  type: TicketType;
  quantity: number;
  unitPrice: number;
}
