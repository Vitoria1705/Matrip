import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import Guias from "./pages/Guias";

function RotaPrivada({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <RotaPrivada>
            <Layout />
          </RotaPrivada>
        }
      >
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/guias" element={<Guias />} />
        <Route path="/" element={<Navigate to="/usuarios" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/usuarios" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
