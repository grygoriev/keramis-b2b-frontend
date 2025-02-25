require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const catalogRoutes = require('./routes/catalog.routes');
const searchRoutes = require('./routes/search.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const discountRoutes = require('./routes/discount.routes');
const priceGroupRoutes = require('./routes/priceGroup.routes');

const app = express();

// Подключаемся к Mongo:
connectDB(process.env.DB_CONNECTION_STRING);

// Миддлвары
app.use(morgan('dev'));
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

// Статика
app.use('/uploads', express.static('uploads'));

// Запуск
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Node server running on port ${PORT}`);
});
