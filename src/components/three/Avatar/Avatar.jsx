// src/components/three/Avatar/Avatar.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useGraph } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { useAvatar } from "../../../hooks/useAvatar.js"; // ✅ Depuis hooks
import { useAudio } from "../../../hooks/useAudio.js";
import { useAvatarAnimations } from "./AvatarAnimations.jsx";
import { useAvatarExpressions } from "./AvatarExpressions.jsx";
import { useAvatarLipSync } from "./AvatarLipSync.jsx";
import {
  DEFAULT_ANIMATION,
  getAnimationName,
} from "../../../config/animations.js";
import { ANIMATION_CONFIG } from "../../../config/constants.js";

const MODEL_PATH = "/models/696a4b8a86e729b70995ba73.glb";
// const MODEL_PATH = "/models/699340fb3781699417c55ef4.glb";

export function Avatar(props) {
  const { scene } = useGLTF(MODEL_PATH);
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);

  const animations = useAvatarAnimations();

  const { currentMessage, onMessagePlayed } = useAvatar();
  const [blink, setBlink] = useState(false);

  // ✅ Dériver les valeurs directement de currentMessage avec useMemo
  const animation = useMemo(() => {
    if (!currentMessage?.animation) return DEFAULT_ANIMATION;
    return getAnimationName(currentMessage.animation);
  }, [currentMessage]);

  const facialExpression = useMemo(() => {
    return currentMessage?.facialExpression || "default";
  }, [currentMessage]);

  const lipsync = useMemo(() => {
    return currentMessage?.lipsync || null;
  }, [currentMessage]);

  const audioBase64 = currentMessage?.audio || null;
  const { audio, isPlaying } = useAudio(audioBase64, onMessagePlayed);

  const group = useRef();
  const { actions } = useAnimations(animations, group);

  // ✅ Gestion des animations (pas de setState ici)
  useEffect(() => {
    if (!actions || !actions[animation]) return;

    actions[animation].reset().fadeIn(ANIMATION_CONFIG.FADE_DURATION).play();

    return () => {
      actions[animation]?.fadeOut(ANIMATION_CONFIG.FADE_DURATION);
    };
  }, [animation, actions]);

  // ✅ Clignement automatique des yeux
  useEffect(() => {
    let blinkTimeout;

    const nextBlink = () => {
      blinkTimeout = setTimeout(
        () => {
          setBlink(true);
          setTimeout(() => {
            setBlink(false);
            nextBlink();
          }, ANIMATION_CONFIG.BLINK_DURATION);
        },
        THREE.MathUtils.randInt(
          ANIMATION_CONFIG.BLINK_MIN_INTERVAL,
          ANIMATION_CONFIG.BLINK_MAX_INTERVAL,
        ),
      );
    };

    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  useAvatarExpressions(group, nodes, facialExpression, blink);
  useAvatarLipSync(group, lipsync, audio, isPlaying);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />

      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />

      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />

      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />

      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />

      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />

      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />

      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />

      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />

      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />

      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);

export default Avatar;
