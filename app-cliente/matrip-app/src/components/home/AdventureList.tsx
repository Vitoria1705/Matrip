import { User, GraduationCap, Baby, ShoppingCart } from "lucide-react";
import { Adventure } from "@/types/adventure";

interface AdventureListProps {
  title: string;
  adventures: Adventure[];
  onSelectAdventure: (adventure: Adventure) => void;
  onAddOneAdult: (adventure: Adventure, e: React.MouseEvent) => void;
}

export function AdventureList({ title, adventures, onSelectAdventure, onAddOneAdult }: AdventureListProps) {
  return (
    <section className="pb-8 mt-6">
      <div className="flex justify-center">
        <div className="flex flex-col w-full max-w-4xl">
          <h2 className="text-lg font-bold mb-3 px-4" style={{ color: "hsl(var(--foreground))" }}>
            {title}
          </h2>
          <div className="flex flex-col sm:flex-row sm:overflow-x-auto gap-5 pb-3 px-4 sm:snap-x sm:snap-mandatory">
            {adventures.map((adventure) => (
              <div
                key={adventure.id}
                onClick={() => onSelectAdventure(adventure)}
                className="sm:snap-start sm:flex-none sm:w-64 w-full rounded-2xl border overflow-hidden bg-white flex flex-col cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.18)] shadow-[0_2px_8px_rgba(0,0,0,0.10)]"
              >
                <img src={adventure.image} alt={adventure.title} className="w-full h-40 object-cover" loading="lazy" />
                <div className="p-3 flex flex-col flex-1">
                  <h3
                    className="text-sm font-bold text-center leading-snug mb-1"
                    style={{ color: "hsl(var(--foreground))" }}
                  >
                    {adventure.title}
                  </h3>
                  <p className="text-xs text-center mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {adventure.description}
                  </p>
                  <div className="border-t pt-2 mb-2 space-y-1">
                    <p className="text-xs flex items-center gap-1 font-medium" style={{ color: "hsl(var(--primary))" }}>
                      <User size={12} /> Adultos: <span className="font-bold">R$ {adventure.prices.adulto.toFixed(2).replace(".", ",")}</span>
                    </p>
                    <p className="text-xs flex items-center gap-1 font-medium" style={{ color: "hsl(var(--primary))" }}>
                      <GraduationCap size={12} /> Estudantes: <span className="font-bold">R$ {adventure.prices.estudante.toFixed(2).replace(".", ",")}</span>
                    </p>
                    <p className="text-xs flex items-center gap-1 font-medium" style={{ color: "hsl(var(--primary))" }}>
                      <Baby size={12} /> Crianças: <span className="font-bold">R$ {adventure.prices.crianca.toFixed(2).replace(".", ",")}</span>
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                    <div>
                      <p className="text-[10px]" style={{ color: "hsl(var(--muted-foreground))" }}>Por apenas</p>
                      <p className="text-sm font-bold" style={{ color: "hsl(var(--price-orange))" }}>
                        R$ {adventure.prices.adulto.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <button
                      onClick={(e) => onAddOneAdult(adventure, e)}
                      className="flex items-center gap-1.5 text-xs font-bold text-white px-3 py-2 rounded-full transition-opacity hover:opacity-80"
                      style={{ background: "hsl(var(--primary))" }}
                    >
                      <ShoppingCart size={13} />
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
