import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx'
import QrCard from './components/cards/QrCard.jsx';

createRoot(document.getElementById('root')).render(
   <BrowserRouter>
      <Routes>
         <Route path="/" element={<App />} />
         <Route path='/print/:file' element={<QrCard />} />
      </Routes>
   </BrowserRouter>
)
