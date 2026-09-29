import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Passeios from "./pages/Passeios";
import Servicos from "./pages/Servicos";

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
        <Route path="/passeios" element={<Passeios />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/" element={<Navigate to="/passeios" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/passeios" replace />} />
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
