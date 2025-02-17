// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Button, Layout, Menu, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { HomeOutlined } from '@ant-design/icons';
import { fetchCategoryTree } from '../api/catalogApi';
import { useNavigate } from 'react-router-dom';

const { Sider, Content } = Layout;

export function Home() {
	const { t } = useTranslation();
	const navigate = useNavigate(); // важно для перехода

	// Состояние для категорий и загрузки
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);

	// Считываем язык из localStorage (ru или ua), сервер ждёт ru или uk
	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	useEffect(() => {
		loadCategories();
	}, [serverLang]);

	const loadCategories = async () => {
		setLoading(true);
		try {
			const data = await fetchCategoryTree(serverLang);
			setCategories(data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	// Рекурсивно строим Menu items
	const buildMenuItems = (catList) => {
		return catList.map((cat) => {
			if (cat.children && cat.children.length > 0) {
				// sub-menu
				return {
					key: cat.slug,
					label: cat.name,
					icon: <HomeOutlined />,
					children: buildMenuItems(cat.children),
				};
			} else {
				// leaf item
				return {
					key: cat.slug,
					label: cat.name,
					icon: <HomeOutlined />,
				};
			}
		});
	};

	const handleMenuClick = (e) => {
		// e.key = slug категории
		// Переходим на /category/:slug
		navigate(`/category/${e.key}`);
	};

	return (
		<Layout style={{ minHeight: '100vh' }}>
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
					{loading ? (
						<Spin style={{ marginLeft: 16 }} />
					) : (
						<Menu
							theme="dark"
							mode="inline"
							onClick={handleMenuClick}
							items={buildMenuItems(categories)}
						/>
					)}
				</Sider>

				<Layout>
					<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
						<h1>{t('homePage.bannerWelcome')}</h1>
						<p>{t('homePage.subtitle')}</p>
						{/* Пример "баннера" */}
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

						{/* Блоки "Сертифікати", "Каталоги", ... */}
						<div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
							<Button>{t('homePage.certificates')}</Button>
							<Button>{t('homePage.catalogs')}</Button>
							<Button>{t('homePage.export')}</Button>
							<Button>{t('homePage.import')}</Button>
						</div>

						{/* Пример "Новинки" товары */}
						<h2>{t('homePage.newProducts')}</h2>
						<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
							<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>
								Товар 1
							</div>
							<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>
								Товар 2
							</div>
							<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>
								Товар 3
							</div>
						</div>

						{/* Пример "Акции" */}
						<h2>{t('homePage.promo')}</h2>
						<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
							<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>
								Товар 1
							</div>
							<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>
								Товар 2
							</div>
							<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>
								Товар 3
							</div>
						</div>

						{/* Пример "Распродажа" */}
						<h2>{t('homePage.sales')}</h2>
						<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
							<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>
								Товар 1
							</div>
							<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>
								Товар 2
							</div>
							<div style={{ width: 120, height: 120, background: '#f0f2f5' }}>
								Товар 3
							</div>
						</div>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
}
