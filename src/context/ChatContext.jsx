// // src/context/ChatContext.jsx
// import { useState, useCallback } from "react";
// import { ChatContext } from "./contexts.js";
// import { chatApi } from "../api/chat.api.js";
// import { formatErrorMessage } from "../api/errors.js";

// // ✅ N'exporte QUE le composant Provider
// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const sendMessage = useCallback(async (text) => {
//     if (!text?.trim()) {
//       setError("Please enter a message");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await chatApi.sendMessage(text);

//       if (response.success && response.messages) {
//         setMessages((prev) => [...prev, ...response.messages]);
//       } else {
//         throw new Error("Invalid response format");
//       }
//     } catch (err) {
//       const errorMessage = formatErrorMessage(err);
//       setError(errorMessage);
//       console.error("Chat error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const removeFirstMessage = useCallback(() => {
//     setMessages((prev) => prev.slice(1));
//   }, []);

//   const clearMessages = useCallback(() => {
//     setMessages([]);
//     setError(null);
//   }, []);

//   const clearError = useCallback(() => {
//     setError(null);
//   }, []);

//   const retryFirstMessage = useCallback(() => {
//     if (messages.length > 0) {
//       const firstMessage = messages[0];
//       removeFirstMessage();
//       setMessages((prev) => [...prev, firstMessage]);
//     }
//   }, [messages, removeFirstMessage]);

//   const value = {
//     messages,
//     loading,
//     error,
//     sendMessage,
//     removeFirstMessage,
//     clearMessages,
//     clearError,
//     retryFirstMessage,
//   };

//   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// };

// src/context/ChatContext.jsx
import { useState, useCallback } from "react";
import { ChatContext } from "./contexts.js"; // ✅ IMPORTER depuis contexts.js
import { chatApi } from "../api/chat.api.js";
import { formatErrorMessage } from "../api/errors.js";
import { audioToBase64 } from "../utils/audio.js";

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim()) {
      setError("Please enter a message");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await chatApi.sendMessage(text);

      if (response.success && response.messages) {
        setMessages((prev) => [...prev, ...response.messages]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendAudioMessage = useCallback(async (audioBlob) => {
    if (!audioBlob) {
      setError("No audio to send");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const audioBase64 = await audioToBase64(audioBlob);
      const response = await chatApi.sendAudioMessage(audioBase64);

      if (response.success && response.messages) {
        setMessages((prev) => [...prev, ...response.messages]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      console.error("Audio message error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFirstMessage = useCallback(() => {
    setMessages((prev) => prev.slice(1));
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retryFirstMessage = useCallback(() => {
    if (messages.length > 0) {
      const firstMessage = messages[0];
      removeFirstMessage();
      setMessages((prev) => [...prev, firstMessage]);
    }
  }, [messages, removeFirstMessage]);

  const value = {
    messages,
    loading,
    error,
    sendMessage,
    sendAudioMessage,
    removeFirstMessage,
    clearMessages,
    clearError,
    retryFirstMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
