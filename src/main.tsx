import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/cantarell/400.css";
import "@fontsource/cantarell/700.css";
import App from "./App";
import { AppContainer } from "./components/ui/app-container";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppContainer>
      <App />
    </AppContainer>
  </React.StrictMode>,
);
