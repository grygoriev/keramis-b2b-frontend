import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import AdminLayout from '../layouts/AdminLayout';
import ClientLayout from '../layouts/ClientLayout';

import Home from '../pages/Home';
import Login from '../pages/Login';
import HelpPage from '../pages/HelpPage';
import SolutionsPage from '../pages/SolutionsPage';
import OrdersPage from '../pages/OrdersPage';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ClientDashboard } from '../pages/ClientDashboard'; // пример
import RequireAdmin from './RequireAdmin';
import RequireClient from './RequireClient';

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				{/* 1) Внешний route с RootLayout: Header/Footer */}
				<Route path="/" element={<RootLayout />}>
					{/* Публичные / гостевые страницы */}
					<Route index element={<Home />} />
					<Route path="login" element={<Login />} />
					<Route path="help" element={<HelpPage />} />
					<Route path="solutions" element={<SolutionsPage />} />
					<Route path="orders" element={<OrdersPage />} />

					{/* 2) Админский layout + вложенные страницы */}
					<Route
						path="admin"
						element={
							<RequireAdmin>
								<AdminLayout />
							</RequireAdmin>
						}
					>
						{/* Внутри админ layout – админские страницы */}
						<Route index element={<AdminDashboard />} />
						{/* <Route path="products" element={<ProductsPage />} ... */}
					</Route>

					{/* 3) Клиентский layout + вложенные страницы */}
					<Route
						path="client"
						element={
							<RequireClient>
								<ClientLayout />
							</RequireClient>
						}
					>
						{/* Внутри клиент layout – клиентские страницы */}
						<Route index element={<ClientDashboard />} />
						{/* <Route path="cart" element={<CartPage />} ... */}
					</Route>
				</Route>

				{/* 404 */}
				<Route path="*" element={<div>404 Not Found</div>} />
			</Routes>
		</BrowserRouter>
	);
}
