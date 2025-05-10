
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
const isProductionDomain = currentHostname === 'weallth.ai';

// Log application startup with domain information
console.log(`Initializing Weallth application on ${currentHostname}...`);
console.log(`Current theme: ${localStorage.getItem("theme") || "light"}`);
console.log(`Is preview or production domain: ${isPreviewDomain}`);
console.log(`Is production domain: ${isProductionDomain}`);

// Force HTTPS redirection on production domain
if (isProductionDomain && window.location.protocol !== 'https:') {
  window.location.href = 'https://weallth.ai' + window.location.pathname + window.location.search;
}

// Create app fallback content in case of critical render failure
const createFallbackContent = (error: any) => {
  return `
    <div style="padding: 20px; margin: 20px; font-family: system-ui, -apple-system, sans-serif;">
      <h1>Weallth</h1>
      <p>We're sorry, but there was a problem loading the application.</p>
      <p>Please try:</p>
      <ul>
        <li>Refreshing the page</li>
        <li>Clearing your browser cache</li>
        <li>Trying a different browser</li>
      </ul>
      <p>Error details: ${error instanceof Error ? error.message : String(error)}</p>
      <p>Domain: ${currentHostname}</p>
      <p><a href="/auth" style="color: #4f46e5; text-decoration: underline;">Go to login page</a></p>
    </div>
  `;
};

// Production domain specific fallback
const createProductionFallback = () => {
  return `
    <div style="padding: 20px; margin: 20px; font-family: system-ui, -apple-system, sans-serif; text-align: center; max-width: 500px; margin: 0 auto;">
      <h1 style="color: #6366f1;">Weallth</h1>
      <h2 style="margin-bottom: 20px;">Track and improve your wellness journey</h2>
      <div style="margin-bottom: 30px;">
        <p>Welcome to Weallth, your personal wellness tracker.</p>
        <p style="margin-top: 10px;">Please sign in or create an account to continue.</p>
      </div>
      <a href="/auth" style="display: inline-block; background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Sign in / Register</a>
    </div>
  `;
};

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
  
  if (isProductionDomain) {
    errorDiv.innerHTML = createProductionFallback();
  } else {
    errorDiv.innerHTML = `
      <h1>Application Error</h1>
      <p>The application could not initialize properly. The root element was not found.</p>
      <p>Please try refreshing the page or contact support.</p>
      <p>Domain: ${currentHostname}</p>
      <p><a href="/auth" style="color: blue;">Go to login page</a></p>
    `;
  }
  
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
    
    // Try to render using React
    try {
      const reactRoot = createRoot(root);
      reactRoot.render(<App />);
      console.log("Weallth application mounted successfully");
      
      // For production domain, ensure a navigation is possible to auth
      if (isProductionDomain) {
        // Add a backup navigation option after a brief delay
        setTimeout(() => {
          const hasContent = document.body.innerText.length > 100;
          if (!hasContent) {
            console.log("Detected potential blank page on production domain - adding fallback links");
            const navDiv = document.createElement('div');
            navDiv.style.position = 'fixed';
            navDiv.style.bottom = '20px';
            navDiv.style.right = '20px';
            navDiv.style.padding = '10px';
            navDiv.style.backgroundColor = 'rgba(255,255,255,0.8)';
            navDiv.style.borderRadius = '8px';
            navDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navDiv.innerHTML = `
              <strong>Navigation:</strong>
              <div style="margin-top: 8px;">
                <a href="/auth" style="display: block; padding: 8px 16px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 4px; text-align: center;">Sign In / Register</a>
              </div>
            `;
            document.body.appendChild(navDiv);
          }
        }, 2000);
      }
    } catch (reactError) {
      console.error(`React render error on ${currentHostname}:`, reactError);
      
      if (isProductionDomain) {
        // Special handling for production domain - just show auth link
        root.innerHTML = createProductionFallback();
      } else {
        // Create a more detailed fallback UI in case of React failure
        root.innerHTML = createFallbackContent(reactError);
      }
      
      // Try to report the error (can be expanded with analytics)
      try {
        console.error("React render error:", reactError);
      } catch (e) {
        // Silent catch for any reporting errors
      }
    }
  } catch (error) {
    console.error(`Critical initialization error on ${currentHostname}:`, error);
    if (isProductionDomain) {
      root.innerHTML = createProductionFallback();
    } else if (root) {
      root.innerHTML = createFallbackContent(error);
    }
  }
}
