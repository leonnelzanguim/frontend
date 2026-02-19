// src/components/chat/ChatControls.jsx
import { Button } from "../ui/Button.jsx";
import { useAvatar } from "../../hooks/useAvatar.js"; // ✅ Depuis hooks

export const ChatControls = () => {
  const { cameraZoomed, toggleCamera } = useAvatar();

  const toggleGreenScreen = () => {
    const body = document.querySelector("body");
    if (body.classList.contains("greenScreen")) {
      body.classList.remove("greenScreen");
    } else {
      body.classList.add("greenScreen");
    }
  };

  return (
    <div className="flex flex-col items-end justify-center gap-4">
      {/* Bouton Zoom */}
      <Button
        onClick={toggleCamera}
        variant="icon"
        aria-label={cameraZoomed ? "Zoom out" : "Zoom in"}
      >
        {cameraZoomed ? (
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"
            />
          </svg>
        ) : (
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
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"
            />
          </svg>
        )}
      </Button>

      {/* Bouton Green Screen */}
      <Button
        onClick={toggleGreenScreen}
        variant="icon"
        aria-label="Toggle green screen"
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
            d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </Button>
    </div>
  );
};

export default ChatControls;
