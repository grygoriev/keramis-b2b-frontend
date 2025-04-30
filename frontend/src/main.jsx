// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import './index.css';
import './styles/responsive.css';
import { App } from './App.jsx';

// Импортируем i18n, чтобы инициализация произошла
import './i18n.js';

// Ант Дизайн стили
import 'antd/dist/reset.css';
import { Provider } from 'react-redux';
import store from './store/index.js';
import { SideMenuProvider, MenuStackProvider } from './contexts';

createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<MenuStackProvider>
			<SideMenuProvider>
				<App />
			</SideMenuProvider>
		</MenuStackProvider>
	</Provider>,
);
