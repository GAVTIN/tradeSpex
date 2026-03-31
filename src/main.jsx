// ─── main.jsx ─────────────────────────────────────────────────────────────────
// Entry point. Wraps the app in:
//   <Provider store={store}>  — makes Redux state available to all components
//   <StrictMode>              — highlights potential issues in development
//
// This is where the React tree is mounted into the #root div in index.html.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      Provider makes the Redux store accessible to every component via
      useSelector() and useDispatch() hooks — no prop drilling needed.
    */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
