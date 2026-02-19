// src/components/three/Avatar/AvatarExpressions.jsx
import { useFrame } from "@react-three/fiber";
import {
  lerpMorphTarget,
  getMorphTargetDictionary,
} from "../../../utils/morphTargets.js";
import {
  EYE_MORPH_TARGETS,
  getExpression,
} from "../../../config/expressions.js";
import { ANIMATION_CONFIG } from "../../../config/constants.js";

export const useAvatarExpressions = (
  groupRef,
  nodes,
  facialExpression,
  blink,
  winkLeft = false,
  winkRight = false,
) => {
  useFrame(() => {
    if (!groupRef.current || !nodes) return;

    const morphTargetDict = getMorphTargetDictionary(nodes);
    if (!morphTargetDict) return;

    const expression = getExpression(facialExpression);

    Object.keys(morphTargetDict).forEach((key) => {
      if (EYE_MORPH_TARGETS.includes(key)) return;

      const targetValue = expression[key] || 0;
      lerpMorphTarget(groupRef, key, targetValue, ANIMATION_CONFIG.MORPH_SPEED);
    });

    const leftEyeValue = blink || winkLeft ? 1 : 0;
    const rightEyeValue = blink || winkRight ? 1 : 0;

    lerpMorphTarget(groupRef, "eyeBlinkLeft", leftEyeValue, 0.5);
    lerpMorphTarget(groupRef, "eyeBlinkRight", rightEyeValue, 0.5);
  });
};

export default useAvatarExpressions;
