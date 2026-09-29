import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `block rounded-md px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
  }`;

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-56 shrink-0 border-r border-border bg-card p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-lg font-bold text-primary">Matrip Admin</h1>
          {user && <p className="text-xs text-muted-foreground mt-1">{user.nome}</p>}
        </div>

        <nav className="flex-1 space-y-1">
          <NavLink to="/usuarios" className={linkClasses}>
            Usuários
          </NavLink>
          <NavLink to="/guias" className={linkClasses}>
            Guias
          </NavLink>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 text-sm text-muted-foreground hover:text-destructive text-left transition"
        >
          Sair
        </button>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
