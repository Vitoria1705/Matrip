import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, ApiError } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      const data = (await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ email, password: senha }),
      })) as LoginResponse;

      if (data.tipo !== "guia") {
        setErro("Este painel é restrito a guias/parceiros cadastrados.");
        return;
      }

      login({ id: data.id, nome: data.nome, email: data.email, tipo: data.tipo });
      navigate("/passeios");
    } catch (err) {
      setErro(
        err instanceof ApiError ? err.message : "Não foi possível conectar ao servidor. O backend está rodando?"
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-lg shadow-sm p-8">
        <h1 className="text-2xl font-bold text-primary mb-1">Matrip Parceiro</h1>
        <p className="text-sm text-muted-foreground mb-6">Painel do guia/parceiro</p>

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
      </div>
    </div>
  );
}
