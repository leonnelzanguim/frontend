// src/components/three/LoadingDots.jsx
import { Text } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useChat } from "../../hooks/useChat.js"; // ✅ Depuis hooks
export const LoadingDots = (props) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState(".");

  useEffect(() => {
    // ✅ Early return si pas de loading - pas de setState du tout !
    if (!loading) return;

    // L'interval démarre directement
    const interval = setInterval(() => {
      setLoadingText((current) => {
        if (current.length >= 3) return ".";
        return current + ".";
      });
    }, 500);

    // Cleanup : juste clear l'interval
    return () => clearInterval(interval);
  }, [loading]);

  // ✅ Pas de rendu si pas loading
  if (!loading) return null;

  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX="left" anchorY="bottom" color="black">
        {loadingText}
      </Text>
    </group>
  );
};

export default LoadingDots;
