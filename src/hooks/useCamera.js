// src/hooks/useCamera.js
// Hook personnalisé pour gérer les contrôles de caméra

import { useRef, useEffect } from "react";
import { CAMERA_CONFIG } from "../config/constants.js";

/**
 * Hook pour gérer les contrôles de caméra Three.js
 * @param {boolean} zoomed - Si la caméra est zoomée
 * @returns {React.RefObject}
 */
export const useCamera = (zoomed) => {
  const cameraRef = useRef();

  /**
   * Position initiale de la caméra
   */
  useEffect(() => {
    if (!cameraRef.current) return;

    // Position initiale : vue normale
    const { position, target } = CAMERA_CONFIG.NORMAL;
    cameraRef.current.setLookAt(...position, ...target, false);
  }, []);

  /**
   * Changement de vue (zoom in/out)
   */
  useEffect(() => {
    if (!cameraRef.current) return;

    const config = zoomed ? CAMERA_CONFIG.ZOOMED : CAMERA_CONFIG.NORMAL;

    cameraRef.current.setLookAt(
      ...config.position,
      ...config.target,
      true, // smooth transition
    );
  }, [zoomed]);

  return cameraRef;
};

export default useCamera;
