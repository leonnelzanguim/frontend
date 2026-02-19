// src/App.jsx
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Leva } from "leva";

import { Scene } from "./components/three/Scene/Scene.jsx";
import { ChatUI } from "./components/chat/ChatUI.jsx";
import { CANVAS_CONFIG } from "./config/constants.js";

function App() {
  return (
    <>
      <Loader />
      <Leva hidden />
      <ChatUI />

      <Canvas
        shadows={CANVAS_CONFIG.SHADOWS}
        camera={{
          position: CANVAS_CONFIG.CAMERA_POSITION,
          fov: CANVAS_CONFIG.CAMERA_FOV,
        }}
      >
        <Scene />
      </Canvas>
    </>
  );
}

export default App;
