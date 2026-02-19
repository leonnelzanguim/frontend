// src/context/contexts.js
import { createContext } from "react";

// ✅ Tous les contexts dans un seul fichier (non-composants)
export const ChatContext = createContext(null);
export const AvatarContext = createContext(null);
