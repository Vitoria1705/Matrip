import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SplashScreen from "@/components/shared/SplashScreen";

import { authService } from "@/services/auth";

const Index = () => {
  const [splashDone, setSplashDone] = useState(false);
  const navigate = useNavigate();

  const handleSplashFinish = () => {
    setSplashDone(true);
    if (authService.isAuthenticated()) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {!splashDone && <SplashScreen onFinish={handleSplashFinish} />}
      <div className="min-h-screen bg-background" />
    </>
  );
};

export default Index;
