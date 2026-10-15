import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { view } from "@forge/bridge";
import App from "./App.tsx";
import "./styles/index.css";
import type { ForgeAppContext } from "./types/forge.type.ts";

async function bootstrap() {
  try {
    const context = (await view.getContext()) as ForgeAppContext;

    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App context={context} />
      </StrictMode>,
    );
  } catch (error) {
    console.error("Error bootstrapping the app:", error);
    createRoot(document.getElementById("root")!).render(
      <div role="alert">Failed to load KnowledgeFlow.</div>,
    );
  }
}

bootstrap();
