// src/components/three/Avatar/AvatarLipSync.jsx
import { useFrame } from "@react-three/fiber";
import { lerpMorphTarget } from "../../../utils/morphTargets.js";
import { getCurrentPhoneme, isValidLipsync } from "../../../utils/audio.js";
import { VISEME_MAPPING } from "../../../config/expressions.js";
import { ANIMATION_CONFIG } from "../../../config/constants.js";

export const useAvatarLipSync = (groupRef, lipsync, audio, isPlaying) => {
  useFrame(() => {
    if (!groupRef.current || !isPlaying || !audio) return;

    if (!isValidLipsync(lipsync)) {
      return;
    }

    const currentTime = audio.currentTime;
    const phoneme = getCurrentPhoneme(lipsync.mouthCues, currentTime);

    const viseme = phoneme ? VISEME_MAPPING[phoneme] : null;

    if (viseme) {
      lerpMorphTarget(groupRef, viseme, 1, ANIMATION_CONFIG.LIPSYNC_SPEED);
    }

    Object.values(VISEME_MAPPING).forEach((visemeName) => {
      if (visemeName !== viseme) {
        lerpMorphTarget(groupRef, visemeName, 0, ANIMATION_CONFIG.MORPH_SPEED);
      }
    });
  });
};

export default useAvatarLipSync;
