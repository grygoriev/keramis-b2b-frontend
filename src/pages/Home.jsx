import React from 'react';
import { Button, Layout, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { HomeOutlined, FireOutlined, GiftOutlined } from '@ant-design/icons';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { GlobalHeader } from '../components/GlobalHeader';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export default function Home() {
	const { t } = useTranslation();

	return (
		<Layout style={{ minHeight: '100vh' }}>
			{/* ---- Верхняя панель с ссылками ---- */}
			<Header
				style={{
					background: '#fff',
					padding: '0 16px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					height: 50,
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
					<div style={{ fontWeight: 'bold', marginRight: 20 }}>KERAMIS+B2B</div>
					<Link to="/help" style={{ color: 'inherit' }}>
						Допомога
					</Link>
					<Link to="/solutions" style={{ color: 'inherit' }}>
						ГОТОВІ РІШЕННЯ
					</Link>
					<Link to="/orders" style={{ color: 'inherit' }}>
						Замовлення
					</Link>
					<Link to="#" style={{ color: 'inherit' }}>
						Ще
					</Link>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
					{/* Пример: курс валют (примерно) */}
					<span>$ 42.1 ↑</span>
					<span>€ 43.85 ↑</span>
					{/* Переключение языка */}
					<span>UK | RU</span>
					{/* Поле поиска (упрощённо) */}
					<Button>Знайти</Button>
					{/* Иконка пользователя (id 781), корзина и т.д. –Placeholder */}
					<div>id 781</div>
					{/* Можно вставить иконки из antd/icons */}
				</div>
			</Header>
			<Layout>
				{/* Левое боковое меню категорий */}
				<Sider width={250}>
					<div
						style={{
							padding: '16px',
							color: '#fff',
							textAlign: 'center',
							fontSize: '18px',
						}}
					>
						{t('common.categories')}
					</div>
					<Menu theme="dark" mode="inline">
						<Menu.Item key="1" icon={<HomeOutlined />}>
							Змішувачі
						</Menu.Item>
						<Menu.Item key="2" icon={<FireOutlined />}>
							Душова програма
						</Menu.Item>
						<Menu.Item key="3" icon={<GiftOutlined />}>
							Кераміка
						</Menu.Item>
						{/* и т.д. */}
					</Menu>
				</Sider>

				<Layout>
					<Header
						style={{
							background: '#fff',
							padding: '0 16px',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<h2>{t('common.headerTitle')}</h2>
						<LanguageSwitcher />
						<GlobalHeader />
					</Header>

					<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
						<h1>{t('homePage.bannerWelcome')}</h1>
						<p>{t('homePage.subtitle')}</p>
						{/* Пример "баннера" с красной плашкой */}
						<div
							style={{
								background: 'red',
								color: '#fff',
								padding: '16px',
								marginBottom: '16px',
							}}
						>
							<h2>НОВЕ РОЗМІЩЕННЯ РЕКЛАМНИХ БАНЕРІВ!</h2>
							<p>
								Для більш точної цільової взаємодії усі рекламні банери
								знаходяться в тематичних розділах:
							</p>
							<div style={{ display: 'flex', gap: '10px' }}>
								<div>#новинки</div>
								<div>#акція</div>
								<div>#разом_дешевше</div>
								<div>#інформація</div>
							</div>
						</div>

						{/* Пример блоков "Сертифікати", "Каталоги", "Імпорт", "Експорт" */}
						<div
							style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}
						>
							<Button>Сертифікати</Button>
							<Button>Каталоги</Button>
							<Button>Імпорт</Button>
							<Button>Експорт</Button>
						</div>

						{/* Пример "Новинки" товары */}
						<h2>НОВИНКИ</h2>
						<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
							<div
								style={{ width: 120, height: 120, background: '#f0f2f5' }}
							>
								Товар 1
							</div>
							<div
								style={{ width: 120, height: 120, background: '#f0f2f5' }}
							>
								Товар 2
							</div>
							<div
								style={{ width: 120, height: 120, background: '#f0f2f5' }}
							>
								Товар 3
							</div>
						</div>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
}
