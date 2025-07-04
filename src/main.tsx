// main.tsx - Entry Point
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { MantineProvider } from '@mantine/core';
import 'bootstrap/dist/css/bootstrap.min.css';

// Render the root of the React app with Auth0 and Mantine providers
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Remove unsupported Mantine props for compatibility */}
    <MantineProvider>
      <Auth0Provider
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <App />
      </Auth0Provider>
    </MantineProvider>
  </StrictMode>
);