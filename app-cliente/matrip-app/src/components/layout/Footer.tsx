import { Mail, Phone, MapPinned, Facebook, Instagram, Twitter, Linkedin, ArrowUp } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "hsl(var(--footer-bg, 220 20% 20%))" }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Sobre a Matrip</h4>
            <div className="w-8 h-0.5 mb-3" style={{ background: "hsl(var(--primary))" }} />
            <p className="text-xs leading-relaxed text-gray-400">
              Conectamos viajantes a experiências inesquecíveis, promovendo turismo responsável e valorizando a cultura local.
            </p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Contato</h4>
            <div className="w-8 h-0.5 mb-3" style={{ background: "hsl(var(--primary))" }} />
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-xs text-gray-400">
                <Mail size={13} style={{ color: "hsl(var(--primary))" }} /> contato@matrip.com
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-400">
                <Phone size={13} style={{ color: "hsl(var(--primary))" }} /> (98) 9 9999-9999
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-400">
                <MapPinned size={13} style={{ color: "hsl(var(--primary))" }} /> São Luís - MA, Brasil
              </li>
            </ul>
          </div>

          {/* Pagamento */}
          <div>
            <h4 className="text-sm font-bold text-white mb-1">Meios de Pagamento</h4>
            <div className="w-8 h-0.5 mb-3" style={{ background: "hsl(var(--primary))" }} />
            <div className="flex gap-3 mt-1 items-center">
              {/* Visa */}
              <svg width="36" height="24" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="3" fill="white" fillOpacity="0.1"/><path d="M15.2 15.5h-2.4l1.5-9h2.4l-1.5 9zm-3.8-9l-2.3 6.2-.3-1.4-.8-4.1s-.1-.7-.9-.7H4.6l-.1.3s1 .2 2.1.9l1.8 6.8h2.5l3.8-8h-2.5v.1-.1zm17.5 9h2.2l-1.9-9h-1.9c-.7 0-1 .5-1 .5l-3.5 8.5h2.5l.5-1.4h3l.1 1.4zm-2.6-3.3l1.2-3.5.7 3.5h-1.9zm-4.6-3.4l.3-2s-1-.4-2-.4c-1.1 0-3.7.5-3.7 2.8 0 2.2 3 2.2 3 3.4s-2.7.9-3.6.2l-.4 2.1s1 .5 2.5.5c1.5 0 3.8-.8 3.8-2.9 0-2.2-3-2.4-3-3.4 0-1 2.1-.9 3.1-.3z" fill="white"/></svg>
              {/* Mastercard */}
              <svg width="36" height="24" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="3" fill="white" fillOpacity="0.1"/><circle cx="15" cy="12" r="6" fill="white" fillOpacity="0.8"/><circle cx="21" cy="12" r="6" fill="white" fillOpacity="0.6"/></svg>
              {/* Pix */}
              <svg width="36" height="24" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="3" fill="white" fillOpacity="0.1"/><g transform="translate(10,4) scale(0.67)"><path d="M19.5 11.3l-4.8-4.8c-.9-.9-2.4-.9-3.3 0l-4.8 4.8c-.9.9-.9 2.4 0 3.3l4.8 4.8c.9.9 2.4.9 3.3 0l4.8-4.8c.9-.9.9-2.4 0-3.3z" fill="none" stroke="white" strokeWidth="1.5"/><path d="M13 9l-2.5 2.5L13 14M13.5 9l2.5 2.5-2.5 2.5" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></g></svg>
              {/* PayPal */}
              <svg width="36" height="24" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="3" fill="white" fillOpacity="0.1"/><path d="M14.5 6h4c2.2 0 3.5 1.2 3.2 3.2-.4 2.5-2 3.8-4.2 3.8h-1.2c-.3 0-.5.2-.6.5l-.5 3.5h-2.5l1.8-11z" fill="white" fillOpacity="0.9"/><path d="M12.5 8h4c2.2 0 3.5 1.2 3.2 3.2-.4 2.5-2 3.8-4.2 3.8h-1.2c-.3 0-.5.2-.6.5l-.5 3.5h-2.5l1.8-11z" fill="white" fillOpacity="0.5"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-[11px] text-gray-500">© 2025 Matrip. Todos os direitos reservados.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white"
            style={{ background: "hsl(var(--primary))" }}
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
