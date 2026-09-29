import { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";
import { CartItem, TicketType } from "@/types/adventure";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const typeLabel: Record<TicketType, string> = {
  adulto: "Adulto",
  estudante: "Estudante",
  crianca: "Criança",
};

type PaymentMethod = "pix" | "credit" | "paypal" | null;

const PixIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M17.2 14.63c-.45 0-.87-.18-1.19-.5l-3.01-3.01a.47.47 0 0 0-.66 0l-3.03 3.03c-.32.32-.74.5-1.19.5h-.56l3.82 3.82a2.5 2.5 0 0 0 3.54 0l3.84-3.84h-.56Zm-10.08-5.26c.45 0 .87.18 1.19.5l3.03 3.03a.47.47 0 0 0 .66 0l3.01-3.01c.32-.32.74-.5 1.19-.5h.56L12.92 5.55a2.5 2.5 0 0 0-3.54 0L5.56 9.37h1.56Z" fill="currentColor"/>
    <path d="M20.45 10.92l-1.87-1.87h-1.4c-.2 0-.41.08-.56.24l-3.01 3.01a1.35 1.35 0 0 1-1.9 0l-3.03-3.03a.79.79 0 0 0-.56-.24H6.54l-1.99 1.99a2.5 2.5 0 0 0 0 3.54l1.87 1.87h1.7c.2 0 .41-.08.56-.24l3.03-3.03a1.35 1.35 0 0 1 1.9 0l3.01 3.01c.15.15.35.24.56.24h1.82l1.87-1.87a2.5 2.5 0 0 0 0-3.54l.58.12Z" fill="currentColor"/>
  </svg>
);

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemove }: Props) {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const grandTotal = total + 20;

  const handleBack = () => {
    setShowPayment(false);
    setSelectedMethod(null);
  };

  const handleClose = () => {
    setShowPayment(false);
    setSelectedMethod(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      <div className="relative w-full max-w-sm bg-white flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            {showPayment ? (
              <button onClick={handleBack} className="mr-1" style={{ color: "hsl(var(--primary))" }}>
                <ArrowLeft size={18} />
              </button>
            ) : (
              <ShoppingBag size={18} style={{ color: "hsl(var(--primary))" }} />
            )}
            <h2 className="text-base font-bold" style={{ color: "hsl(var(--foreground))" }}>
              {showPayment ? "Pagamento" : "Carrinho"}
            </h2>
            {!showPayment && cartItems.length > 0 && (
              <span
                className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                style={{ background: "hsl(var(--primary))" }}
              >
                {cartItems.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {!showPayment ? (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                  <ShoppingBag size={40} style={{ color: "hsl(var(--muted-foreground))" }} />
                  <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                    Seu carrinho está vazio
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 rounded-xl border bg-white">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-snug line-clamp-2" style={{ color: "hsl(var(--foreground))" }}>
                        {item.title}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {typeLabel[item.type]} · R$ {item.unitPrice.toFixed(2).replace(".", ",")}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-full border flex items-center justify-center"
                            style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" }}
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-sm font-bold w-4 text-center" style={{ color: "hsl(var(--foreground))" }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                            style={{ background: "hsl(var(--primary))" }}
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold" style={{ color: "hsl(var(--price-orange))" }}>
                            R$ {(item.quantity * item.unitPrice).toFixed(2).replace(".", ",")}
                          </p>
                          <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t bg-white">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Subtotal</p>
                  <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                    R$ {total.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>Taxa de serviço</p>
                  <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>R$ 20,00</p>
                </div>
                <div className="flex items-center justify-between mb-4 pt-3 border-t">
                  <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>Total</p>
                  <p className="text-lg font-bold" style={{ color: "hsl(var(--price-orange))" }}>
                    R$ {grandTotal.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full py-3 rounded-full text-sm font-bold text-white"
                  style={{ background: "hsl(var(--primary))" }}
                >
                  Finalizar pedido
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Payment Method Selection */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Order summary */}
              <div className="rounded-xl border p-3 mb-5">
                <p className="text-xs font-semibold mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Resumo do pedido
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>
                    {cartItems.reduce((s, i) => s + i.quantity, 0)} item(s)
                  </p>
                  <p className="text-base font-bold" style={{ color: "hsl(var(--price-orange))" }}>
                    R$ {grandTotal.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>

              <p className="text-sm font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>
                Selecione a forma de pagamento
              </p>

              <div className="space-y-3">
                {/* Pix */}
                <button
                  onClick={() => setSelectedMethod("pix")}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: selectedMethod === "pix" ? "hsl(var(--primary))" : "#e5e7eb",
                    background: selectedMethod === "pix" ? "hsl(var(--primary) / 0.05)" : "white",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "#00BDAE", color: "white" }}
                  >
                    <PixIcon />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>Pix</p>
                    <p className="text-[11px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Pagamento instantâneo · Aprovação imediata
                    </p>
                  </div>
                  {selectedMethod === "pix" && (
                    <CheckCircle2 size={20} style={{ color: "hsl(var(--primary))" }} />
                  )}
                </button>

                {/* Cartão de Crédito */}
                <button
                  onClick={() => setSelectedMethod("credit")}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: selectedMethod === "credit" ? "hsl(var(--primary))" : "#e5e7eb",
                    background: selectedMethod === "credit" ? "hsl(var(--primary) / 0.05)" : "white",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "hsl(var(--primary))", color: "white" }}
                  >
                    <CreditCard size={18} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>Cartão de Crédito</p>
                    <p className="text-[11px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Visa, Mastercard · Parcele em até 12x
                    </p>
                  </div>
                  {selectedMethod === "credit" && (
                    <CheckCircle2 size={20} style={{ color: "hsl(var(--primary))" }} />
                  )}
                </button>

                {/* PayPal */}
                <button
                  onClick={() => setSelectedMethod("paypal")}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: selectedMethod === "paypal" ? "hsl(var(--primary))" : "#e5e7eb",
                    background: selectedMethod === "paypal" ? "hsl(var(--primary) / 0.05)" : "white",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "#003087", color: "white" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.645h6.565c2.18 0 3.727.592 4.6 1.76.82 1.097.98 2.468.477 4.073-.015.047-.03.094-.047.14l-.006.021v.002c-.63 2.15-1.797 3.593-3.466 4.287-.862.358-1.865.537-2.98.537H9.382a.77.77 0 0 0-.757.645l-.927 5.884a.641.641 0 0 1-.633.54l.011-.627Z"/>
                      <path d="M19.545 7.26c-.035.12-.074.243-.116.37-1.012 3.27-3.456 4.87-7.27 4.87H10.31l-1.172 7.435h2.474a.56.56 0 0 0 .554-.473l.023-.117.44-2.786.028-.153a.56.56 0 0 1 .554-.473h.348c2.26 0 4.028-.918 4.545-3.574.216-1.11.105-2.036-.468-2.687a2.23 2.23 0 0 0-.64-.462l.149.05Z" opacity="0.7"/>
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>PayPal</p>
                    <p className="text-[11px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Pague com sua conta PayPal
                    </p>
                  </div>
                  {selectedMethod === "paypal" && (
                    <CheckCircle2 size={20} style={{ color: "hsl(var(--primary))" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm button */}
            <div className="p-4 border-t bg-white">
              <button
                disabled={!selectedMethod}
                className="w-full py-3 rounded-full text-sm font-bold text-white transition-opacity"
                style={{
                  background: "hsl(var(--primary))",
                  opacity: selectedMethod ? 1 : 0.5,
                }}
              >
                Confirmar pagamento
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
