// // src/components/chat/ChatInput.jsx
// import { useState } from "react";
// import { Input } from "../ui/Input.jsx";
// import { Button } from "../ui/Button.jsx";
// import { useChat } from "../../hooks/useChat.js";
// import { useAvatar } from "../../hooks/useAvatar.js";

// export const ChatInput = () => {
//   const [inputValue, setInputValue] = useState("");
//   const { sendMessage, loading } = useChat();
//   const { isPlaying } = useAvatar();

//   const handleSubmit = () => {
//     if (!inputValue.trim() || loading || isPlaying) return;

//     sendMessage(inputValue);
//     setInputValue("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="flex items-center gap-2 w-full">
//       {/* ✅ Retirer max-w-screen-sm et mx-auto d'ici */}
//       <Input
//         placeholder="Type a message..."
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         onKeyDown={handleKeyDown}
//         disabled={loading || isPlaying}
//         className="flex-1"
//       />
//       <Button
//         onClick={handleSubmit}
//         disabled={loading || isPlaying || !inputValue.trim()}
//         variant="primary"
//       >
//         SEND
//       </Button>
//     </div>
//   );
// };

// export default ChatInput;
// src/components/chat/ChatInput.jsx
import { useState } from "react";
import { Input } from "../ui/Input.jsx";
import { Button } from "../ui/Button.jsx";
import { useChat } from "../../hooks/useChat.js";
import { useAvatar } from "../../hooks/useAvatar.js";
import { useAudioRecorder } from "../../hooks/useAudioRecorder.js";
import { formatTime } from "../../utils/audio.js";

export const ChatInput = () => {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage, sendAudioMessage, loading } = useChat();
  const { isPlaying } = useAvatar();

  const {
    isRecording,
    recordingTime,
    audioBlob,
    error: recordingError, // ✅ On va l'utiliser maintenant
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
  } = useAudioRecorder();

  const handleSubmit = () => {
    if (!inputValue.trim() || loading || isPlaying) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSendAudio = async () => {
    if (audioBlob) {
      await sendAudioMessage(audioBlob);
      resetRecording();
    }
  };

  const handleCancelAudio = () => {
    cancelRecording();
  };

  // ✅ Afficher l'erreur d'enregistrement si elle existe
  if (recordingError) {
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 bg-red-500 bg-opacity-90 text-white p-4 rounded-md flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <span>{recordingError}</span>
        </div>
        <Button onClick={resetRecording} variant="secondary">
          OK
        </Button>
      </div>
    );
  }

  // Si on a un audio enregistré, afficher les options
  if (audioBlob && !isRecording) {
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 bg-white bg-opacity-50 backdrop-blur-md p-4 rounded-md flex items-center gap-3">
          {/* Icône audio */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
          <span className="text-gray-800 italic">
            Audio message ({formatTime(recordingTime)})
          </span>
        </div>

        {/* Bouton Annuler */}
        <button
          onClick={handleCancelAudio}
          className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-md transition-colors"
          aria-label="Cancel audio"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Bouton Envoyer audio */}
        <Button
          onClick={handleSendAudio}
          disabled={loading || isPlaying}
          variant="primary"
        >
          SEND
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Input texte */}
      <Input
        placeholder={isRecording ? "Recording..." : "Type a message..."}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading || isPlaying || isRecording}
        className="flex-1"
      />

      {/* Bouton Microphone */}
      <button
        onClick={handleMicClick}
        disabled={loading || isPlaying}
        className={`p-4 rounded-md transition-colors ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 animate-pulse"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white ${loading || isPlaying ? "cursor-not-allowed opacity-30" : ""}`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          // Icône Stop
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z"
            />
          </svg>
        ) : (
          // Icône Micro
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
            />
          </svg>
        )}
      </button>

      {/* Afficher le temps d'enregistrement */}
      {isRecording && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-md font-mono">
          {formatTime(recordingTime)}
        </div>
      )}

      {/* Bouton Send (texte) */}
      {!isRecording && (
        <Button
          onClick={handleSubmit}
          disabled={loading || isPlaying || !inputValue.trim()}
          variant="primary"
        >
          SEND
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
