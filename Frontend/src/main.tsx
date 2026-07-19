
// @ts-ignore
globalThis.VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);
  