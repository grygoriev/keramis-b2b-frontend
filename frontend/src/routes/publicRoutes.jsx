// src/routes/publicRoutes.jsx
import {
	SolutionsPage,
	Home,
	Login,
	HelpPage,
	CategoryPage,
	ProductPage,
	CartListPage,
	CartPage,
	OrderListPage,
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
} from '../pages';

export const publicRoutes = [
	{
		path: '/',
		index: true,
		element: <Home />,
	},
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/register',
		element: <RegisterPage />,
	},
	{
		path: '/help',
		element: <HelpPage />,
	},
	{
		path: '/solutions',
		element: <SolutionsPage />,
	},
	{
		path: '/prices-catalogs',
		element: <PricesCatalogsPage />,
	},
	{
		path: '/contacts',
		element: <ContactsPage />,
	},
	{
		path: '/about',
		element: <AboutCompanyPage />,
	},
	{
		path: '/delivery',
		element: <DeliveryPage />,
	},
	{
		path: '/guarantee',
		element: <GuaranteePage />,
	},
	{
		path: '/payment',
		element: <PaymentPage />,
	},
	{
		path: '/service-support',
		element: <ServiceSupportPage />,
	},
	{
		path: '/certificates',
		element: <CertificatesPage />,
	},
	{
		path: '/cooperation',
		element: <CooperationPage />,
	},
	{
		path: '/category/:slug',
		element: <CategoryPage />,
	},
	{
		path: '/product/:slug',
		element: <ProductPage />,
	},
	{
		path: '/search',
		element: <CategoryPage />,
	},
	// корзины, заказы
	{
		path: '/carts',
		element: <CartListPage />,
	},
	{
		path: '/carts/:cartId',
		element: <CartPage />,
	},
	{
		path: '/my-orders',
		element: <OrderListPage />,
	},
];
