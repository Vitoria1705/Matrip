import { getApiUrl } from './apiConfig';
import type { Adventure } from '../types/adventure';

export async function fetchAdventures(): Promise<Adventure[]> {
  const url = `${getApiUrl()}/adventures`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao buscar aventuras');
  }
  const data = await response.json();
  
  // Transform backend model to frontend model
  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    location: item.location,
    description: item.description,
    category: item.category,
    duration: item.duration,
    includes: item.includes || [],
    prices: {
      adulto: item.priceAdult,
      estudante: item.priceStudent,
      crianca: item.priceChild,
    },
    tourDate: item.tourDate,
    itinerary: item.itinerary || [],
    frequency: item.frequency,
    classification: item.classification,
    importantInfo: item.importantInfo || [],
    image: item.image ? { uri: item.image } : require('../../assets/logo_matrip.png'),
  }));
}
