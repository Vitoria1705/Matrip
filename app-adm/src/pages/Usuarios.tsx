import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../lib/api";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

const TIPOS = ["usuario", "guia", "admin"];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvandoId, setSalvandoId] = useState<number | null>(null);

  const carregar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const data = await apiFetch("/admin/usuarios");
      setUsuarios(data as Usuario[]);
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro ao carregar usuários.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const alterarTipo = async (id: number, tipo: string) => {
    setSalvandoId(id);
    try {
      await apiFetch(`/admin/usuarios/${id}/tipo`, {
        method: "PUT",
        body: JSON.stringify({ tipo }),
      });
      setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, tipo } : u)));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erro ao atualizar tipo.");
    } finally {
      setSalvandoId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Usuários</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Gerencie o tipo de acesso de cada usuário cadastrado.
      </p>

      {carregando && <p className="text-sm text-muted-foreground">Carregando...</p>}
      {erro && <p className="text-sm text-destructive">{erro}</p>}

      {!carregando && !erro && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nome</th>
                <th className="text-left px-4 py-3 font-medium">E-mail</th>
                <th className="text-left px-4 py-3 font-medium">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3">{u.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.tipo}
                      disabled={salvandoId === u.id}
                      onChange={(e) => alterarTipo(u.id, e.target.value)}
                      className="rounded-md border border-input bg-background px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    >
                      {TIPOS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
