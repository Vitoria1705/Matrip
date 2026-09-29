import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, ApiError } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

interface Servico {
  id: number;
  guia_id: number | null;
  passeio_id: number | null;
  nome: string;
  descricao: string;
  valor: number;
  status: string;
}

interface PasseioResumo {
  id: number;
  local: string;
}

export default function Servicos() {
  const { user } = useAuth();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [passeios, setPasseios] = useState<PasseioResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState<string | null>(null);

  const carregar = async () => {
    if (!user) return;
    setCarregando(true);
    setErro(null);
    try {
      const [todosServicos, meusPasseios] = await Promise.all([
        apiFetch("/servicos"),
        apiFetch(`/guias/${user.id}/passeios`),
      ]);
      const meus = (todosServicos as Servico[]).filter((s) => s.guia_id === user.id);
      setServicos(meus);
      setPasseios(meusPasseios as PasseioResumo[]);
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro ao carregar serviços.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const cadastrar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setErroForm(null);
    setSalvando(true);

    const form = e.currentTarget;
    const dados = new FormData(form);

    try {
      await apiFetch("/servicos", {
        method: "POST",
        body: JSON.stringify({
          guiaId: user.id,
          passeioId: Number(dados.get("passeioId")),
          nome: dados.get("nome"),
          descricao: dados.get("descricao"),
          valor: Number(dados.get("valor")),
        }),
      });
      form.reset();
      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErroForm(err instanceof ApiError ? err.message : "Erro ao cadastrar serviço.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Meus Serviços</h2>
          <p className="text-sm text-muted-foreground">Serviços extras vinculados aos seus passeios.</p>
        </div>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          {mostrarForm ? "Cancelar" : "+ Novo serviço"}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={cadastrar} className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Passeio vinculado *</label>
            <select name="passeioId" required className="w-full rounded-md border border-input px-3 py-2 text-sm">
              <option value="">Selecione um passeio</option>
              {passeios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.local}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nome do serviço *</label>
            <input name="nome" required className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição *</label>
            <textarea name="descricao" required rows={3} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Valor *</label>
            <input name="valor" type="number" step="0.01" required className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          </div>

          {erroForm && <p className="text-sm text-destructive">{erroForm}</p>}

          <button
            type="submit"
            disabled={salvando}
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60 transition"
          >
            {salvando ? "Salvando..." : "Cadastrar serviço"}
          </button>
        </form>
      )}

      {carregando && <p className="text-sm text-muted-foreground">Carregando...</p>}
      {erro && <p className="text-sm text-destructive">{erro}</p>}

      {!carregando && !erro && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nome</th>
                <th className="text-left px-4 py-3 font-medium">Descrição</th>
                <th className="text-left px-4 py-3 font-medium">Valor</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {servicos.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-3">{s.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.descricao}</td>
                  <td className="px-4 py-3">R$ {Number(s.valor).toFixed(2)}</td>
                  <td className="px-4 py-3">{s.status}</td>
                </tr>
              ))}
              {servicos.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    Nenhum serviço cadastrado ainda.
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
