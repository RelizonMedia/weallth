
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set default theme to light
localStorage.setItem("theme", "light");
localStorage.setItem("darkMode", "false");

// Get the current hostname for domain-specific logging
const currentHostname = window.location.hostname;
const isPreviewDomain = currentHostname.includes('preview--') || 
                        currentHostname.includes('lovable.app') || 
                        currentHostname === 'weallth.ai';

// Log application startup with domain information
console.log(`Initializing Weallth application on ${currentHostname}...`);
console.log(`Current theme: ${localStorage.getItem("theme") || "light"}`);
console.log(`Is preview or production domain: ${isPreviewDomain}`);

// Force HTTPS redirection on production domain
if (currentHostname === 'weallth.ai' && window.location.protocol !== 'https:') {
  window.location.href = 'https://weallth.ai' + window.location.pathname + window.location.search;
}

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
    <p>Domain: ${currentHostname}</p>
  `;
  document.body.appendChild(errorDiv);
} else {
  try {
    // Apply light theme to document
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    
    // Force viewport setup for all domains
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Force document and body styles for proper rendering
    document.documentElement.style.height = '100%';
    document.body.style.minHeight = '100%';
    document.body.style.margin = '0';
    
    console.log(`Mounting Weallth application with light theme on ${currentHostname}...`);
    const reactRoot = createRoot(root);
    reactRoot.render(<App />);
    console.log("Weallth application mounted successfully");
  } catch (error) {
    console.error(`Failed to render application on ${currentHostname}:`, error);
    root.innerHTML = `
      <div style="padding: 20px; margin: 20px; border: 1px solid red;">
        <h1>Application Error</h1>
        <p>The application could not initialize properly.</p>
        <p>Please try refreshing the page or contact support.</p>
        <p>Domain: ${currentHostname}</p>
        <p>Error details: ${error instanceof Error ? error.message : String(error)}</p>
      </div>
    `;
  }
}
