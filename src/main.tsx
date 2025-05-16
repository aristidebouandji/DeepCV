import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { CVProvider } from './context/CVContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <CVProvider>
        <App />
      </CVProvider>
    </Router>
  </StrictMode>
);