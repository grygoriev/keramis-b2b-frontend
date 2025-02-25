// src/pages/admin/clients/AdminClientsPage.jsx
import { useEffect, useState } from 'react';
import { Button, Space, Input, message, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { getClients, getClientGroups, updateClient } from '../../../api/clientsApi.js';
import { ClientsTable } from './components/index.js';

const { Search } = Input;

export function AdminClientsPage() {
	const { t } = useTranslation();
	const [clients, setClients] = useState([]);
	const [clientGroups, setClientGroups] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		fetchClients();
		fetchGroups();
	}, []);

	const fetchClients = async () => {
		setLoading(true);
		try {
			const langParam =
				localStorage.getItem('lang') === 'ua'
					? 'uk'
					: localStorage.getItem('lang') || 'ru';
			const response = await getClients(langParam);
			setClients(response.data);
		} catch (error) {
			console.error(error);
			message.error(t('clients.loadError', 'Не удалось загрузить клиентов'));
		} finally {
			setLoading(false);
		}
	};

	const fetchGroups = async () => {
		try {
			const resp = await getClientGroups();
			setClientGroups(resp.data);
		} catch (err) {
			console.error(err);
			message.error(t('clientsGroup.loadError', 'Не удалось загрузить группы'));
		}
	};

	const handleUpdateClient = async (clientId, field, value) => {
		try {
			await updateClient(clientId, { [field]: value });
			message.success(t('clients.updateSuccess', 'Клиент обновлен'));
			// После успешного обновления - обновляем список
			fetchClients();
		} catch (error) {
			console.error(error);
			message.error(t('clients.updateError', 'Ошибка обновления клиента'));
		}
	};

	if (loading && clients.length === 0) {
		return <Spin style={{ margin: 16 }} />;
	}

	return (
		<div style={{ padding: 16 }}>
			<h2>{t('clients.title', 'Управление клиентами')}</h2>

			<Space style={{ marginBottom: 16 }}>
				<Search
					placeholder={t('clients.searchPlaceholder', 'Поиск по имени клиента')}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
					style={{ width: 300 }}
				/>
				<Button type="primary" onClick={fetchClients}>
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
	);
}
