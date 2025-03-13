// src/pages/admin/clients/AdminClientsPage.jsx
import { useEffect, useState } from 'react';
import { Button, Space, Input, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { ClientsTable } from './components';
import { getClients, getClientGroups, updateClient } from '../../../api/clientsApi';
import { LoadingWrapper } from '../../../components';
import { selectCurrentLang } from '../../../store/langSlice';
import { transformLangToServer } from '../../../utils';

const { Search } = Input;

export function AdminClientsPage() {
	const { t } = useTranslation();
	const currentLanguage = useSelector(selectCurrentLang);
	const serverLang = transformLangToServer(currentLanguage);

	const [clients, setClients] = useState([]);
	const [clientGroups, setClientGroups] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		fetchAllData();
	}, [serverLang]);

	const fetchAllData = async () => {
		setLoading(true);
		setError(null);
		try {
			const respClients = await getClients(serverLang);
			setClients(respClients.data);

			const respGroups = await getClientGroups();
			setClientGroups(respGroups.data);
		} catch (err) {
			console.error(err);
			setError(t('clients.loadError', 'Не удалось загрузить данные клиентов/групп'));
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateClient = async (clientId, field, value) => {
		try {
			await updateClient(clientId, { [field]: value });
			message.success(t('clients.updateSuccess', 'Клиент обновлен'));
			fetchAllData();
		} catch (error) {
			console.error(error);
			message.error(t('clients.updateError', 'Ошибка обновления клиента'));
		}
	};

	return (
		<LoadingWrapper loading={loading} error={error} data={clients}>
			<div style={{ padding: 16 }}>
				<h2>{t('clients.title', 'Управление клиентами')}</h2>

				<Space style={{ marginBottom: 16 }}>
					<Search
						placeholder={t('clients.searchPlaceholder', 'Поиск по имени клиента')}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						style={{ width: 300 }}
					/>
					<Button type="primary" onClick={fetchAllData}>
						{t('clients.refresh', 'Обновить')}
					</Button>
				</Space>

				<ClientsTable
					clients={clients}
					clientGroups={clientGroups}
					loading={loading}
					onUpdateClient={handleUpdateClient}
					searchText={searchText}
				/>
			</div>
		</LoadingWrapper>
	);
}
