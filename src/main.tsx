/*⚙️ main.tsx — Your entry point

This is where the app boots up. It's responsible for:

    Finding the root HTML element (<div id="root">)

    Rendering the App component into the DOM

    Wrapping with any global providers (like React.StrictMode, ThemeProvider, etc.)
*/

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"; // should be global styles

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
