// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css';
import { App } from './App.jsx';

// Импортируем i18n, чтобы инициализация произошла
import './i18n';

// Ант Дизайн стили
import 'antd/dist/reset.css';
import { Provider } from 'react-redux';
import store from './store'; // ./store/index.js

createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<App />
	</Provider>,
);
