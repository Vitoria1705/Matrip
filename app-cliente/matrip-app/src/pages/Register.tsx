import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft, Phone, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth";
import logoMatrip from "@/assets/logo_matrip.png";

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const isValidCPF = (cpf: string) => {
  const digits = cpf.replace(/\D/g, "");
  return digits.length === 11;
};

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValid =
    name.trim().length > 0 &&
    email.includes("@") &&
    isValidCPF(cpf) &&
    password.length >= 6 &&
    password === confirm &&
    !isLoading;

  const handleRegister = async () => {
    if (!isValid) return;
    
    setIsLoading(true);
    try {
      const response = await authService.register({
        nome: name,
        email,
        cpf,
        contato: contact,
        senha: password
      });
      
      authService.saveAuthData(response);
      toast.success("Conta criada com sucesso! Bem-vindo(a) ao Matrip.");
      navigate("/home");
    } catch (error) {
      toast.error("Erro ao criar conta. Verifique os dados ou tente outro e-mail/CPF.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, hsl(var(--primary)) 0%, hsl(var(--matrip-gradient-end)) 100%)",
        animation: "loginFadeIn 0.7s ease-out forwards",
      }}
    >
      {/* Top area */}
      <div className="flex flex-col items-center pt-12 pb-4 px-6 relative">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="absolute left-6 top-12 p-2 rounded-full"
          style={{ background: "hsl(var(--primary-foreground) / 0.15)" }}
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        <div className="rounded-full p-1 mb-4 bg-white shadow-xl overflow-hidden">
          <img src={logoMatrip} alt="Matrip" className="w-36 h-36 object-contain rounded-full" />
        </div>
        <h1 className="text-white text-2xl font-bold tracking-tight">Matrip</h1>
        <p className="text-white/70 text-sm mt-1">Crie sua conta e explore</p>
      </div>

      {/* White card */}
      <div
        className="rounded-t-3xl px-6 pt-7 pb-10"
        style={{ background: "hsl(var(--background))" }}
      >
        <h2
          className="text-2xl font-bold mb-1 text-center"
          style={{ color: "hsl(var(--foreground))" }}
        >
          Cadastro gratuito
        </h2>
        <p className="text-sm mb-8 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
          Preencha os dados abaixo para criar sua conta
        </p>

        {/* Nome Completo */}
        <div className="mb-4">
          <label
            className="text-xs font-semibold mb-1.5 block"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Nome completo
          </label>
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors"
            style={{
              borderColor: name ? "hsl(var(--primary))" : "hsl(var(--border))",
              background: "hsl(var(--muted))",
            }}
          >
            <User size={18} style={{ color: "hsl(var(--matrip-accent))" }} />
            <input
              type="text"
              placeholder="Seu nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }}
            />
          </div>
        </div>

        {/* E-mail */}
        <div className="mb-4">
          <label
            className="text-xs font-semibold mb-1.5 block"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            E-mail
          </label>
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors"
            style={{
              borderColor: email ? "hsl(var(--primary))" : "hsl(var(--border))",
              background: "hsl(var(--muted))",
            }}
          >
            <Mail size={18} style={{ color: "hsl(var(--matrip-accent))" }} />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }}
            />
          </div>
        </div>

        {/* CPF */}
        <div className="mb-4">
          <label
            className="text-xs font-semibold mb-1.5 block"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            CPF
          </label>
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors"
            style={{
              borderColor: cpf ? (isValidCPF(cpf) ? "hsl(var(--primary))" : "hsl(0 72% 51%)") : "hsl(var(--border))",
              background: "hsl(var(--muted))",
            }}
          >
            <CreditCard size={18} style={{ color: "hsl(var(--matrip-accent))" }} />
            <input
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }}
            />
          </div>
          {cpf.length > 0 && !isValidCPF(cpf) && (
            <p className="text-xs mt-1.5" style={{ color: "hsl(0 72% 51%)" }}>
              CPF inválido
            </p>
          )}
        </div>

        {/* Contato */}
        <div className="mb-4">
          <label
            className="text-xs font-semibold mb-1.5 block"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Contato
          </label>
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors"
            style={{
              borderColor: contact ? "hsl(var(--primary))" : "hsl(var(--border))",
              background: "hsl(var(--muted))",
            }}
          >
            <Phone size={18} style={{ color: "hsl(var(--matrip-accent))" }} />
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }}
            />
          </div>
        </div>

        {/* Senha */}
        <div className="mb-4">
          <label
            className="text-xs font-semibold mb-1.5 block"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Senha
          </label>
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors"
            style={{
              borderColor: password ? "hsl(var(--primary))" : "hsl(var(--border))",
              background: "hsl(var(--muted))",
            }}
          >
            <Lock size={18} style={{ color: "hsl(var(--matrip-accent))" }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ color: "hsl(var(--muted-foreground))" }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {password.length > 0 && password.length < 6 && (
            <p className="text-xs mt-1.5" style={{ color: "hsl(0 72% 51%)" }}>
              A senha deve ter pelo menos 6 caracteres
            </p>
          )}
        </div>

        {/* Confirmar senha */}
        <div className="mb-8">
          <label
            className="text-xs font-semibold mb-1.5 block"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Confirmar senha
          </label>
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3.5 border transition-colors"
            style={{
              borderColor: confirm
                ? confirm === password
                  ? "hsl(var(--primary))"
                  : "hsl(0 72% 51%)"
                : "hsl(var(--border))",
              background: "hsl(var(--muted))",
            }}
          >
            <Lock size={18} style={{ color: "hsl(var(--matrip-accent))" }} />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Repita a senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              style={{ color: "hsl(var(--foreground))" }}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ color: "hsl(var(--muted-foreground))" }}>
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {confirm.length > 0 && confirm !== password && (
            <p className="text-xs mt-1.5" style={{ color: "hsl(0 72% 51%)" }}>
              As senhas não conferem
            </p>
          )}
        </div>

        {/* Botão cadastrar */}
        <button
          type="button"
          onClick={handleRegister}
          disabled={!isValid}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold shadow-lg active:scale-95 transition-all"
          style={{
            background: isValid
              ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--matrip-gradient-end)))"
              : "hsl(var(--muted))",
            color: isValid
              ? "hsl(var(--primary-foreground))"
              : "hsl(var(--muted-foreground))",
            boxShadow: isValid
              ? "0 8px 24px -4px hsl(var(--primary) / 0.45)"
              : "none",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          {isLoading ? "Criando conta..." : "Criar conta"}
          {!isLoading && <ArrowRight size={18} />}
        </button>

        {/* Voltar ao login */}
        <p
          className="text-center text-sm mt-8"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Já tem uma conta?{" "}
          <button
            type="button"
            className="font-semibold"
            style={{ color: "hsl(var(--primary))" }}
            onClick={() => navigate("/login")}
          >
            Entrar
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

export default Register;
