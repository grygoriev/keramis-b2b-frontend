import React from 'react';
import { Layout, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { HomeOutlined, FireOutlined, GiftOutlined } from '@ant-design/icons';
import LanguageSwitcher from '../components/LanguageSwitcher';

const { Header, Sider, Content } = Layout;

export default function Home() {
	const { t } = useTranslation();

	return (
		<Layout style={{ minHeight: '100vh' }}>
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
					}}
				>
					<h2>{t('common.headerTitle')}</h2>
					<LanguageSwitcher />
				</Header>

				<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
					<h1>{t('homePage.bannerWelcome')}</h1>
					<p>{t('homePage.subtitle')}</p>
				</Content>
			</Layout>
		</Layout>
	);
}
