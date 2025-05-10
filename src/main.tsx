
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const root = document.getElementById("root");

// Make sure we have a root element to render into
if (root) {
  createRoot(root).render(<App />);
} else {
  console.error("Root element not found. Cannot mount React application.");
}
