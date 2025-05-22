// src/routes/adminRoutes.jsx
import {
	AdminDashboard,
	OrderListPage,
	AdminClientsPage,
	AdminDiscountsPage, ReturnsPage, PriceControlPage,
} from '../pages';

export const adminRoutes = [
	{
		path: 'dashboard',
		index: true,
		element: <AdminDashboard />,
	},
	{
		path: 'my-orders',
		element: <OrderListPage />,
	},
	{
		path: 'returns',
		element: <ReturnsPage />,
	},
	{
		path: 'clients',
		element: <AdminClientsPage />,
	},
	{
		path: 'discounts',
		element: <AdminDiscountsPage />,
	},
	{
		path: 'price-control',
		element: <PriceControlPage />,
	},
];
