// src/pages/AdminClientsPage.jsx
import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Space, message, Select, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axiosInstance';

const { Search } = Input;
const { Option } = Select;

/**
 * Предположим, вы хотите, чтобы пользователь мог выбирать одну из клиентских ролей.
 * Исключаем 'internal_manager'.
 */
const ALLOWED_ROLES = [
	{ value: 'client_admin', label: 'Client Admin' },
	{ value: 'client_manager', label: 'Client Manager' },
	{ value: 'client_user', label: 'Client User' },
];

export function AdminClientsPage() {
	const { t } = useTranslation();
	const [clients, setClients] = useState([]);
	const [clientGroups, setClientGroups] = useState([]); // список доступных групп
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState('');

	useEffect(() => {
		fetchClients();
		fetchClientGroups();
	}, []);

	/**
	 * Загрузка списка клиентов
	 */
	const fetchClients = async () => {
		setLoading(true);
		try {
			const langParam = localStorage.getItem('lang') === 'ua' ? 'uk' : (localStorage.getItem('lang') || 'ru');
			const response = await axiosInstance.get('/api/auth/clients/', {
				params: { lang: langParam },
			});
			setClients(response.data);
		} catch (error) {
			console.error(error);
			message.error(t('clients.loadError', 'Не удалось загрузить клиентов'));
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Загрузка списка групп из таблицы ClientGroup
	 */
	const fetchClientGroups = async () => {
		try {
			const resp = await axiosInstance.get('/api/auth/client-groups/');
			// Ожидаем массив объектов: [{id, name}, ...]
			setClientGroups(resp.data);
		} catch (err) {
			console.error(err);
			message.error(t('clientsGroup.loadError', 'Не удалось загрузить группы клиентов'));
		}
	};

	/**
	 * Запрос на обновление роли или группы
	 */
	const handleUpdateClient = async (clientId, field, value) => {
		try {
			await axiosInstance.patch(`/api/auth/clients/${clientId}/`, { [field]: value });
			message.success(t('clients.updateSuccess', 'Клиент обновлен'));
			// Перезагружаем список
			fetchClients();
		} catch (error) {
			console.error(error);
			message.error(t('clients.updateError', 'Ошибка обновления клиента'));
		}
	};

	/**
	 * Описание колонок таблицы
	 */
	const columns = [
		{
			title: t('clients.username', 'Имя пользователя'),
			dataIndex: 'username',
			key: 'username',
			sorter: (a, b) => a.username.localeCompare(b.username),
		},
		{
			title: t('clients.fullName', 'Полное имя'),
			key: 'fullName',
			render: (text, record) => `${record.first_name} ${record.last_name}`,
		},
		{
			title: t('clients.email', 'Email'),
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: t('clients.role', 'Роль'),
			dataIndex: 'role',
			key: 'role',
			render: (currentRole, record) => {
				// Если в бэкенде бывает role === 'internal_manager',
				// то мы не даём его выбрать – но можем отображать, если вдруг попадётся
				return (
					<Select
						style={{ width: 150 }}
						value={currentRole}
						onChange={(newRole) => {
							if (newRole === 'internal_manager') {
								message.error(t('clients.invalidRole', 'Неверная роль'));
							} else {
								handleUpdateClient(record.id, 'role', newRole);
							}
						}}
						options={ALLOWED_ROLES}
					/>
				);
			},
		},
		{
			title: t('clients.clientGroup', 'Группа клиента'),
			dataIndex: 'client_group_name',
			// Предположим, бэкенд возвращает поле client_group_name для удобства.
			// Или может быть "client_group" – тогда нужно будет сопоставить id <-> name.
			key: 'client_group_name',
			render: (currentGroupName, record) => {
				return (
					<Select
						style={{ width: 180 }}
						value={currentGroupName || ''}
						onChange={(newGroupName) => {
							// ищем соответствующий объект группы, чтобы при нужде передать id
							// (зависит от того, как у вас API ожидает – по имени или по id)
							handleUpdateClient(record.id, 'client_group', newGroupName);
						}}
					>
						{clientGroups.map((grp) => (
							<Option key={grp.id} value={grp.id}>
								{grp.name}
							</Option>
						))}
					</Select>
				);
			},
		},
	];

	/**
	 * Фильтрация по тексту (username, first_name, last_name)
	 */
	const filteredData = clients.filter((client) => {
		const search = searchText.toLowerCase();
		return (
			client.username.toLowerCase().includes(search) ||
			(client.first_name && client.first_name.toLowerCase().includes(search)) ||
			(client.last_name && client.last_name.toLowerCase().includes(search))
		);
	});

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

			<Table
				columns={columns}
				dataSource={filteredData}
				rowKey="id"
				loading={loading}
			/>
		</div>
	);
}
