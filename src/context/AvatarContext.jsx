// // src/context/AvatarContext.jsx
// import { useState, useCallback, useMemo } from "react";
// import { AvatarContext } from "./contexts.js";
// import { useChat } from "../hooks/useChat.js";

// // ✅ N'exporte QUE le composant Provider
// export const AvatarProvider = ({ children }) => {
//   const { messages, removeFirstMessage } = useChat();
//   const [cameraZoomed, setCameraZoomed] = useState(true);

//   const currentMessage = useMemo(() => {
//     return messages.length > 0 ? messages[0] : null;
//   }, [messages]);

//   const isPlaying = useMemo(() => {
//     return currentMessage !== null;
//   }, [currentMessage]);

//   const onMessagePlayed = useCallback(() => {
//     removeFirstMessage();
//   }, [removeFirstMessage]);

//   const toggleCamera = useCallback(() => {
//     setCameraZoomed((prev) => !prev);
//   }, []);

//   const stopCurrentMessage = useCallback(() => {
//     removeFirstMessage();
//   }, [removeFirstMessage]);

//   const value = {
//     currentMessage,
//     cameraZoomed,
//     isPlaying,
//     onMessagePlayed,
//     toggleCamera,
//     setCameraZoomed,
//     stopCurrentMessage,
//   };

//   return (
//     <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
//   );
// };

// src/context/AvatarContext.jsx
import { useState, useCallback, useMemo } from "react";
import { AvatarContext } from "./contexts.js"; // ✅ IMPORTER depuis contexts.js
import { useChat } from "../hooks/useChat.js";

export const AvatarProvider = ({ children }) => {
  const { messages, removeFirstMessage } = useChat();
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const currentMessage = useMemo(() => {
    return messages.length > 0 ? messages[0] : null;
  }, [messages]);

  const isPlaying = useMemo(() => {
    return currentMessage !== null;
  }, [currentMessage]);

  const onMessagePlayed = useCallback(() => {
    removeFirstMessage();
  }, [removeFirstMessage]);

  const toggleCamera = useCallback(() => {
    setCameraZoomed((prev) => !prev);
  }, []);

  const stopCurrentMessage = useCallback(() => {
    removeFirstMessage();
  }, [removeFirstMessage]);

  const value = {
    currentMessage,
    cameraZoomed,
    isPlaying,
    onMessagePlayed,
    toggleCamera,
    setCameraZoomed,
    stopCurrentMessage,
  };

  return (
    <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
  );
};
