// src/layouts/PublicLayout.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Spin } from 'antd';
import { fetchCategoryTree } from '../api/catalogApi';
import { useTranslation } from 'react-i18next';

import {
	MenuUnfoldOutlined,
	MenuFoldOutlined,
	ProductOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

function getCategoryIcon(iconName) {
	if (!iconName) {
		// нет иконки => дефолт (ProductOutlined)
		return <ProductOutlined />;
	}
	// Путь к файлу
	return (
		<img
			src={`/images/icons/${iconName}.svg`}
			alt=""
			style={{ width: 18, verticalAlign: 'middle' }}
		/>
	);
}

/**
 * Публичный лейаут со СВОИМ кастомным переключателем collapsed:
 *  - при свёрнутом меню показываем иконку <MenuUnfoldOutlined />
 *  - при развернутом — "Категории" + <MenuFoldOutlined />
 */
export function PublicLayout() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);

	// СВОЙ стейт свёрнутого меню
	const [collapsed, setCollapsed] = useState(true);

	// Язык
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

	// buildMenuItems: используем cat.icon, если есть
	const buildMenuItems = (catList) => {
		return catList.map((cat) => {
			const iconElement = getCategoryIcon(cat.icon); // предполагаем cat.icon в данных
			if (cat.children && cat.children.length > 0) {
				return {
					key: cat.slug,
					label: cat.name,
					icon: iconElement,
					children: buildMenuItems(cat.children),
					onTitleClick: () => navigate(`/category/${cat.slug}`),
				};
			} else {
				return {
					key: cat.slug,
					label: cat.name,
					icon: iconElement,
				};
			}
		});
	};

	const handleMenuClick = (e) => {
		navigate(`/category/${e.key}`);
	};

	// При клике на "иконку" или "Категории" — переключаем collapsed
	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};

	return (
		<Layout style={{ background: '#fff' }}>
			{/* !!! Своё меню сворачивания, скрываем встроенный триггер */}
			<Sider
				width={250}
				collapsible={false} // ОТКЛЮЧАЕМ встроенный
				collapsed={collapsed}
				theme="dark"
				style={{ position: 'relative' }}
			>
				{/* Верхняя шапка сайдбара: если свёрнуто, показываем иконку,
            если развернуто — "Категории" и иконку для сворачивания. */}
				<div
					onClick={toggleCollapsed} // Клик переключает collapsed
					style={{
						padding: '16px',
						color: '#fff',
						textAlign: 'center',
						fontSize: '18px',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						cursor: 'pointer',
						borderBottom: '1px solid #666',
					}}
				>
					{collapsed ? (
						// Если свёрнуто, показываем только иконку
						<MenuUnfoldOutlined style={{ fontSize: '24px' }} />
					) : (
						// Если развернуто, показываем "Категории" и иконку для сворачивания
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								gap: '8px',
								alignItems: 'center',
							}}
						>
							<span>{t('common.categories')}</span>
							<MenuFoldOutlined />
						</div>
					)}
				</div>

				{loading ? (
					<Spin style={{ marginLeft: 16, marginTop: 16 }} />
				) : (
					<Menu
						theme="dark"
						mode="vertical"
						triggerSubMenuAction="hover"
						onClick={handleMenuClick}
						items={buildMenuItems(categories)}
					/>
				)}
			</Sider>

			<Content style={{ padding: 16 }}>
				<Outlet />
			</Content>
		</Layout>
	);
}
