import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import AudioProvider from './context/AudioContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AudioProvider>
    <App />
  </AudioProvider>
);
