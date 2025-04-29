// src/pages/admin/clients/AdminClientsPage.jsx
import { useState } from 'react';
import { Button, Space, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ClientsTable } from './components';
import { selectCurrentLang } from '../../../store/langSlice';
import { transformLangToServer } from '../../../utils';
import { LoadingWrapper } from '../../../components';

import {
	useGetClientsQuery,
	useGetClientGroupsQuery,
	useUpdateClientMutation,
} from '../../../services';

const { Search } = Input;

export function AdminClientsPage() {
	const { t } = useTranslation();
	const currentLanguage = useSelector(selectCurrentLang);
	const serverLang = transformLangToServer(currentLanguage);

	const [searchText, setSearchText] = useState('');

	const {
		data: clients,
		error: clientsError,
		isLoading: isClientsLoading,
		refetch: refetchClients,
	} = useGetClientsQuery(serverLang);

	const {
		data: clientGroups,
		error: groupsError,
		isLoading: isGroupsLoading,
		refetch: refetchGroups,
	} = useGetClientGroupsQuery();

	const [updateClient] = useUpdateClientMutation();

	const loading = isClientsLoading || isGroupsLoading;
	let combinedError = null;
	if (clientsError) {
		combinedError = t('clients.loadError', 'Не удалось загрузить клиентов');
	} else if (groupsError) {
		combinedError = t('clientsGroup.loadError', 'Не удалось загрузить группы');
	}

	const handleRefresh = () => {
		refetchClients();
		refetchGroups();
	};

	const handleUpdateClient = async (clientId, field, value) => {
		try {
			await updateClient({ clientId, payload: { [field]: value } }).unwrap();
			message.success(t('clients.updateSuccess', 'Клиент обновлен'));
		} catch (err) {
			console.error(err);
			message.error(t('clients.updateError', 'Ошибка обновления клиента'));
		}
	};

	return (
		<LoadingWrapper
			loading={loading}
			error={combinedError}
			data={clients}
		>
			<div style={{ padding: 16 }}>
				<h2>{t('clients.title', 'Управление клиентами')}</h2>

				<Space style={{ marginBottom: 16 }}>
					<Search
						placeholder={t('clients.searchPlaceholder', 'Поиск по имени клиента')}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 300 }}
					/>
					{/*<Button type="primary" onClick={handleRefresh}>*/}
					{/*	{t('clients.refresh', 'Обновить')}*/}
					{/*</Button>*/}
				</Space>

				<ClientsTable
					clients={clients || []}
					clientGroups={clientGroups || []}
					loading={loading}
					onUpdateClient={handleUpdateClient}
					searchText={searchText}
				/>
			</div>
		</LoadingWrapper>
	);
}
