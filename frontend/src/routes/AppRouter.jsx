// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import { BaseLayout, PublicLayout, AdminLayout, ClientLayout } from '../layouts';

// Guards
import RequireAdmin from './RequireAdmin';
import RequireClient from './RequireClient';

// Дополнительно
import { NotFoundPage, ForbiddenPage } from '../pages';
// Импортируем наши массивы
import { adminRoutes } from './adminRoutes.jsx';
import { clientRoutes } from './clientRoutes.jsx';
import { publicRoutes } from './publicRoutes.jsx';

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<BaseLayout />}>
					{/* PUBLIC (с меню категорий) */}
					<Route element={<PublicLayout />}>
						{/* Мапим publicRoutes */}
						{publicRoutes.map(({ path, index, element }, i) => (
							<Route
								key={i}
								path={path}
								index={!!index}
								element={element}
							/>
						))}
					</Route>

					{/* ADMIN */}
					<Route
						path="admin"
						element={
							<RequireAdmin>
								<AdminLayout />
							</RequireAdmin>
						}
					>
						{adminRoutes.map(({ path, index, element }, i) => (
							<Route
								key={i}
								path={path}
								index={!!index}
								element={element}
							/>
						))}
					</Route>

					{/* CLIENT */}
					<Route
						path="client"
						element={
							<RequireClient>
								<ClientLayout />
							</RequireClient>
						}
					>
						{clientRoutes.map(({ path, index, element }, i) => (
							<Route
								key={i}
								path={path}
								index={!!index}
								element={element}
							/>
						))}
					</Route>
				</Route>

				{/* Страница 403 */}
				<Route path="/forbidden" element={<ForbiddenPage />} />

				{/* 404 */}
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}
