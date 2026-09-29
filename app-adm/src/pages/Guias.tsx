import { useEffect, useState } from "react";
import { apiFetch, ApiError } from "../lib/api";

interface Guia {
  id: number;
  nome: string | null;
  email: string;
  mei: string;
  celular: string;
}

export default function Guias() {
  const [guias, setGuias] = useState<Guia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [removendoId, setRemovendoId] = useState<number | null>(null);

  const carregar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const data = await apiFetch("/admin/guias");
      setGuias(data as Guia[]);
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro ao carregar guias.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const remover = async (id: number) => {
    if (!confirm("Tem certeza que deseja remover este guia?")) return;
    setRemovendoId(id);
    try {
      await apiFetch(`/admin/guias/${id}`, { method: "DELETE" });
      setGuias((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erro ao remover guia.");
    } finally {
      setRemovendoId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Guias</h2>
      <p className="text-sm text-muted-foreground mb-6">Gerencie os guias cadastrados na plataforma.</p>

      {carregando && <p className="text-sm text-muted-foreground">Carregando...</p>}
      {erro && <p className="text-sm text-destructive">{erro}</p>}

      {!carregando && !erro && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nome</th>
                <th className="text-left px-4 py-3 font-medium">E-mail</th>
                <th className="text-left px-4 py-3 font-medium">MEI</th>
                <th className="text-left px-4 py-3 font-medium">Celular</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {guias.map((g) => (
                <tr key={g.id} className="border-t border-border">
                  <td className="px-4 py-3">{g.nome ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{g.email}</td>
                  <td className="px-4 py-3">{g.mei}</td>
                  <td className="px-4 py-3">{g.celular}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remover(g.id)}
                      disabled={removendoId === g.id}
                      className="text-destructive text-sm hover:underline disabled:opacity-50"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
              {guias.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    Nenhum guia cadastrado.
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
