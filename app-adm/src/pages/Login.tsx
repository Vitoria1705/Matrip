import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, ApiError } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { GOOGLE_CLIENT_ID } from "../lib/googleConfig";

interface LoginResponse {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const entrarComoAdmin = (data: LoginResponse) => {
    if (data.tipo !== "admin") {
      setErro("Este painel é restrito a administradores.");
      return;
    }
    login(data);
    navigate("/usuarios");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password: senha }),
      });
      entrarComoAdmin(data);
    } catch (err) {
      setErro(
        err instanceof ApiError ? err.message : "Não foi possível conectar ao servidor. O backend está rodando?"
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (GOOGLE_CLIENT_ID.startsWith("REPLACE_WITH")) {
      // Ainda não configuramos o Client ID de verdade — não tenta renderizar o botão.
      return;
    }

    let intervalo: ReturnType<typeof setInterval> | undefined;

    const tentarRenderizar = () => {
      if (!window.google || !googleBtnRef.current) return false;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          setErro(null);
          setCarregando(true);
          try {
            const data = await apiFetch("/auth/google", {
              method: "POST",
              body: JSON.stringify({ credential: response.credential }),
            });
            entrarComoAdmin(data as LoginResponse);
          } catch (err) {
            setErro(err instanceof ApiError ? err.message : "Erro ao entrar com o Google.");
          } finally {
            setCarregando(false);
          }
        },
      });

      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "signin_with",
      });

      return true;
    };

    if (!tentarRenderizar()) {
      intervalo = setInterval(() => {
        if (tentarRenderizar() && intervalo) clearInterval(intervalo);
      }, 300);
    }

    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Matrip Admin</h1>
        <p className="text-sm text-muted-foreground mb-6">Acesso restrito à administração</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          {erro && (
            <p className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60 transition"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {GOOGLE_CLIENT_ID.startsWith("REPLACE_WITH") ? (
          <p className="text-xs text-center text-muted-foreground">
            Login com Google ainda não configurado (falta o Client ID).
          </p>
        ) : (
          <div ref={googleBtnRef} className="flex justify-center" />
        )}
      </div>
    </div>
  );
}
