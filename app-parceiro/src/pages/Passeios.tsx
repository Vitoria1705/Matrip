import { useEffect, useState, type FormEvent } from "react";
import { apiFetch, apiFetchForm, ApiError } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

interface Passeio {
  id: number;
  local: string;
  cidade: string;
  estado: string;
  descricao: string;
  valor_final: number;
  imagem: string | null;
}

export default function Passeios() {
  const { user } = useAuth();
  const [passeios, setPasseios] = useState<Passeio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroForm, setErroForm] = useState<string | null>(null);
  const [removendoId, setRemovendoId] = useState<number | null>(null);

  const carregar = async () => {
    if (!user) return;
    setCarregando(true);
    setErro(null);
    try {
      const data = await apiFetch(`/guias/${user.id}/passeios`);
      setPasseios(data as Passeio[]);
    } catch (err) {
      setErro(err instanceof ApiError ? err.message : "Erro ao carregar passeios.");
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
    const formData = new FormData(form);
    formData.set("guia_id", String(user.id));

    try {
      await apiFetchForm("/passeios", formData, "POST");
      form.reset();
      setMostrarForm(false);
      carregar();
    } catch (err) {
      setErroForm(err instanceof ApiError ? err.message : "Erro ao cadastrar passeio.");
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este passeio?")) return;
    setRemovendoId(id);
    try {
      await apiFetch(`/passeios/${id}`, { method: "DELETE" });
      setPasseios((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Erro ao excluir passeio.");
    } finally {
      setRemovendoId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Meus Passeios</h2>
          <p className="text-sm text-muted-foreground">Gerencie os passeios que você oferece.</p>
        </div>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 transition"
        >
          {mostrarForm ? "Cancelar" : "+ Novo passeio"}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={cadastrar}
          className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Categoria *</label>
              <input name="categoria" required className="w-full rounded-md border border-input px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Local *</label>
              <input name="local" required className="w-full rounded-md border border-input px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cidade *</label>
              <input name="cidade" required className="w-full rounded-md border border-input px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Estado (UF) *</label>
              <input name="estado" required maxLength={2} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição *</label>
            <textarea name="descricao" required rows={3} className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Valor adulto</label>
              <input name="valor_adulto" type="number" step="0.01" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor criança</label>
              <input name="valor_crianca" type="number" step="0.01" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valor final *</label>
              <input name="valor_final" type="number" step="0.01" required className="w-full rounded-md border border-input px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data do passeio</label>
            <input name="data_passeio" type="date" className="w-full rounded-md border border-input px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fotos (opcional)</label>
            <input name="imagens" type="file" accept="image/*" multiple className="w-full text-sm" />
          </div>

          {erroForm && <p className="text-sm text-destructive">{erroForm}</p>}

          <button
            type="submit"
            disabled={salvando}
            className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60 transition"
          >
            {salvando ? "Salvando..." : "Cadastrar passeio"}
          </button>
        </form>
      )}

      {carregando && <p className="text-sm text-muted-foreground">Carregando...</p>}
      {erro && <p className="text-sm text-destructive">{erro}</p>}

      {!carregando && !erro && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {passeios.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="h-32 bg-muted flex items-center justify-center text-xs text-muted-foreground">
                {p.imagem ? (
                  <img src={`http://localhost:3000/uploads/${p.imagem}`} alt={p.local} className="w-full h-full object-cover" />
                ) : (
                  "Sem imagem"
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{p.local}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {p.cidade} - {p.estado}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.descricao}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary">
                    R$ {Number(p.valor_final).toFixed(2)}
                  </span>
                  <button
                    onClick={() => excluir(p.id)}
                    disabled={removendoId === p.id}
                    className="text-destructive text-sm hover:underline disabled:opacity-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
          {passeios.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-8">
              Nenhum passeio cadastrado ainda.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
