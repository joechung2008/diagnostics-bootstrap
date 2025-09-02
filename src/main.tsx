import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import reportWebVitals from "./reportWebVitals.ts";

export function initializeApp() {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(
      <StrictMode>
        <App />
      </StrictMode>
    );

    reportWebVitals(console.log);
  } else {
    console.error("Root element not found");
  }
}

// Initialize the app when this module is imported
initializeApp();
