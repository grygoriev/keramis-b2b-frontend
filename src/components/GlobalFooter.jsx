import React from 'react';
import { Link } from 'react-router-dom';

export default function GlobalFooter() {
	return (
		<div style={{ backgroundColor: '#000', color: '#fff' }}>
			{/* Верхний блок (Доставка, Гарантія, Оплата, Сервісна підтримка) */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					padding: '20px 0',
					borderBottom: '1px solid #333',
				}}
			>
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 20 }}>Доставка</div>
					<div style={{ fontSize: 12, marginTop: 5 }}>
						Своя логістична мережа, можливість доставки Новою Поштою
					</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 20 }}>Гарантія</div>
					<div style={{ fontSize: 12, marginTop: 5 }}>
						Ми надаємо гарантію на нашу продукцію
					</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 20 }}>Оплата</div>
					<div style={{ fontSize: 12, marginTop: 5 }}>
						Ви можете вибрати зручний спосіб оплати
					</div>
				</div>
				<div style={{ textAlign: 'center' }}>
					<div style={{ fontSize: 20 }}>Сервісна підтримка</div>
					<div style={{ fontSize: 12, marginTop: 5 }}>
						Зручна та оперативна система повернення або ремонту продукції
					</div>
				</div>
			</div>

			{/* Основной темный блок футера */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					padding: '20px 40px',
				}}
			>
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						marginBottom: 20,
					}}
				>
					{/* Левая часть: Логотип, соцсети */}
					<div>
						<div
							style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 10 }}
						>
							KERAMIS + B2B
						</div>
						<div style={{ marginBottom: 10 }}>Ми в соц мережах:</div>
						<div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
							{/* Иконки соцсетей (заглушки), все ведут на главную */}
							<Link to="/">
								<img
									src="https://img.icons8.com/ios-filled/24/ffffff/telegram-app.png"
									alt="telegram"
								/>
							</Link>
							<Link to="/">
								<img
									src="https://img.icons8.com/ios-glyphs/24/ffffff/instagram-new.png"
									alt="instagram"
								/>
							</Link>
							<Link to="/">
								<img
									src="https://img.icons8.com/ios-filled/24/ffffff/facebook--v1.png"
									alt="facebook"
								/>
							</Link>
						</div>
					</div>

					{/* Колонки ссылок */}
					<div style={{ display: 'flex', gap: 60 }}>
						<div>
							<div style={{ fontWeight: 'bold', marginBottom: 10 }}>
								Каталог
							</div>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Розпродаж
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Новинки
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Акції
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Категорії
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Уцінені товари
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Бренди
							</Link>
						</div>
						<div>
							<div style={{ fontWeight: 'bold', marginBottom: 10 }}>
								Користувачу
							</div>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Профіль
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Мої замовлення
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Обране
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Повідомлення
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Експорт
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Повернення
							</Link>
						</div>
						<div>
							<div style={{ fontWeight: 'bold', marginBottom: 10 }}>
								Співробітництво
							</div>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Сертифікати
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Каталоги
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Інтернет ресурси
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Відеокаталог
							</Link>
							<Link
								to="/"
								style={{
									display: 'block',
									color: '#fff',
									marginBottom: 5,
								}}
							>
								Умови співпраці
							</Link>
						</div>
						<div>
							<div style={{ fontWeight: 'bold', marginBottom: 10 }}>
								Допомога
							</div>
							<div style={{ marginBottom: 5 }}>
								Гаряча лінія: 0-800-212-008
							</div>
							<div style={{ marginBottom: 5 }}>
								Сервісна підтримка: 0-800-210-247
							</div>
							<div style={{ marginBottom: 5 }}>
								support@keramisservice.com
							</div>
							<div style={{ marginBottom: 5 }}>Телеграм чат</div>
							<div>Зв'язок з менеджером</div>
						</div>
					</div>
				</div>

				{/* Нижняя строка копирайта */}
				<div
					style={{
						textAlign: 'center',
						fontSize: 12,
						borderTop: '1px solid #333',
						paddingTop: 10,
					}}
				>
					Keramis + B2B © 2023. Всі права захищені.
				</div>
			</div>
		</div>
	);
}
