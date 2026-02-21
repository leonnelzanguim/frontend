// src/config/constants.js
// Configuration centralisée de l'application

// export const API_CONFIG = {
//   BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
//   ENDPOINTS: {
//     CHAT: "/api/chat",
//     HEALTH: "/api/health",
//   },
//   TIMEOUT: 30000, // 30 secondes
//   RETRY_ATTEMPTS: 3,
//   RETRY_DELAY: 1000, // 1 seconde
// };
export const API_CONFIG = {
  BASE_URL: "https://backend-production-2d3fd.up.railway.app/api", //import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  ENDPOINTS: {
    CHAT: "/chat",
    HEALTH: "/health",
  },
  TIMEOUT: 30000,
};

export const CAMERA_CONFIG = {
  ZOOMED: {
    position: [0, 1.5, 1.5],
    target: [0, 1.5, 0],
  },
  NORMAL: {
    position: [0, 2.2, 5],
    target: [0, 1.0, 0],
  },
  FOV: 30,
  INITIAL_POSITION: [0, 0, 1],
};

export const ANIMATION_CONFIG = {
  FADE_DURATION: 0.5,
  MORPH_SPEED: 0.1,
  LIPSYNC_SPEED: 0.2,
  BLINK_MIN_INTERVAL: 1000,
  BLINK_MAX_INTERVAL: 5000,
  BLINK_DURATION: 200,
};

export const CANVAS_CONFIG = {
  SHADOWS: true,
  CAMERA_POSITION: [0, 0, 1],
  CAMERA_FOV: 30,
};

export const UI_CONFIG = {
  INPUT_PLACEHOLDER: "Type a message...",
  BUTTON_SEND_TEXT: "Send",
  LOADING_TEXT: "Loading",
};

export const ENVIRONMENT_PRESET = "sunset";

export const CONTACT_SHADOWS_OPACITY = 0.7;
