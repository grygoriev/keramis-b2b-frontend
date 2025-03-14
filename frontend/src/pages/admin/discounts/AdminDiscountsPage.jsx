// src/pages/admin/discounts/AdminDiscountsPage.jsx
import { useState, useMemo } from 'react';
import { Input, Button, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';

import { DiscountsTable, CreateDiscountModal} from './components';
import { LoadingWrapper } from '../../../components';

import {
	useGetClientGroupsQuery,
	useGetPriceGroupsQuery,
	useGetGroupDiscountsQuery,
	useUpdateGroupDiscountMutation,
	useCreateGroupDiscountMutation,
	useDeleteGroupDiscountMutation,
} from '../../../services/adminApi';

const { Search } = Input;

export function AdminDiscountsPage() {
	const { t } = useTranslation();

	// Поисковая строка
	const [searchText, setSearchText] = useState('');

	// Грузим клиентские группы, ценовые группы, discounts
	const {
		data: clientGroups,
		error: groupsError,
		isLoading: isGroupsLoading,
		refetch: refetchGroups,
	} = useGetClientGroupsQuery();

	const {
		data: priceGroups,
		error: priceGroupsError,
		isLoading: isPriceGroupsLoading,
		refetch: refetchPriceGroups,
	} = useGetPriceGroupsQuery();

	const {
		data: discounts,
		error: discountsError,
		isLoading: isDiscountsLoading,
		refetch: refetchDiscounts,
	} = useGetGroupDiscountsQuery();

	// Мутации (update, create, delete)
	const [updateGroupDiscount] = useUpdateGroupDiscountMutation();
	const [createGroupDiscount] = useCreateGroupDiscountMutation();
	const [deleteGroupDiscount] = useDeleteGroupDiscountMutation();

	// Общий флаг loading, error
	const loading = isGroupsLoading || isPriceGroupsLoading || isDiscountsLoading;
	let error = null;
	if (groupsError) error = t('discounts.loadError', 'Не удалось загрузить данные (группы клиентов)');
	if (priceGroupsError) error = t('discounts.loadError', 'Не удалось загрузить данные (ценовые группы)');
	if (discountsError) error = t('discounts.loadError', 'Не удалось загрузить данные (скидки)');

	// Кнопка "Обновить" - рефрешим все три запроса
	const handleRefresh = () => {
		refetchGroups();
		refetchPriceGroups();
		refetchDiscounts();
	};

	// Массивы или []
	const realClientGroups = clientGroups || [];
	const realPriceGroups = priceGroups || [];
	const realDiscounts = (discounts || []).slice().sort((a, b) => a.id - b.id);

	// Собираем Set "занятых" пар
	const usedPairs = useMemo(() => {
		const set = new Set();
		for (const d of realDiscounts) {
			set.add(`${d.client_group}-${d.price_group}`);
		}
		return set;
	}, [realDiscounts]);

	// Все возможные пары = (каждая группа × каждая цен.группа), убираем занятые
	const freePairs = useMemo(() => {
		const arr = [];
		for (const cg of realClientGroups) {
			for (const pg of realPriceGroups) {
				if (!usedPairs.has(`${cg.id}-${pg.id}`)) {
					arr.push({ client_group: cg.id, price_group: pg.id });
				}
			}
		}
		return arr;
	}, [realClientGroups, realPriceGroups, usedPairs]);

	const noFreePairs = freePairs.length === 0;

	// Модалка для создания
	const [showCreateModal, setShowCreateModal] = useState(false);

	const openCreateModal = () => {
		if (noFreePairs) {
			message.warning(t('discounts.noFreePairs', 'Нет свободных комбинаций'));
			return;
		}
		setShowCreateModal(true);
	};
	const closeCreateModal = () => {
		setShowCreateModal(false);
	};

	// Хендлер, когда пользователь внутри модалки нажал "Ok"
	const handleCreateDiscount = async (payload) => {
		// payload: { client_group, price_group, discount_percent }

		try {
			await createGroupDiscount(payload).unwrap();
			message.success(t('discounts.createSuccess', 'Запись создана'));
			setShowCreateModal(false);
		} catch (err) {
			console.error(err);
			// Если сервер вернул "уже существует"
			if (err?.data?.detail?.includes('already exists')) {
				message.error(t('discounts.duplicatePair', 'Такая пара уже существует!'));
			} else {
				message.error(t('discounts.createError', 'Не удалось создать запись'));
			}
		}
	};

	// Обновление discount
	const handleUpdateField = async (recordId, field, value) => {
		try {
			await updateGroupDiscount({ discountId: recordId, payload: { [field]: value } }).unwrap();
			message.success(t('discounts.updateSuccess', 'Скидка обновлена'));
		} catch (err) {
			console.error(err);
			message.error(t('discounts.updateError', 'Ошибка обновления скидки'));
		}
	};

	// Удаление discount
	const handleDelete = async (recordId) => {
		try {
			await deleteGroupDiscount(recordId).unwrap();
			message.success(t('discounts.deleteSuccess', 'Скидка удалена'));
		} catch (err) {
			console.error(err);
			message.error(t('discounts.deleteError', 'Ошибка удаления скидки'));
		}
	};

	// Фильтрация по поиску
	const filteredData = realDiscounts.filter((item) => {
		const search = searchText.toLowerCase();
		const cGroup = realClientGroups.find((g) => g.id === item.client_group);
		const pGroup = realPriceGroups.find((p) => p.id === item.price_group);

		const clientGroupName = cGroup ? cGroup.name.toLowerCase() : '';
		const priceGroupName = pGroup ? pGroup.name.toLowerCase() : '';
		const priceGroupCode = pGroup ? pGroup.code.toLowerCase() : '';

		return (
			clientGroupName.includes(search) ||
			priceGroupName.includes(search) ||
			priceGroupCode.includes(search)
		);
	});

	return (
		<LoadingWrapper loading={loading} error={error} data={realDiscounts}>
			<div style={{ padding: 16 }}>
				<h2>{t('discounts.title', 'Управление скидками')}</h2>

				<Space style={{ marginBottom: 16 }}>
					<Search
						placeholder={t('discounts.searchPlaceholder', 'Поиск по группам')}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 300 }}
					/>
					<Button type="primary" onClick={handleRefresh}>
						{t('common.refresh', 'Обновить')}
					</Button>
					<Button onClick={openCreateModal} disabled={noFreePairs}>
						{t('discounts.createNew', 'Создать скидку')}
					</Button>
				</Space>

				<DiscountsTable
					discounts={realDiscounts}
					clientGroups={realClientGroups}
					priceGroups={realPriceGroups}
					loading={loading}
					onUpdateField={handleUpdateField}
					onDelete={handleDelete}
					filteredData={filteredData}
				/>
			</div>

			<CreateDiscountModal
				open={showCreateModal}
				onClose={closeCreateModal}
				onCreate={handleCreateDiscount}
				freePairs={freePairs}
				clientGroups={realClientGroups}
				priceGroups={realPriceGroups}
			/>
		</LoadingWrapper>
	);
}
