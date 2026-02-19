// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ErrorBoundary } from "./components/layout/ErrorBoundary.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { AvatarProvider } from "./context/AvatarContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChatProvider>
        <AvatarProvider>
          <App />
        </AvatarProvider>
      </ChatProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
