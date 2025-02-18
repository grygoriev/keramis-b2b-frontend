// src/routes/AppRouter.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import { BaseLayout,PublicLayout, AdminLayout,  ClientLayout } from '../layouts';

// Pages
import {
	AdminDashboard,
	ClientDashboard,
	OrdersPage,
	SolutionsPage,
	Home,
	Login,
	HelpPage,
	CategoryPage,
	ProductPage
} from '../pages';

// Guards
import RequireAdmin from './RequireAdmin';
import RequireClient from './RequireClient';

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				{/*
          1) Базовый лейаут (Header/Footer) – всё внутри него,
             но разбиваем публичные (PublicLayout) и admin/client.
        */}
				<Route path="/" element={<BaseLayout />}>
					{/* ПУБЛИЧНЫЕ (с меню категорий) */}
					<Route element={<PublicLayout />}>
						<Route index element={<Home />} />
						<Route path="login" element={<Login />} />
						<Route path="help" element={<HelpPage />} />
						<Route path="solutions" element={<SolutionsPage />} />
						<Route path="orders" element={<OrdersPage />} />

						<Route path="category/:slug" element={<CategoryPage />} />
						<Route path="product/:slug" element={<ProductPage />} />
					</Route>

					{/* АДМИН (без публичного меню) */}
					<Route
						path="admin"
						element={
							<RequireAdmin>
								<AdminLayout />
							</RequireAdmin>
						}
					>
						<Route index element={<AdminDashboard />} />
						{/* ...другие admin pages */}
					</Route>

					{/* КЛИЕНТ (без публичного меню) */}
					<Route
						path="client"
						element={
							<RequireClient>
								<ClientLayout />
							</RequireClient>
						}
					>
						<Route index element={<ClientDashboard />} />
						{/* ...другие client pages */}
					</Route>
				</Route>

				{/* 404 */}
				<Route path="*" element={<div>404 Not Found</div>} />
			</Routes>
		</BrowserRouter>
	);
}
