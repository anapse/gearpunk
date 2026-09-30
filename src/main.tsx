import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { runSanityTests } from './game/tests';

// Run core logic verification
if (import.meta.env.DEV) {
  runSanityTests();
}

createRoot(document.getElementById('root')!).render(<App />);
