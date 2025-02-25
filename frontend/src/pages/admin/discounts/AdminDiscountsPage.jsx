// src/pages/admin/discounts/AdminDiscountsPage.jsx
import { useEffect, useState } from 'react';
import { Input, Button, Space, message, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import {
	getPriceGroups,
	getGroupDiscounts,
	updateGroupDiscount,
	createGroupDiscount,
	deleteGroupDiscount,
} from '../../../api/discountsApi.js';
import { getClientGroups } from '../../../api/clientsApi.js';
import { DiscountsTable } from './components/index.js';

const { Search } = Input;

export function AdminDiscountsPage() {
	const { t } = useTranslation();

	const [discounts, setDiscounts] = useState([]);
	const [clientGroups, setClientGroups] = useState([]);
	const [priceGroups, setPriceGroups] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		fetchAllData();
	}, []);

	const fetchAllData = async () => {
		setLoading(true);
		try {
			const [cgResp, pgResp, discountsResp] = await Promise.all([
				getClientGroups(),
				getPriceGroups(),
				getGroupDiscounts(),
			]);
			setClientGroups(cgResp.data);
			setPriceGroups(pgResp.data);
			setDiscounts(discountsResp.data);
		} catch (err) {
			console.error(err);
			message.error(t('discounts.loadError', 'Не удалось загрузить данные о скидках'));
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateField = async (recordId, field, value) => {
		try {
			await updateGroupDiscount(recordId, { [field]: value });
			message.success(t('discounts.updateSuccess', 'Скидка обновлена'));
			fetchAllData();
		} catch (err) {
			console.error(err);
			message.error(t('discounts.updateError', 'Ошибка обновления скидки'));
		}
	};

	const handleCreate = async () => {
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

	// Фильтрация
	const filteredData = discounts.filter((item) => {
		const search = searchText.toLowerCase();
		const clientGroup = clientGroups.find((g) => g.id === item.client_group);
		const priceGroup = priceGroups.find((p) => p.id === item.price_group);

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

			{loading && discounts.length === 0 ? (
				<Spin style={{ margin: 20 }} />
			) : (
				<DiscountsTable
					discounts={discounts}
					clientGroups={clientGroups}
					priceGroups={priceGroups}
					loading={loading}
					onUpdateField={handleUpdateField}
					onDelete={handleDelete}
					filteredData={filteredData}
				/>
			)}
		</div>
	);
}
