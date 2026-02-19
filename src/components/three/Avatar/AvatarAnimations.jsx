// src/components/three/Avatar/AvatarAnimations.jsx
import { useMemo } from "react";
import { useFBX } from "@react-three/drei";
import {
  ANIMATION_PATHS,
  ANIMATION_NAMES,
} from "../../../config/animations.js";

export const useAvatarAnimations = () => {
  const { animations: idleAnimation } = useFBX(ANIMATION_PATHS.IDLE);
  const { animations: talkingAnimation } = useFBX(ANIMATION_PATHS.TALKING);
  const { animations: greetingAnimation } = useFBX(ANIMATION_PATHS.GREETING);
  const { animations: angryAnimation } = useFBX(ANIMATION_PATHS.ANGRY);
  const { animations: arguingAnimation } = useFBX(ANIMATION_PATHS.ARGUING);
  const { animations: sittingTalkingAnimation } = useFBX(
    ANIMATION_PATHS.SITTING_TALKING,
  );

  const animations = useMemo(() => {
    const combined = [];

    // ✅ Cloner et renommer au lieu de modifier directement
    if (idleAnimation?.[0]) {
      const cloned = idleAnimation[0].clone();
      cloned.name = ANIMATION_NAMES.IDLE;
      combined.push(cloned);
    }

    if (talkingAnimation?.[0]) {
      const cloned = talkingAnimation[0].clone();
      cloned.name = ANIMATION_NAMES.TALKING;
      combined.push(cloned);
    }

    if (greetingAnimation?.[0]) {
      const cloned = greetingAnimation[0].clone();
      cloned.name = ANIMATION_NAMES.GREETING;
      combined.push(cloned);
    }

    if (angryAnimation?.[0]) {
      const cloned = angryAnimation[0].clone();
      cloned.name = ANIMATION_NAMES.ANGRY;
      combined.push(cloned);
    }

    if (arguingAnimation?.[0]) {
      const cloned = arguingAnimation[0].clone();
      cloned.name = ANIMATION_NAMES.ARGUING;
      combined.push(cloned);
    }

    if (sittingTalkingAnimation?.[0]) {
      const cloned = sittingTalkingAnimation[0].clone();
      cloned.name = ANIMATION_NAMES.SITTING_TALKING;
      combined.push(cloned);
    }

    return combined;
  }, [
    idleAnimation,
    talkingAnimation,
    greetingAnimation,
    angryAnimation,
    arguingAnimation,
    sittingTalkingAnimation,
  ]);

  return animations;
};

export default useAvatarAnimations;
