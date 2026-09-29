import { Search, ChevronDown } from "lucide-react";

export function SearchBar() {
  return (
    <section className="px-4 mt-8 mb-6">
      <h2 className="text-2xl font-bold text-center mb-1" style={{ color: "hsl(var(--foreground))" }}>
        Escolha sua próxima experiência
      </h2>
      <p className="text-sm text-center mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
        Passeios, cultura, aventura e muito mais para você aproveitar ao máximo.
      </p>
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-full shadow-sm"
        style={{ background: "hsl(var(--search-bar))" }}
      >
        <img src="https://flagcdn.com/w40/br.png" alt="Brasil" className="w-6 h-auto rounded-sm" />
        <button className="flex items-center gap-1 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
          UF <ChevronDown size={13} />
        </button>
        <div className="w-px h-5 mx-1" style={{ background: "hsl(var(--border))" }} />
        <button className="flex items-center gap-1 text-sm flex-1" style={{ color: "hsl(var(--muted-foreground))" }}>
          Município <ChevronDown size={13} />
        </button>
        <button className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
          <Search size={15} />
          Buscar
        </button>
      </div>
    </section>
  );
}
