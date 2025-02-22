// src/components/header/search/GlobalSearch.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Input, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';   // <-- импорт
import { fetchSearchAutocomplete } from '../../../api/catalogApi';
import debounce from 'lodash/debounce';

const MIN_LENGTH = 3;

export function GlobalSearch() {
	const navigate = useNavigate();
	// Хук для переводов
	const { t } = useTranslation();

	const [searchTerm, setSearchTerm] = useState('');
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);

	const containerRef = useRef(null);

	// Язык
	const storedLang = localStorage.getItem('lang') || 'ru';
	const serverLang = storedLang === 'ua' ? 'uk' : storedLang;

	// Дебаунс
	const doSearch = useCallback(
		debounce(async (value) => {
			setLoading(true);
			setShowDropdown(true);
			try {
				const data = await fetchSearchAutocomplete(serverLang, { q: value });
				setResults(data);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}, 300),
		[serverLang]
	);

	useEffect(() => {
		return () => {
			doSearch.cancel();
		};
	}, [doSearch]);

	// Клик вне блока => скрываем дропдаун
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);

		if (value.length >= MIN_LENGTH) {
			doSearch(value);
		} else {
			setResults([]);
			setShowDropdown(false);
		}
	};

	const handleSelectItem = (item) => {
		navigate(`/product/${item.slug}`);
		setShowDropdown(false);
		setSearchTerm('');
	};

	// Отображение цены
	const renderPrice = (item) => {
		if (!item.price) return null;

		// При желании перевести «грн» тоже можно вынести в локализацию:
		const currencyLabel = t('common.currency', 'грн');

		if (item.discounted_price) {
			return (
				<div style={{ marginTop: 4, fontSize: 14 }}>
          <span style={{ textDecoration: 'line-through', color: '#999' }}>
            {parseFloat(item.price).toFixed(2)}&nbsp;{currencyLabel}
          </span>
					<span style={{ color: 'red', marginLeft: 8 }}>
            {parseFloat(item.discounted_price).toFixed(2)}&nbsp;{currencyLabel}
          </span>
				</div>
			);
		}
		return (
			<div style={{ marginTop: 4, fontSize: 14 }}>
				{parseFloat(item.price).toFixed(2)}&nbsp;{currencyLabel}
			</div>
		);
	};

	return (
		<div style={{ position: 'relative' }} ref={containerRef}>
			{/* Поле ввода с локализованным placeholder */}
			<Input
				value={searchTerm}
				onChange={handleChange}
				onPressEnter={() => {
					// Редирект на /search?q=<searchTerm>
					navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
					// Скрываем автокомплит
					setShowDropdown(false);
				}}
				placeholder={t('search.placeholder', 'Поиск товаров...')}
				style={{ width: 300 }}
				allowClear
			/>

			{showDropdown && (
				<div
					style={{
						position: 'absolute',
						top: 40,
						left: 0,
						width: 300,
						background: '#fff',
						border: '1px solid #ccc',
						borderRadius: 4,
						zIndex: 999,
						padding: '8px 0',
						maxHeight: 300,
						overflowY: 'auto',
					}}
				>
					{loading ? (
						<Spin style={{ margin: '0 auto', display: 'block' }} />
					) : results.length > 0 ? (
						results.map((item) => (
							<div
								key={item.id}
								onClick={() => handleSelectItem(item)}
								style={{
									padding: '6px 12px',
									cursor: 'pointer',
									borderBottom: '1px solid #eee',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = '#f5f5f5';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = '#fff';
								}}
							>
								<div style={{ fontWeight: 'bold', fontSize: 14 }}>
									{item.name}
								</div>
								<div style={{ fontSize: 12, color: '#666' }}>
									{item.category_name}
								</div>
								{renderPrice(item)}
							</div>
						))
					) : (
						// Локализованный текст при отсутствии результатов
						<div style={{ padding: '8px 12px', color: '#999' }}>
							{t('search.noResults', 'Нет результатов')}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
