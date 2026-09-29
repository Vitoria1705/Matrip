import { apiFetch } from './auth';

export interface CartItemDTO {
  adventureId: number;
  title: string;
  type: string;
  quantity: number;
  unitPrice: number;
}

export interface CreditCardDTO {
  number: string;
  expiration: string;
  cvv: string;
  holderName: string;
}

export interface CheckoutRequest {
  items: CartItemDTO[];
  total: number;
  serviceFee: number;
  grandTotal: number;
  paymentMethod: 'pix' | 'credit' | 'paypal';
  creditCard?: CreditCardDTO;
}

export interface PaymentResponse {
  orderId: number;
  status: string;
  method: string;
  transactionId: string;
  qrCode?: string;
  qrCodeBase64?: string;
  checkoutUrl?: string;
  message: string;
}

export const paymentService = {
  async checkout(params: CheckoutRequest): Promise<PaymentResponse> {
    return apiFetch('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
};
