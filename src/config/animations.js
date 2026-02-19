// src/config/animations.js
// Configuration des animations Mixamo

export const ANIMATION_PATHS = {
  IDLE: "/animations/Idle.fbx",
  TALKING: "/animations/Talking.fbx",
  GREETING: "/animations/Standing Greeting.fbx",
  ANGRY: "/animations/Angry Gesture.fbx",
  ARGUING: "/animations/Standing Arguing.fbx",
  SITTING_TALKING: "/animations/Sitting Talking.fbx",
};

export const ANIMATION_NAMES = {
  IDLE: "Idle",
  TALKING: "Talking",
  GREETING: "Greeting",
  ANGRY: "Angry",
  ARGUING: "StandingArguing",
  SITTING_TALKING: "TalkingSitting",
};

// Mapping message.animation → nom d'animation
export const ANIMATION_MAPPING = {
  Idle: ANIMATION_NAMES.IDLE,
  Talking: ANIMATION_NAMES.TALKING,
  Greeting: ANIMATION_NAMES.GREETING,
  Angry: ANIMATION_NAMES.ANGRY,
  StandingArguing: ANIMATION_NAMES.ARGUING,
  TalkingSitting: ANIMATION_NAMES.SITTING_TALKING,
};

// Animation par défaut
export const DEFAULT_ANIMATION = ANIMATION_NAMES.IDLE;

// Validation
export const isValidAnimation = (animation) => {
  return Object.values(ANIMATION_NAMES).includes(animation);
};

// Obtenir le nom d'animation avec fallback
export const getAnimationName = (animation) => {
  return ANIMATION_MAPPING[animation] || DEFAULT_ANIMATION;
};
