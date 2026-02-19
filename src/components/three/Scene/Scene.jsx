// src/components/three/Scene/Scene.jsx
import { Suspense } from "react";
import { ContactShadows, Environment } from "@react-three/drei";
import { Camera } from "./Camera.jsx";
import { Avatar } from "../Avatar/Avatar.jsx";
import { LoadingDots } from "../LoadingDots.jsx";
import {
  ENVIRONMENT_PRESET,
  CONTACT_SHADOWS_OPACITY,
} from "../../../config/constants.js";

export const Scene = () => {
  return (
    <>
      <Camera />
      <Environment preset={ENVIRONMENT_PRESET} />

      <Suspense fallback={null}>
        <LoadingDots position-y={1.75} position-x={-0.02} />
      </Suspense>

      <Avatar />
      <ContactShadows opacity={CONTACT_SHADOWS_OPACITY} />
    </>
  );
};

export default Scene;
