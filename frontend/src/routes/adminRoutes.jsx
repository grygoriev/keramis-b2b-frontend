// src/routes/adminRoutes.jsx
import {
	AdminDashboard,
	OrderListPage,
	AdminClientsPage,
	AdminDiscountsPage,
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
		path: 'clients',
		element: <AdminClientsPage />,
	},
	{
		path: 'discounts',
		element: <AdminDiscountsPage />,
	},
];
