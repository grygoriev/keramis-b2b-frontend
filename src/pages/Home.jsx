// src/pages/Home.jsx
import React from 'react';
import { Button, Layout, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { HomeOutlined, FireOutlined, GiftOutlined } from '@ant-design/icons';
import { GlobalHeader } from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter.jsx';

const { Header, Sider, Content, Footer } = Layout;

export default function Home() {
	const { t } = useTranslation();

	return (
		<Layout style={{ minHeight: '100vh' }}>
			{/* Глобальная шапка сверху */}
			<GlobalHeader />

			<Layout>
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
					</Menu>
				</Sider>

				<Layout>
					{/* Можно убрать второй Header (если не нужен),
              или оставить как внутренний под-шапку */}
					<Header
						style={{
							background: '#fff',
							padding: '0 16px',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<h2 style={{ margin: 0 }}>{t('common.headerTitle')}</h2>
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
						{/* Пример "Акции" товары */}
						<h2>АКЦИИ</h2>
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
						{/* Пример "Распродажа" товары */}
						<h2>РАСПРОДАЖА</h2>
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
					<Footer style={{ padding: 0 }}>
						<GlobalFooter />
					</Footer>
				</Layout>
			</Layout>
		</Layout>
	);
}
