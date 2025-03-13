// src/routes/clientRoutes.jsx
import {
	ClientDashboard,
	OrderListPage,
	CartListPage,
	CartPage,
	ApiTokenPage,
} from '../pages';

export const clientRoutes = [
	{
		path: 'dashboard',
		index: true,
		element: <ClientDashboard />,
	},
	{
		path: 'my-orders',
		element: <OrderListPage />,
	},
	{
		path: 'carts',
		element: <CartListPage />,
	},
	{
		path: 'carts/:cartId',
		element: <CartPage />,
	},
	{
		path: 'api-token',
		element: <ApiTokenPage />,
	},
];
