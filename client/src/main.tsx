import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import App from "./App.tsx";
import "../app/css/globals.css";
import i18n from "./i18n.ts";
import "./index.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "./components/ui/sidebar.tsx";

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <SidebarProvider>
        <BrowserRouter>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </SidebarProvider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
