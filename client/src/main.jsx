import { Buffer } from "buffer";

// Polyfill for global object in browser environments
if (typeof global === "undefined") {
  window.global = window;
}

if (typeof window.Buffer === "undefined") {
  window.Buffer = Buffer;
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
