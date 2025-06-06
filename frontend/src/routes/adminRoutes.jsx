// src/routes/adminRoutes.jsx
import {
	AdminDashboard,
	OrderListPage,
	ClientsPage,
	ClientPage,
	AdminDiscountsPage,
	ReturnsPage,
	PriceControlPage,
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
		element: <ClientsPage />,
	},
	{
		path: 'clients/:id',
		element: <ClientPage />,
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
