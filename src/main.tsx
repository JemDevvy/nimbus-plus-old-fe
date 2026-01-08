import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_CLIENT_ID}>
        <StyledEngineProvider enableCssLayer >
          <GlobalStyles styles="@layer theme, base, mui, components, utilities;"/>
          <App />
        </StyledEngineProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
