require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const bannerRoutes = require('./routes/banner.routes');
const cartRoutes = require('./routes/cart.routes');
const catalogRoutes = require('./routes/catalog.routes');
const discountRoutes = require('./routes/discount.routes');
const orderRoutes = require('./routes/order.routes');
const priceGroupRoutes = require('./routes/priceGroup.routes');
const searchRoutes = require('./routes/search.routes');
const productRoutes = require('./routes/product.routes');
const path = require('path');

const app = express();

// Подключаемся к Mongo:
connectDB(process.env.DB_CONNECTION_STRING);

// Миддлвары
app.use(morgan('dev'));
// app.use(cors());
app.use(express.static(path.resolve('..', 'frontend', 'build')));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Роуты
app.use('/api/auth', authRoutes);
app.use('/catalog', catalogRoutes);
app.use('/catalog/search', searchRoutes);
app.use('/orders', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/pricing', discountRoutes);
app.use('/pricing', priceGroupRoutes);
app.use('/catalog/banners', bannerRoutes);
app.use('/catalog/products', productRoutes);

// Статика
app.use('/uploads', express.static('uploads'));

app.get('*', (req, res) => {
	res.sendFile(path.resolve('..', 'frontend', 'build', 'index.html'));
});

// Запуск
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Node server running on port ${PORT}`);
});
