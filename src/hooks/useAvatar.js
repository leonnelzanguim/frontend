// src/hooks/useAvatar.js
import { useContext } from "react";
import { AvatarContext } from "../context/contexts.js";

export const useAvatar = () => {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error("useAvatar must be used within an AvatarProvider");
  }

  return context;
};
