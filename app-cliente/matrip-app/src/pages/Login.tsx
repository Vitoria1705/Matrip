import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import logoMatrip from "@/assets/logo_matrip.png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      const response = await authService.login({
        email,
        senha: password
      });
      
      authService.saveAuthData(response);
      toast.success("Login realizado com sucesso! Bem-vindo de volta.");
      navigate("/home");
    } catch (error) {
      toast.error("E-mail ou senha incorretos.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(160deg, hsl(var(--primary)) 0%, hsl(var(--matrip-gradient-end)) 100%)",
        animation: "loginFadeIn 0.7s ease-out forwards",
      }}
    >
      {/* Top wave / logo area */}
      <div className="flex flex-col items-center pt-12 pb-4 px-6">
        <div className="rounded-full p-1 mb-4 bg-white shadow-xl overflow-hidden">
          <img
            src={logoMatrip}
            alt="Matrip"
            className="w-36 h-36 object-contain rounded-full"
          />
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight">Matrip</h1>
        <p className="text-white/70 text-sm mt-1">Sua próxima aventura começa aqui</p>
      </div>

      {/* Card branco */}
      <div
        className="rounded-t-3xl px-6 pt-7 pb-10"
        style={{ background: "hsl(var(--background))" }}
      >
        <h2 className="text-2xl font-bold mb-1 text-center" style={{ color: "hsl(var(--foreground))" }}>
          Bem-vindo de volta
        </h2>
        <p className="text-sm mb-8 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
          Entre na sua conta para continuar
        </p>

        {/* Campo e-mail ou CPF */}
        <div className="mb-4">
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>
            E-mail ou CPF
          </label>
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 border"
            style={{
              borderColor: email ? "hsl(var(--primary))" : "hsl(var(--border))",
              background: "hsl(var(--muted))",
              transition: "border-color 0.2s",
            }}
          >
            <Mail size={18} style={{ color: "hsl(var(--matrip-accent))" }} />
            <input
              type="text"
              placeholder="seu@email.com ou 000.000.000-00"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }}
            />
          </div>
        </div>

        {/* Campo senha */}
        <div className="mb-2">
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "hsl(var(--muted-foreground))" }}>
            Senha
          </label>
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 border"
            style={{
              borderColor: password ? "hsl(var(--primary))" : "hsl(var(--border))",
              background: "hsl(var(--muted))",
              transition: "border-color 0.2s",
            }}
          >
            <Lock size={18} style={{ color: "hsl(var(--matrip-accent))" }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Esqueci a senha */}
        <div className="flex justify-end mb-8">
          <button
            type="button"
            className="text-sm font-medium"
            style={{ color: "hsl(var(--primary))" }}
          >
            Esqueceu a senha?
          </button>
        </div>

        {/* Botão entrar */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={isLoading || !email || !password}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold shadow-lg active:scale-95 transition-all"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--matrip-gradient-end)))",
            color: "hsl(var(--primary-foreground))",
            boxShadow: "0 8px 24px -4px hsl(var(--primary) / 0.45)",
            opacity: (isLoading || !email || !password) ? 0.7 : 1
          }}
        >
          {isLoading ? "Entrando..." : "Entrar"}
          {!isLoading && <ArrowRight size={18} />}
        </button>

        {/* Divisor */}
        <div className="flex items-center gap-4 my-7">
          <div className="flex-1 h-px" style={{ background: "hsl(var(--border))" }} />
          <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>ou entre com</span>
          <div className="flex-1 h-px" style={{ background: "hsl(var(--border))" }} />
        </div>

        {/* Botão Google */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 rounded-xl py-3.5 border text-sm font-medium active:scale-95 transition-transform"
          style={{
            borderColor: "hsl(var(--border))",
            color: "hsl(var(--foreground))",
            background: "hsl(var(--background))",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </button>

        {/* Cadastro */}
        <p className="text-center text-sm mt-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          Não tem uma conta?{" "}
          <button type="button" className="font-semibold" style={{ color: "hsl(var(--primary))" }} onClick={() => navigate("/register")}>
            Cadastre-se grátis
          </button>
        </p>
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

export default Login;
