// src/pages/admin/clients/components/ClientsTable.jsx
import { Table, Select, message } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const ALLOWED_ROLES = [
	{ value: 'client_admin', label: 'Client Admin' },
	{ value: 'client_manager', label: 'Client Manager' },
	{ value: 'client_user', label: 'Client User' },
];

/**
 * @param {Array} clients - список клиентов
 * @param {Array} clientGroups - [{id, name}, ...]
 * @param {boolean} loading - флаг загрузки
 * @param {Function} onUpdateClient - (clientId, field, value) => void
 * @param {string} searchText - строка поиска
 */
export function ClientsTable({
								 clients,
								 clientGroups,
								 loading,
								 onUpdateClient,
								 searchText,
							 }) {
	const { t } = useTranslation();

	// Фильтрация
	const filteredData = clients.filter((client) => {
		const search = searchText.toLowerCase();
		return (
			client.username.toLowerCase().includes(search) ||
			(client.first_name && client.first_name.toLowerCase().includes(search)) ||
			(client.last_name && client.last_name.toLowerCase().includes(search))
		);
	});

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
			render: (currentRole, record) => (
				<Select
					style={{ width: 150 }}
					value={currentRole}
					onChange={(newRole) => {
						if (newRole === 'internal_manager') {
							message.error(t('clients.invalidRole', 'Неверная роль'));
						} else {
							onUpdateClient(record.id, 'role', newRole);
						}
					}}
					options={ALLOWED_ROLES}
				/>
			),
		},
		{
			title: t('clients.clientGroup', 'Группа клиента'),
			dataIndex: 'client_group_name',
			key: 'client_group_name',
			render: (currentGroupName, record) => (
				<Select
					style={{ width: 180 }}
					value={currentGroupName || ''}
					onChange={(newGroupId) => {
						onUpdateClient(record.id, 'client_group', newGroupId);
					}}
				>
					{clientGroups.map((grp) => (
						<Option key={grp.id} value={grp.id}>
							{grp.name}
						</Option>
					))}
				</Select>
			),
		},
	];

	return (
		<Table
			columns={columns}
			dataSource={filteredData}
			rowKey="id"
			loading={loading}
		/>
	);
}
