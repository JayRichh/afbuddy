import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const app = document.getElementById('app') as HTMLElement;

if (app) {
  const container = createRoot(app);
  container.render(<App />);
}
