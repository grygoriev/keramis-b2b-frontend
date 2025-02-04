import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import AdminLayout from '../layouts/AdminLayout';
import ClientLayout from '../layouts/ClientLayout';
import { AdminDashboard } from '../pages/AdminDashboard';
import RequireAdmin from './RequireAdmin';
import RequireClient from './RequireClient';

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Публичные */}
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />

				{/* Админские */}
				<Route
					path="/admin/*"
					element={
						<RequireAdmin>
							<AdminLayout />
						</RequireAdmin>
					}
				>
					<Route index element={<AdminDashboard />} />
					{/* <Route path="products" ... /> */}
				</Route>

				{/* Клиентские */}
				<Route
					path="/client/*"
					element={
						<RequireClient>
							<ClientLayout />
						</RequireClient>
					}
				>
					<Route index element={<div>Client Dashboard</div>} />
					{/* <Route path="catalog" ... /> */}
				</Route>

				{/* 404 */}
				<Route path="*" element={<div>404 Not Found</div>} />
			</Routes>
		</BrowserRouter>
	);
}
