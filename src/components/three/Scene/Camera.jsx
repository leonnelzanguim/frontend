// src/components/three/Scene/Camera.jsx
import { CameraControls } from "@react-three/drei";
import { useCamera } from "../../../hooks/useCamera.js";
import { useAvatar } from "../../../hooks/useAvatar.js"; // ✅ CORRIGÉ : import depuis hooks

export const Camera = () => {
  const { cameraZoomed } = useAvatar();
  const cameraRef = useCamera(cameraZoomed);

  return <CameraControls ref={cameraRef} />;
};

export default Camera;
