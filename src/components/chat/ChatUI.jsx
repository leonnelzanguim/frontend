// // src/components/chat/ChatUI.jsx
// import { ChatInput } from "./ChatInput.jsx";
// import { ChatControls } from "./ChatControls.jsx";
// import { useChat } from "../../hooks/useChat.js";

// export const ChatUI = ({ hidden = false }) => {
//   const { error, clearError } = useChat();

//   if (hidden) {
//     return null;
//   }

//   return (
//     <div className="fixed top-0 left-0 right-0 bottom-0 z-10 flex justify-between p-4 flex-col pointer-events-none">
//       {/* Header */}
//       <div className="self-start backdrop-blur-md bg-white bg-opacity-50 p-4 rounded-lg">
//         {/* Vous pouvez ajouter un titre ou logo ici */}
//       </div>

//       {/* Contrôles */}
//       <div className="w-full flex items-end justify-end">
//         <div className="pointer-events-auto">
//           <ChatControls />
//         </div>
//       </div>

//       {/* Input et erreurs */}
//       <div className="flex flex-col gap-4">
//         {/* Message d'erreur */}
//         {error && (
//           <div className="pointer-events-auto max-w-screen-sm w-full mx-auto">
//             <div className="bg-red-500 bg-opacity-90 backdrop-blur-md text-white p-4 rounded-md flex items-center justify-between">
//               <span>{error}</span>
//               <button
//                 onClick={clearError}
//                 className="ml-4 hover:text-gray-200"
//                 aria-label="Close error"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth={2}
//                   stroke="currentColor"
//                   className="w-5 h-5"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Input de chat */}
//         <div className="pointer-events-auto">
//           <ChatInput />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatUI;

// src/components/chat/ChatUI.jsx
import { ChatInput } from "./ChatInput.jsx";
import { ChatControls } from "./ChatControls.jsx";
import { useChat } from "../../hooks/useChat.js";

export const ChatUI = ({ hidden = false }) => {
  const { error, clearError } = useChat();

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-20 pointer-events-none">
      {/* 🔹 Controls à droite centrés verticalement */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-auto">
        <ChatControls />
      </div>

      {/* 🔹 Barre en bas */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-8">
        <div className="mx-auto w-full max-w-5xl pointer-events-auto">
          {error && (
            <div className="mb-4">
              <div className="bg-red-500 text-white p-4 rounded-md flex items-center justify-between">
                <span>{error}</span>
                <button onClick={clearError}>✕</button>
              </div>
            </div>
          )}

          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
