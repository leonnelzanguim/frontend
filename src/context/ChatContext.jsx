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
import { audioToBase64 } from "../utils/audio.js";

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Envoie un message texte via SSE.
   *
   * Phase A (~3s) : event:message.text  → message ajouté avec pending:true → Jack s'anime
   * Phase B (~9s) : event:message.audio → message mis à jour pending:false → Jack joue l'audio
   *
   * Utilise un tableau FIFO (pendingMessageIds) pour gérer plusieurs messages
   * (ex: intro avec 2 messages) sans conflit d'ID.
   */
  const sendMessage = useCallback(async (text) => {
    if (!text?.trim()) {
      setError("Please enter a message");
      return;
    }

    setLoading(true);
    setError(null);

    // FIFO queue : associe chaque message.text à son message.audio correspondant
    const pendingMessageIds = [];

    await chatApi.streamMessage(text, {
      onEvent: ({ eventName, payload }) => {
        if (eventName === "message.text") {
          const id = crypto.randomUUID();
          pendingMessageIds.push(id);
          setMessages((prev) => [
            ...prev,
            {
              id,
              text: payload.text,
              facialExpression: payload.facialExpression,
              animation: payload.animation,
              audio: null,
              lipsync: null,
              pending: true,
            },
          ]);
        } else if (eventName === "message.audio") {
          const id = pendingMessageIds.shift();
          if (id) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === id
                  ? {
                      ...m,
                      audio: payload.audio,
                      lipsync: payload.lipsync,
                      pending: false,
                    }
                  : m,
              ),
            );
          }
        }
      },
      onError: (msg) => {
        console.error("Chat stream error:", msg);
        setError(msg);
        setLoading(false);
      },
      onDone: () => {
        setLoading(false);
      },
    });
  }, []);

  /**
   * Envoie un message audio (blob) via SSE.
   * Même logique deux phases que sendMessage.
   * L'événement 'transcription' est reçu en premier (avant message.text).
   */
  const sendAudioMessage = useCallback(async (audioBlob) => {
    if (!audioBlob) {
      setError("No audio to send");
      return;
    }

    setLoading(true);
    setError(null);

    let audioBase64;
    try {
      audioBase64 = await audioToBase64(audioBlob);
    } catch (err) {
      console.error("Audio conversion error:", err);
      setError("Failed to process audio");
      setLoading(false);
      return;
    }

    const pendingMessageIds = [];

    await chatApi.streamAudioMessage(audioBase64, {
      onEvent: ({ eventName, payload }) => {
        if (eventName === "message.text") {
          const id = crypto.randomUUID();
          pendingMessageIds.push(id);
          setMessages((prev) => [
            ...prev,
            {
              id,
              text: payload.text,
              facialExpression: payload.facialExpression,
              animation: payload.animation,
              audio: null,
              lipsync: null,
              pending: true,
            },
          ]);
        } else if (eventName === "message.audio") {
          const id = pendingMessageIds.shift();
          if (id) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === id
                  ? {
                      ...m,
                      audio: payload.audio,
                      lipsync: payload.lipsync,
                      pending: false,
                    }
                  : m,
              ),
            );
          }
        }
        // event 'transcription' ignoré ici (pas d'affichage dans l'UI pour l'instant)
      },
      onError: (msg) => {
        console.error("Audio stream error:", msg);
        setError(msg);
        setLoading(false);
      },
      onDone: () => {
        setLoading(false);
      },
    });
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
