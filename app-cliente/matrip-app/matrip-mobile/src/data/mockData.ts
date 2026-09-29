import { Anchor, UtensilsCrossed, Waves, Trees, type LucideIcon } from 'lucide-react-native';
import type { Adventure } from '../types/adventure';

// Imagens (em React Native, assets estáticos são carregados via require())
const barcoTocantins = require('../../assets/adventures/passeio_barco_tocantins2.jpeg');
const gastronomiaImperatriz = require('../../assets/adventures/gastronomia_imperatriz2.jpeg');
const quadriciclo = require('../../assets/adventures/quadriciclo2.jpeg');
const cachoeiraSaoRomao = require('../../assets/adventures/cachoeira_sao_romao2.jpeg');
const almocoAtins = require('../../assets/adventures/almoco_atins.jpg');
const degustacaoSaoLuis = require('../../assets/adventures/degustacao_sao_luis.jpg');
const tourCulturalPatrimonio = require('../../assets/adventures/tour_cultural_patrimonio.jpg');
const rotaCentroSabores = require('../../assets/adventures/rota_centro_sabores.jpg');
const centroHistorico = require('../../assets/adventures/centro_historico.jpg');

export interface Slide {
  id: number;
  adventureId: number;
  image: ReturnType<typeof require>;
  icon: LucideIcon;
  category: string;
  title: string;
  location: string;
  description: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    adventureId: 1,
    image: barcoTocantins,
    icon: Anchor,
    category: 'Náutico',
    title: 'Passeio de Barco no Rio Tocantins + Pôr do Sol',
    location: 'Carolina/MA',
    description: 'Passeio guiado de barco com contemplação do pôr do sol e paradas para banho.',
  },
  {
    id: 2,
    adventureId: 4,
    image: gastronomiaImperatriz,
    icon: UtensilsCrossed,
    category: 'Culinária',
    title: 'Gastronomia Imperatrizense + Mercado Municipal',
    location: 'Imperatriz/MA',
    description: 'Tour guiado por sabores regionais como arroz de cuxá adaptado e pratos típicos.',
  },
  {
    id: 3,
    adventureId: 3,
    image: quadriciclo,
    icon: Waves,
    category: 'Aventura',
    title: 'Circuito Quadriciclo + Lancha (Combo)',
    location: 'Barreirinhas/MA',
    description: 'Passeio combinando quadriciclo nas dunas e trajeto de lancha pelo rio.',
  },
  {
    id: 4,
    adventureId: 2,
    image: cachoeiraSaoRomao,
    icon: Trees,
    category: 'Ecoturismo',
    title: 'Cachoeira São Romão + Cachoeira da Prata (Chapada)',
    location: 'Carolina/MA',
    description: 'Excursão guiada com caminhada moderada até duas cachoeiras do parque.',
  },
];

export const adventures: Adventure[] = [
  {
    id: 1,
    image: barcoTocantins,
    title: 'Passeio de Barco no Rio Tocantins + Pôr do Sol',
    location: 'Carolina/MA',
    category: 'Náutico',
    description:
      'Passeio guiado de barco com contemplação do pôr do sol e paradas para banho nas praias do Rio Tocantins.',
    duration: '4h',
    includes: ['Guia especializado', 'Equipamentos de segurança', 'Água e lanche', 'Seguro viagem'],
    prices: { adulto: 340, estudante: 280, crianca: 210 },
    tourDate: '18/01/2026',
    itinerary: ['Saída: 15:00 — Porto de Carolina', 'Retorno: 19:00 — Carolina'],
    frequency: 'diário',
    classification: 'livre',
    importantInfo: ['Levar protetor solar e água.'],
  },
  {
    id: 2,
    image: cachoeiraSaoRomao,
    title: 'Cachoeira São Romão + Cachoeira da Prata (Chapada)',
    location: 'Carolina/MA',
    category: 'Ecoturismo',
    description:
      'Excursão guiada com caminhada moderada até duas cachoeiras espetaculares dentro do Parque Nacional da Chapada das Mesas.',
    duration: '6h',
    includes: ['Guia de trilha', 'Transporte ida e volta', 'Água mineral', 'Seguro'],
    prices: { adulto: 420, estudante: 350, crianca: 280 },
  },
  {
    id: 3,
    image: quadriciclo,
    title: 'Circuito Quadriciclo + Lancha (Combo)',
    location: 'Barreirinhas/MA',
    category: 'Aventura',
    description:
      'Passeio combinando quadriciclo nas dunas dos Lençóis Maranhenses e trajeto de lancha pelo Rio Preguiças.',
    duration: '5h',
    includes: ['Quadriciclo individual', 'Passeio de lancha', 'Colete salva-vidas', 'Guia'],
    prices: { adulto: 550, estudante: 450, crianca: 350 },
  },
];

export const culinaryAdventures: Adventure[] = [
  {
    id: 4,
    image: gastronomiaImperatriz,
    title: 'Gastronomia Imperatrizense + Mercado Municipal',
    location: 'Imperatriz/MA',
    category: 'Culinária',
    description: 'Tour guiado por sabores regionais como arroz de cuxá adaptado e pratos típicos.',
    duration: '3h',
    includes: ['Guia gastronômico', 'Degustação de 5 pratos', 'Visita ao mercado', 'Água mineral'],
    prices: { adulto: 190, estudante: 150, crianca: 120 },
  },
  {
    id: 5,
    image: almocoAtins,
    title: 'Almoço Típico + Comunidade de Atins',
    location: 'Barreirinhas/MA',
    category: 'Culinária',
    description: 'Visita à vila de Atins e almoço em restaurante típico.',
    duration: '4h',
    includes: ['Transporte ida e volta', 'Almoço completo', 'Guia local', 'Água mineral'],
    prices: { adulto: 390, estudante: 330, crianca: 250 },
  },
  {
    id: 6,
    image: degustacaoSaoLuis,
    title: 'Degustação Gastronômica pelo Centro Histórico de São Luís',
    location: 'São Luís/MA',
    category: 'Culinária',
    description: 'Tour guiado por mercados históricos e restaurantes típicos (provas inclusas).',
    duration: '3h30',
    includes: ['Guia especializado', 'Degustação em 4 pontos', 'Bebida inclusa', 'Seguro'],
    prices: { adulto: 320, estudante: 260, crianca: 180 },
  },
];

export const culturalAdventures: Adventure[] = [
  {
    id: 7,
    image: tourCulturalPatrimonio,
    title: 'Tour Cultural e Patrimônio Arquitetônico (Patrimônio Histórico + museus)',
    location: 'São Luís/MA',
    category: 'Cultural',
    description: 'Caminhada guiada com foco na história e arquitetura colonial.',
    duration: '4h',
    includes: ['Guia especializado', 'Entrada nos museus', 'Mapa cultural', 'Água mineral'],
    prices: { adulto: 200, estudante: 150, crianca: 120 },
  },
  {
    id: 8,
    image: rotaCentroSabores,
    title: 'Rota do Centro & Sabores de São Luís (Azulejos + Mercado + Beco Catarina Mina)',
    location: 'São Luís/MA',
    category: 'Cultural',
    description:
      'Passeio guiado pelo Centro Histórico de São Luís com foco em arquitetura colonial e azulejos portugueses, visita ao Mercado das Tulhas para conhecer sabores locais, e encerramento com pôr do sol em um mirante da região. Ideal pra quem quer cultura, fotos e história em um roteiro leve e completo.',
    duration: '5h',
    includes: ['Guia cultural', 'Degustação no Mercado das Tulhas', 'Fotos profissionais', 'Seguro'],
    prices: { adulto: 70, estudante: 55, crianca: 30 },
  },
  {
    id: 9,
    image: centroHistorico,
    title: 'Centro Histórico',
    location: 'São Luís/MA',
    category: 'Cultural',
    description:
      'Tour guiado pelo Centro Histórico de São Luís (Patrimônio Cultural), com caminhada leve por ruas e casarões coloniais, mirantes, igrejas e pontos culturais. Inclui paradas para fotos, histórias, curiosidades e tempo livre para compras e sabores locais.',
    duration: '3h',
    includes: ['Guia local', 'Roteiro personalizado', 'Água mineral', 'Seguro'],
    prices: { adulto: 79.9, estudante: 59.9, crianca: 39.9 },
  },
];

export const partnerImages = [
  require('../../assets/adventures/partner1.jpeg'),
  require('../../assets/adventures/partner2.jpeg'),
  require('../../assets/adventures/partner3.jpeg'),
  require('../../assets/adventures/partner4.jpeg'),
  require('../../assets/adventures/partner5.jpeg'),
  require('../../assets/adventures/partner6.jpeg'),
  require('../../assets/adventures/partner7.jpeg'),
  require('../../assets/adventures/partner8.jpeg'),
  require('../../assets/adventures/partner9.jpeg'),
];
