import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './app/routes/AppRoutes';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);
