import { useEffect, useState } from "react";
import { ArrowLeft, LogOut, User, Mail, Phone, CreditCard, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService, UserProfile } from "@/services/auth";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast.error("Sua sessão expirou. Faça login novamente.");
        authService.logout();
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    toast.info("Você saiu da sua conta.");
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(160deg, hsl(var(--primary)) 0%, hsl(var(--matrip-gradient-end)) 100%)",
        animation: "loginFadeIn 0.5s ease-out forwards",
      }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pt-12 pb-6 px-6">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="p-2 rounded-full transition-colors"
          style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-white text-xl font-bold tracking-tight">Meu Perfil</h1>
        <div className="w-9" /> {/* Spacer para centralizar o título */}
      </div>

      {/* Main Card */}
      <div
        className="flex-1 rounded-t-3xl px-6 pt-10 pb-10 flex flex-col"
        style={{ background: "hsl(var(--background))" }}
      >
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "hsl(var(--primary))" }}></div>
          </div>
        ) : profile ? (
          <>
            {/* Avatar Placeholder */}
            <div className="flex flex-col items-center mb-8">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg"
                style={{ 
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--matrip-gradient-end)))",
                  color: "hsl(var(--primary-foreground))"
                }}
              >
                <User size={40} />
              </div>
              <h2 className="text-xl font-bold text-center" style={{ color: "hsl(var(--foreground))" }}>
                {profile.nome}
              </h2>
              <span 
                className="text-xs px-3 py-1 rounded-full mt-2 font-semibold uppercase tracking-wider"
                style={{ 
                  background: "hsl(var(--primary) / 0.1)", 
                  color: "hsl(var(--primary))" 
                }}
              >
                {profile.tipo || "Usuário"}
              </span>
            </div>

            {/* Info List */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-4 p-4 rounded-2xl border" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
                <Mail size={20} style={{ color: "hsl(var(--matrip-accent))" }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>E-mail</p>
                  <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{profile.email}</p>
                </div>
              </div>

              {profile.cpf && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
                  <CreditCard size={20} style={{ color: "hsl(var(--matrip-accent))" }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>CPF</p>
                    <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{profile.cpf}</p>
                  </div>
                </div>
              )}

              {profile.contato && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
                  <Phone size={20} style={{ color: "hsl(var(--matrip-accent))" }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "hsl(var(--muted-foreground))" }}>Contato</p>
                    <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{profile.contato}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Botão Sair */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-4 mt-8 text-base font-bold transition-all active:scale-95"
              style={{
                background: "hsl(0 72% 51% / 0.1)",
                color: "hsl(0 72% 51%)",
              }}
            >
              <LogOut size={18} />
              Sair da conta
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <p style={{ color: "hsl(var(--muted-foreground))" }}>Não foi possível carregar os dados.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loginFadeIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Profile;
