export type PosterCategory = 
  | 'tous'
  | 'vetements'
  | 'chaussures'
  | 'accessoires'
  | 'affiches_pub'
  | 'packs_promo';

export interface Poster {
  id: string;
  title: string;
  enterpriseName: string;
  category: PosterCategory;
  priceFCFA: number; // 500 à 1000 FCFA
  originalPriceFCFA?: number;
  description: string;
  badge?: string;
  imageUrl: string;
  contactPhone: string; // '01047286'
  createdAt: string;
  features: string[];
  salesCount: number;
  isCustom?: boolean;
}

export interface CartItem {
  poster: Poster;
  quantity: number;
}

export type PaymentChannel = 
  | 'wave' 
  | 'orange_money' 
  | 'mtn_momo' 
  | 'moov_money' 
  | 'carte_bancaire'
  | 'sms_direct';

export interface PaymentOption {
  id: PaymentChannel;
  name: string;
  shortName: string;
  description: string;
  badgeColor: string;
  accentColor: string;
  minAmount: number;
  ussdCode?: string;
  instructions: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEnterprise?: string;
  items: CartItem[];
  totalFCFA: number;
  paymentMethod: PaymentChannel;
  paymentStatus: 'payé' | 'en_attente_sms' | 'validé';
  date: string;
  smsRecipient: string; // '01047286'
  transactionRef: string;
}
