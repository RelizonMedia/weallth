
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Improved root element detection and error handling
const root = document.getElementById("root");

// Add detailed error logging
if (!root) {
  console.error("Critical Error: Root element not found. Cannot mount React application.");
  // Create a fallback element to show error
  const errorDiv = document.createElement('div');
  errorDiv.style.padding = '20px';
  errorDiv.style.margin = '20px';
  errorDiv.style.border = '1px solid red';
  errorDiv.innerHTML = `
    <h1>Application Error</h1>
    <p>The application could not initialize properly. The root element was not found.</p>
    <p>Please try refreshing the page or contact support.</p>
  `;
  document.body.appendChild(errorDiv);
} else {
  try {
    console.log("Initializing Weallth application...");
    const reactRoot = createRoot(root);
    reactRoot.render(<App />);
    console.log("Weallth application mounted successfully");
  } catch (error) {
    console.error("Failed to render application:", error);
    root.innerHTML = `
      <div style="padding: 20px; margin: 20px; border: 1px solid red;">
        <h1>Application Error</h1>
        <p>The application could not initialize properly.</p>
        <p>Please try refreshing the page or contact support.</p>
        <p>Error details: ${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
}
