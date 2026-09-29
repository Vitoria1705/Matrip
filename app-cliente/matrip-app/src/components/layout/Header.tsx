import { User, ShoppingCart } from "lucide-react";
import logoMatrip from "@/assets/logo_matrip.png";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  totalCartCount: number;
  onOpenCart: () => void;
}

export function Header({ totalCartCount, onOpenCart }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className="flex items-center justify-between px-5 py-3 sticky top-0 z-30"
      style={{ background: "hsl(var(--primary))" }}
    >
      <div className="flex items-center gap-2">
        <div className="bg-white rounded-xl p-1">
          <img src={logoMatrip} alt="Matrip" className="w-8 h-8 object-contain" />
        </div>
        <span className="text-sm font-semibold tracking-wide" style={{ color: "hsl(var(--matrip-yellow))" }}>
          Seu guia de experiências turísticas
        </span>
      </div>
      <div className="flex items-center gap-4">
        <img src="https://flagcdn.com/w40/br.png" alt="Brasil" className="w-6 h-auto rounded-sm" />
        <button className="text-white" onClick={() => navigate("/profile")}>
          <User size={20} />
        </button>
        <button className="text-white relative" onClick={onOpenCart}>
          <ShoppingCart size={20} />
          {totalCartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
              style={{ background: "hsl(var(--matrip-yellow))", color: "hsl(var(--primary))" }}
            >
              {totalCartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
