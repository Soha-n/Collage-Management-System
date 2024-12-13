import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter ,Routes,Route} from 'react-router-dom';
import View from './pages/view';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);


root.render(
  <BrowserRouter>
 <Routes>
      <Route path="/" element={<View />} />
      <Route path="/login" element={<App />} />
    </Routes>
  </BrowserRouter>
);  