/* ── src/entities/client/ui/ClientUsers/ClientUsers.jsx ── */
import { useState } from 'react';
import { Table, Button, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import { AssignUserModal } from './AssignUserModal';
import s from './ClientUsers.module.css';

/**
 * @param users            массив пользователей клиента
 * @param onUnlink         (userId)=>void
 * @param onLink           (userObj)=>void
 */
export function ClientUsers({ users = [], onUnlink, onLink }) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const columns = [
		{
			title: t('users.username', 'Логин'),
			dataIndex: 'username',
		},
		{
			title: t('users.name', 'Имя'),
			render: (_, u) =>
				`${u.first_name || ''} ${u.last_name || ''}`.trim() || '—',
		},
		{
			title: t('users.email', 'E-mail'),
			dataIndex: 'email',
		},
		{
			key: 'actions',
			align: 'right',
			render: (_, u) => (
				<Popconfirm
					title={t('users.unlink', 'Отвязать пользователя?')}
					okText={t('common.yes', 'Да')}
					cancelText={t('common.no', 'Нет')}
					onConfirm={() => onUnlink(u.id)}
				>
					<Tooltip title={t('users.unlink', 'Отвязать')}>
						<Button
							type="text"
							size="small"
							icon={<DeleteOutlined />}
						/>
					</Tooltip>
				</Popconfirm>
			),
		},
	];

	return (
		<div className={s.block}>
			<div className={s.titleRow}>
				<h3 className={s.title}>{t('users.title', 'Пользователи')}</h3>
				<Button
					type="primary"
					size="small"
					icon={<PlusOutlined />}
					onClick={() => setOpen(true)}
				>
					{t('users.add', 'Добавить')}
				</Button>
			</div>

			<Table
				rowKey="id"
				columns={columns}
				dataSource={users}
				size="small"
				pagination={false}
			/>

			{open && (
				<AssignUserModal
					open={open}
					onClose={() => setOpen(false)}
					onSelectUser={(u) => {
						onLink(u);
						setOpen(false);
					}}
					existingIds={users.map((u) => u.id)}
				/>
			)}
		</div>
	);
}
