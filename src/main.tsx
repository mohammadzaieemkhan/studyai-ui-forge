
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx: Starting to render application");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Failed to find the root element");
  throw new Error("Failed to find the root element");
}

console.log("Main.tsx: Root element found, mounting App");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log("Main.tsx: App mounted");
