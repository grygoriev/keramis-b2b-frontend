// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import { BaseLayout, PublicLayout, AdminLayout, ClientLayout } from '../layouts/index.js';

// Pages (публичные, админские, клиентские)
import {
	AdminDashboard,
	ClientDashboard,
	SolutionsPage,
	Home,
	Login,
	HelpPage,
	CategoryPage,
	ProductPage,
	CartListPage,
	CartPage,
	OrderListPage,
	AdminClientsPage,
	AdminDiscountsPage,
	ApiTokenPage,
	NotFoundPage,
	ForbiddenPage,
	RegisterPage,
	PricesCatalogsPage,
	ContactsPage,
	AboutCompanyPage,
	DeliveryPage,
	GuaranteePage,
	PaymentPage,
	ServiceSupportPage,
	CertificatesPage,
	CooperationPage,
} from '../pages/index.js';

// Guards
import RequireAdmin from './RequireAdmin.jsx';
import RequireClient from './RequireClient.jsx';

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				{/*
          1) BaseLayout – Header/Footer.
          2) PublicLayout – меню категорий.
          3) Admin/Client – без публичного меню.
        */}
				<Route path="/" element={<BaseLayout />}>
					{/* PUBLIC (с меню категорий) */}
					<Route element={<PublicLayout />}>
						<Route index element={<Home />} />
						<Route path="login" element={<Login />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="help" element={<HelpPage />} />
						<Route path="solutions" element={<SolutionsPage />} />
						<Route path="/prices-catalogs" element={<PricesCatalogsPage />} />
						<Route path="/contacts" element={<ContactsPage />} />
						<Route path="/about" element={<AboutCompanyPage />} />
						<Route path="/delivery" element={<DeliveryPage />} />
						<Route path="/guarantee" element={<GuaranteePage />} />
						<Route path="/payment" element={<PaymentPage />} />
						<Route path="/service-support" element={<ServiceSupportPage />} />
						<Route path="/certificates" element={<CertificatesPage />} />
						<Route path="/cooperation" element={<CooperationPage />} />

						{/* Категории/товары */}
						<Route path="category/:slug" element={<CategoryPage />} />
						<Route path="product/:slug" element={<ProductPage />} />
						{/* Поиск */}
						<Route path="/search" element={<CategoryPage />} />

						{/* Новые пути для корзин и заказов */}
						<Route path="carts" element={<CartListPage />} />
						<Route path="carts/:cartId" element={<CartPage />} />

						{/* Просмотр заказов (список), отличается от /orders? */}
						<Route path="my-orders" element={<OrderListPage />} />
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
						<Route index element={<AdminDashboard />} />
						<Route path="my-orders" element={<OrderListPage />} />
						<Route path="clients" element={<AdminClientsPage />} />
						<Route path="discounts" element={<AdminDiscountsPage />} />
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
						<Route index element={<ClientDashboard />} />
						<Route path="my-orders" element={<OrderListPage />} />
						<Route path="carts" element={<CartListPage />} />
						<Route path="carts/:cartId" element={<CartPage />} />
						<Route path="api-token" element={<ApiTokenPage />} />
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
