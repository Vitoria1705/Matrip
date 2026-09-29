import { useState } from "react";
import { MapPin, Clock, CheckCircle, User, GraduationCap, Baby, Plus, Minus, ShoppingCart, X, CalendarDays, Route, Timer, Shield, Info } from "lucide-react";
import { Adventure, CartItem, TicketType } from "@/types/adventure";

interface Props {
  adventure: Adventure | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (items: CartItem[]) => void;
}

const typeLabel: Record<TicketType, string> = {
  adulto: "Adulto",
  estudante: "Estudante",
  crianca: "Criança",
};

const typeIcon: Record<TicketType, React.ReactNode> = {
  adulto: <User size={14} />,
  estudante: <GraduationCap size={14} />,
  crianca: <Baby size={14} />,
};

export default function AdventureDetail({ adventure, isOpen, onClose, onAddToCart }: Props) {
  const [quantities, setQuantities] = useState<Record<TicketType, number>>({
    adulto: 0,
    estudante: 0,
    crianca: 0,
  });

  if (!isOpen || !adventure) return null;

  const change = (type: TicketType, delta: number) => {
    setQuantities((prev) => ({ ...prev, [type]: Math.max(0, prev[type] + delta) }));
  };

  const total = (["adulto", "estudante", "crianca"] as TicketType[]).reduce(
    (sum, t) => sum + quantities[t] * adventure.prices[t],
    0
  );

  const handleAdd = () => {
    const items: CartItem[] = (["adulto", "estudante", "crianca"] as TicketType[])
      .filter((t) => quantities[t] > 0)
      .map((t) => ({
        id: `${adventure.id}-${t}`,
        adventureId: adventure.id,
        title: adventure.title,
        image: adventure.image,
        type: t,
        quantity: quantities[t],
        unitPrice: adventure.prices[t],
      }));
    if (items.length === 0) return;
    onAddToCart(items);
    setQuantities({ adulto: 0, estudante: 0, crianca: 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
      >
        {/* Hero image */}
        <div className="relative h-52 flex-shrink-0">
          <img src={adventure.image} alt={adventure.title} className="w-full h-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white"
          >
            <X size={16} />
          </button>
          <span
            className="absolute bottom-3 left-3 text-xs font-semibold px-3 py-1 rounded-full text-white"
            style={{ background: "hsl(var(--primary))" }}
          >
            {adventure.category}
          </span>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-4">
          <h2 className="text-base font-bold leading-snug mb-1" style={{ color: "hsl(var(--foreground))" }}>
            {adventure.title}
          </h2>
          <p className="text-xs flex items-center gap-1 mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            <MapPin size={12} /> {adventure.location}
          </p>

          <p className="text-sm mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
            {adventure.description}
          </p>

          {/* Infos */}
          <div className="flex items-center gap-4 mb-3">
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(var(--primary))" }}>
              <Clock size={12} /> {adventure.duration}
            </span>
          </div>

          {/* Includes */}
          {adventure.includes.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold mb-1" style={{ color: "hsl(var(--foreground))" }}>
                O que inclui:
              </p>
              <ul className="space-y-1">
                {adventure.includes.map((item, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    <CheckCircle size={11} style={{ color: "hsl(var(--primary))" }} /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extra info cards */}
          {(adventure.tourDate || adventure.itinerary || adventure.frequency || adventure.classification || adventure.importantInfo) && (
            <div className="space-y-2 mb-4">
              {adventure.tourDate && (
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-bold flex items-center gap-1.5 mb-0.5" style={{ color: "hsl(var(--foreground))" }}>
                    <CalendarDays size={13} style={{ color: "hsl(var(--primary))" }} /> Data do passeio
                  </p>
                  <p className="text-xs ml-5" style={{ color: "hsl(var(--primary))" }}>{adventure.tourDate}</p>
                </div>
              )}

              {adventure.itinerary && adventure.itinerary.length > 0 && (
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-bold flex items-center gap-1.5 mb-1" style={{ color: "hsl(var(--foreground))" }}>
                    <Route size={13} style={{ color: "hsl(var(--primary))" }} /> Roteiro
                  </p>
                  <ul className="space-y-0.5 ml-5">
                    {adventure.itinerary.map((item, i) => (
                      <li key={i} className="text-xs list-disc" style={{ color: "hsl(var(--muted-foreground))" }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {adventure.frequency && (
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-bold flex items-center gap-1.5 mb-0.5" style={{ color: "hsl(var(--foreground))" }}>
                    <Timer size={13} style={{ color: "hsl(var(--primary))" }} /> Frequência / Horários
                  </p>
                  <p className="text-xs ml-5" style={{ color: "hsl(var(--muted-foreground))" }}>{adventure.frequency}</p>
                </div>
              )}

              {adventure.classification && (
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-bold flex items-center gap-1.5 mb-0.5" style={{ color: "hsl(var(--foreground))" }}>
                    <Shield size={13} style={{ color: "hsl(var(--primary))" }} /> Classificação
                  </p>
                  <p className="text-xs ml-5" style={{ color: "hsl(var(--primary))" }}>{adventure.classification}</p>
                </div>
              )}

              {adventure.importantInfo && adventure.importantInfo.length > 0 && (
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs font-bold flex items-center gap-1.5 mb-1" style={{ color: "hsl(var(--foreground))" }}>
                    <Info size={13} style={{ color: "hsl(var(--price-orange))" }} /> Informações importantes
                  </p>
                  <ul className="space-y-0.5 ml-5">
                    {adventure.importantInfo.map((item, i) => (
                      <li key={i} className="text-xs list-disc" style={{ color: "hsl(var(--muted-foreground))" }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Ticket selectors */}
          <div className="border rounded-xl overflow-hidden mb-4">
            {(["adulto", "estudante", "crianca"] as TicketType[]).map((type, idx, arr) => (
              <div
                key={type}
                className={`flex items-center justify-between px-4 py-3 ${idx < arr.length - 1 ? "border-b" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: "hsl(var(--primary))" }}>{typeIcon[type]}</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                      {typeLabel[type]}
                    </p>
                    <p className="text-xs font-bold" style={{ color: "hsl(var(--price-orange))" }}>
                      R$ {adventure.prices[type].toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => change(type, -1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center"
                    style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary))" }}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="w-5 text-center text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
                    {quantities[type]}
                  </span>
                  <button
                    onClick={() => change(type, 1)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                    style={{ background: "hsl(var(--primary))" }}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex items-center justify-between gap-3 bg-white">
          <div>
            <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>Total</p>
            <p className="text-lg font-bold" style={{ color: "hsl(var(--price-orange))" }}>
              R$ {total.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <button
            onClick={handleAdd}
            disabled={total === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white disabled:opacity-40 transition-opacity"
            style={{ background: "hsl(var(--primary))" }}
          >
            <ShoppingCart size={15} />
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
