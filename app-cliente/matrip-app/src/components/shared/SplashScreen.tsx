import { useEffect, useState } from "react";
import logoMatrip from "@/assets/logo_matrip.png";

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

const SplashScreen = ({ onFinish, duration = 3200 }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1000);

    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 700);

    const finishTimer = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, duration);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(fadeOutTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish, duration]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        transition: "opacity 0.7s ease-in-out",
        opacity: fadeOut ? 0 : 1,
      }}
    >
      <img
        src={logoMatrip}
        alt="Matrip"
        style={{
          width: 340,
          height: 340,
          objectFit: "contain",
          animation: "logoFadeIn 0.9s ease-out forwards",
        }}
      />
      <div
        style={{
          textAlign: "center",
          marginTop: 8,
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
        }}
      >
        <p style={{ fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
          Bem-vindo ao Matrip
        </p>
        <p style={{ fontSize: 15, color: "#666666", marginTop: 6 }}>
          Sua próxima aventura começa aqui
        </p>
      </div>
      <style>{`
        @keyframes logoFadeIn {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
