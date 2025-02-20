// src/pages/AdminDiscountsPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, message, Select, InputNumber, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';

// Импортируем наши запросы
import {
	getPriceGroups,
	getGroupDiscounts,
	updateGroupDiscount,
	createGroupDiscount,
	deleteGroupDiscount,
} from '../api/discountsApi';
import { getClientGroups } from '../api/clientsApi.js';

const { Search } = Input;
const { Option } = Select;

/**
 * Страница управления скидками (Group Discounts).
 * Здесь можно редактировать связи "client_group + price_group => discount_percent".
 */
export function AdminDiscountsPage() {
	const { t } = useTranslation();

	// Список всех скидок (по сути, связь client_group -> price_group с discount_percent)
	const [discounts, setDiscounts] = useState([]);

	// Справочники:
	const [clientGroups, setClientGroups] = useState([]);
	const [priceGroups, setPriceGroups] = useState([]);

	const [loading, setLoading] = useState(false);

	// Текст поиска (по названию группы, коду и т.п.)
	const [searchText, setSearchText] = useState('');

	// При первом рендере грузим все данные
	useEffect(() => {
		fetchAllData();
	}, []);

	/**
	 * Загружаем все нужные данные для страницы
	 */
	const fetchAllData = async () => {
		setLoading(true);
		try {
			const [cgResp, pgResp, discountsResp] = await Promise.all([
				getClientGroups(),
				getPriceGroups(),
				getGroupDiscounts(),
			]);
			setClientGroups(cgResp.data);     // [{id, name}, ...]
			setPriceGroups(pgResp.data);      // [{id, name, code}, ...]
			setDiscounts(discountsResp.data); // [{id, client_group, price_group, discount_percent}, ...]
		} catch (err) {
			console.error(err);
			message.error(t('discounts.loadError', 'Не удалось загрузить данные о скидках'));
		} finally {
			setLoading(false);
		}
	};

	/**
	 * При изменении поля в записи скидки (client_group, price_group, discount_percent)
	 */
	const handleUpdateField = async (recordId, field, value) => {
		// value может быть числом (для discount_percent) или ID (для client_group/price_group)
		try {
			await updateGroupDiscount(recordId, { [field]: value });
			message.success(t('discounts.updateSuccess', 'Скидка обновлена'));
			// Перезагружаем список
			fetchAllData();
		} catch (err) {
			console.error(err);
			message.error(t('discounts.updateError', 'Ошибка обновления скидки'));
		}
	};

	/**
	 * Создать новую запись скидки по нажатию на кнопку
	 */
	const handleCreate = async () => {
		// Можно попросить пользователя заполнить форму, или сделать «быструю» заготовку
		// Ниже пример «заготовки», лучше сделать модальное окно/форму
		const defaultGroupId = clientGroups[0]?.id;
		const defaultPriceGroupId = priceGroups[0]?.id;

		if (!defaultGroupId || !defaultPriceGroupId) {
			message.warning(t('discounts.noDefaultCreate', 'Нет данных для создания записи'));
			return;
		}

		const payload = {
			client_group: defaultGroupId,
			price_group: defaultPriceGroupId,
			discount_percent: 0,
		};

		try {
			await createGroupDiscount(payload);
			message.success(t('discounts.createSuccess', 'Запись создана'));
			fetchAllData();
		} catch (err) {
			console.error(err);
			message.error(t('discounts.createError', 'Не удалось создать запись'));
		}
	};

	/**
	 * Удаление записи
	 */
	const handleDelete = async (recordId) => {
		try {
			await deleteGroupDiscount(recordId);
			message.success(t('discounts.deleteSuccess', 'Скидка удалена'));
			fetchAllData();
		} catch (err) {
			console.error(err);
			message.error(t('discounts.deleteError', 'Ошибка удаления скидки'));
		}
	};

	/**
	 * Описание колонок таблицы
	 */
	const columns = [
		{
			title: t('discounts.clientGroup', 'Группа клиента'),
			dataIndex: 'client_group',
			key: 'client_group',
			render: (clientGroupId, record) => (
				<Select
					style={{ width: 180 }}
					value={clientGroupId}
					onChange={(newGroupId) => handleUpdateField(record.id, 'client_group', newGroupId)}
				>
					{clientGroups.map((grp) => (
						<Option key={grp.id} value={grp.id}>
							{grp.name}
						</Option>
					))}
				</Select>
			),
		},
		{
			title: t('discounts.priceGroup', 'Ценовая группа'),
			dataIndex: 'price_group',
			key: 'price_group',
			render: (priceGroupId, record) => (
				<Select
					style={{ width: 180 }}
					value={priceGroupId}
					onChange={(newPriceGroupId) =>
						handleUpdateField(record.id, 'price_group', newPriceGroupId)
					}
				>
					{priceGroups.map((pg) => (
						<Option key={pg.id} value={pg.id}>
							{pg.name} ({pg.code})
						</Option>
					))}
				</Select>
			),
		},
		{
			title: t('discounts.discountPercent', 'Скидка (%)'),
			dataIndex: 'discount_percent',
			key: 'discount_percent',
			// Разрешаем ввод только 0-100 (можно проверить дополнительно на бэкенде)
			render: (value, record) => (
				<InputNumber
					min={0}
					max={100}
					value={value}
					onChange={(newVal) => handleUpdateField(record.id, 'discount_percent', newVal)}
					style={{ width: 80 }}
				/>
			),
		},
		{
			title: t('discounts.actions', 'Действия'),
			key: 'actions',
			render: (text, record) => (
				<Space>
					<Popconfirm
						title={t('discounts.confirmDelete', 'Удалить эту скидку?')}
						onConfirm={() => handleDelete(record.id)}
						okText={t('common.delete', 'Удалить')}
						cancelText={t('common.cancel', 'Отмена')}
					>
						<Button danger>{t('common.delete', 'Удалить')}</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	/**
	 * Фильтрация списка по названию или коду
	 * (ищем в названии группы клиента, ценовой группы и её code)
	 */
	const filteredData = discounts.filter((item) => {
		const search = searchText.toLowerCase();

		// Находим объекты соответствующих групп
		const clientGroup = clientGroups.find((g) => g.id === item.client_group);
		const priceGroup = priceGroups.find((p) => p.id === item.price_group);

		// Собираем строки для поиска
		const clientGroupName = clientGroup ? clientGroup.name.toLowerCase() : '';
		const priceGroupName = priceGroup ? priceGroup.name.toLowerCase() : '';
		const priceGroupCode = priceGroup ? priceGroup.code.toLowerCase() : '';

		return (
			clientGroupName.includes(search) ||
			priceGroupName.includes(search) ||
			priceGroupCode.includes(search)
		);
	});

	return (
		<div style={{ padding: 16 }}>
			<h2>{t('discounts.title', 'Управление скидками')}</h2>

			<Space style={{ marginBottom: 16 }}>
				<Search
					placeholder={t('discounts.searchPlaceholder', 'Поиск по группам')}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 300 }}
				/>
				<Button type="primary" onClick={fetchAllData}>
					{t('common.refresh', 'Обновить')}
				</Button>
				<Button onClick={handleCreate}>
					{t('discounts.createNew', 'Создать скидку')}
				</Button>
			</Space>

			<Table
				columns={columns}
				dataSource={filteredData}
				rowKey="id"
				loading={loading}
			/>
		</div>
	);
}
