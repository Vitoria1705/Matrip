interface PasswordStrengthProps {
  senha: string;
}

function calcularForca(senha: string): { nivel: number; label: string; cor: string } {
  if (!senha) return { nivel: 0, label: "", cor: "bg-transparent" };

  let pontos = 0;
  if (senha.length >= 8) pontos++;
  if (senha.length >= 12) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^A-Za-z0-9]/.test(senha)) pontos++;

  if (pontos <= 1) return { nivel: 1, label: "Fraca", cor: "bg-destructive" };
  if (pontos <= 3) return { nivel: 2, label: "Média", cor: "bg-yellow-500" };
  return { nivel: 3, label: "Forte", cor: "bg-emerald-500" };
}

export default function PasswordStrength({ senha }: PasswordStrengthProps) {
  const { nivel, label, cor } = calcularForca(senha);

  if (!senha) return null;

  return (
    <div className="mt-1.5">
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= nivel ? cor : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Força da senha: <span className="font-medium">{label}</span>
        {nivel < 3 && " — use maiúsculas, números e símbolos para deixar mais forte"}
      </p>
    </div>
  );
}
