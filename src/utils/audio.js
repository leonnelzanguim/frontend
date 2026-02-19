// src/utils/audio.js
/**
 * Créer un élément audio depuis base64
 * @param {string} base64
 * @returns {HTMLAudioElement}
 */
export const createAudioFromBase64 = (base64) => {
  if (!base64) {
    throw new Error("Base64 audio data is required");
  }

  return new Audio(`data:audio/mp3;base64,${base64}`);
};

/**
 * Jouer un audio
 * @param {HTMLAudioElement} audio
 * @returns {Promise}
 */
export const playAudio = async (audio) => {
  try {
    await audio.play();
  } catch (error) {
    console.error("Failed to play audio:", error);
    throw error;
  }
};

/**
 * Arrêter un audio
 * @param {HTMLAudioElement} audio
 */
export const stopAudio = (audio) => {
  if (!audio) return;

  try {
    audio.pause();
    audio.currentTime = 0;
  } catch (error) {
    console.error("Failed to stop audio:", error);
  }
};

/**
 * Nettoyer un audio
 * @param {HTMLAudioElement} audio
 */
export const cleanupAudio = (audio) => {
  if (!audio) return;

  try {
    audio.pause();
    audio.src = "";
    audio.load();
  } catch (error) {
    console.error("Failed to cleanup audio:", error);
  }
};

/**
 * Obtenir le phonème actuel depuis les mouthCues
 * @param {Array} mouthCues
 * @param {number} currentTime
 * @returns {string|null}
 */
export const getCurrentPhoneme = (mouthCues, currentTime) => {
  if (!mouthCues || !Array.isArray(mouthCues)) {
    return null;
  }

  for (let i = 0; i < mouthCues.length; i++) {
    const cue = mouthCues[i];
    if (currentTime >= cue.start && currentTime <= cue.end) {
      return cue.value;
    }
  }

  return null;
};

/**
 * Valider les données de lipsync
 * @param {Object} lipsync
 * @returns {boolean}
 */
export const isValidLipsync = (lipsync) => {
  return (
    lipsync &&
    typeof lipsync === "object" &&
    Array.isArray(lipsync.mouthCues) &&
    lipsync.mouthCues.length > 0
  );
};

/**
 * Convertir un Blob audio en base64
 * @param {Blob} blob
 * @returns {Promise<string>}
 */
export const audioToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Formater le temps en MM:SS
 * @param {number} seconds
 * @returns {string}
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
