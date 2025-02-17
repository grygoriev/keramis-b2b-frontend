import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClientLayout, AdminLayout, RootLayout } from '../layouts';
import {
	AdminDashboard,
	ClientDashboard,
	OrdersPage,
	SolutionsPage,
	Home,
	Login,
	HelpPage,
	CategoryPage, ProductPage,
} from '../pages';
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
					{/* Страница категории */}
					<Route path="/category/:slug" element={<CategoryPage />} />
					{/* Страница товара */}
					<Route path="/product/:slug" element={<ProductPage />} />
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
