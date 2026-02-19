// src/utils/morphTargets.js
// Utilitaires pour la gestion des morph targets

import * as THREE from "three";
import { EYE_MORPH_TARGETS } from "../config/expressions.js";

/**
 * Interpole un morph target vers une valeur cible
 * @param {THREE.Group} group - Groupe contenant les meshes
 * @param {string} targetName - Nom du morph target
 * @param {number} targetValue - Valeur cible (0-1)
 * @param {number} speed - Vitesse d'interpolation (0-1)
 */
export const lerpMorphTarget = (
  group,
  targetName,
  targetValue,
  speed = 0.1,
) => {
  if (!group || !group.current) return;

  group.current.traverse((child) => {
    if (child.isSkinnedMesh && child.morphTargetDictionary) {
      const index = child.morphTargetDictionary[targetName];

      if (index === undefined || !child.morphTargetInfluences) {
        return;
      }

      const currentValue = child.morphTargetInfluences[index];
      const newValue = THREE.MathUtils.lerp(currentValue, targetValue, speed);

      child.morphTargetInfluences[index] = newValue;
    }
  });
};

/**
 * Applique une expression faciale complète
 * @param {THREE.Group} group
 * @param {Object} expression - Objet avec les morph targets et leurs valeurs
 * @param {number} speed
 */
export const applyFacialExpression = (group, expression, speed = 0.1) => {
  if (!group || !expression) return;

  Object.entries(expression).forEach(([targetName, value]) => {
    lerpMorphTarget(group, targetName, value, speed);
  });
};

/**
 * Réinitialise tous les morph targets (sauf les yeux)
 * @param {THREE.Group} group
 * @param {Object} morphTargetDictionary
 * @param {number} speed
 */
export const resetMorphTargets = (
  group,
  morphTargetDictionary,
  speed = 0.1,
) => {
  if (!group || !morphTargetDictionary) return;

  Object.keys(morphTargetDictionary).forEach((key) => {
    if (!EYE_MORPH_TARGETS.includes(key)) {
      lerpMorphTarget(group, key, 0, speed);
    }
  });
};

/**
 * Applique un viseme pour le lip sync
 * @param {THREE.Group} group
 * @param {string} viseme - Nom du viseme
 * @param {number} speed
 */
export const applyViseme = (group, viseme, speed = 0.2) => {
  if (!group || !viseme) return;
  lerpMorphTarget(group, viseme, 1, speed);
};

/**
 * Réinitialise tous les visemes
 * @param {THREE.Group} group
 * @param {Array<string>} visemes - Liste des visemes à réinitialiser
 * @param {number} speed
 */
export const resetVisemes = (group, visemes, speed = 0.1) => {
  if (!group || !visemes) return;

  visemes.forEach((viseme) => {
    lerpMorphTarget(group, viseme, 0, speed);
  });
};

/**
 * Obtient tous les morph targets disponibles
 * @param {Object} nodes - Nodes de la scène
 * @returns {Object} - Dictionnaire des morph targets
 */
export const getMorphTargetDictionary = (nodes) => {
  // Essayer d'obtenir depuis EyeLeft, Wolf3D_Head, ou le premier mesh avec morph targets
  if (nodes.EyeLeft?.morphTargetDictionary) {
    return nodes.EyeLeft.morphTargetDictionary;
  }

  if (nodes.Wolf3D_Head?.morphTargetDictionary) {
    return nodes.Wolf3D_Head.morphTargetDictionary;
  }

  // Chercher dans tous les nodes
  for (const key in nodes) {
    if (nodes[key]?.morphTargetDictionary) {
      return nodes[key].morphTargetDictionary;
    }
  }

  return {};
};

/**
 * Valide si un morph target existe
 * @param {Object} morphTargetDictionary
 * @param {string} targetName
 * @returns {boolean}
 */
export const hasMorphTarget = (morphTargetDictionary, targetName) => {
  return morphTargetDictionary && targetName in morphTargetDictionary;
};
