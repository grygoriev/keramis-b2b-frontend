/* ── src/entities/client/ui/ClientUsers/AssignUserModal.jsx ── */
import { useState, useEffect } from 'react';
import { Modal, Input, List, Spin, Empty } from 'antd';
import { useTranslation } from 'react-i18next';

import {
	useSearchClientUsersQuery,
} from '../../../../features/clients/clientsApi';

export function AssignUserModal({ open, onClose, onSelectUser, existingIds }) {
	const { t } = useTranslation();
	const [term, setTerm] = useState('');
	const { data = [], isFetching } = useSearchClientUsersQuery(
		{ search: term },
		// { skip: term.trim().length < 2 },
	);

	// отфильтровываем уже привязанных
	const list = data.filter((u) => !existingIds.includes(u.id));

	// очистка при открытии
	useEffect(() => {
		if (open) setTerm('');
	}, [open]);

	return (
		<Modal
			open={open}
			title={t('users.addUser', 'Добавить пользователя')}
			onCancel={onClose}
			footer={null}
		>
			<Input
				placeholder={t('users.search', 'Поиск (min 2 символа)…')}
				value={term}
				onChange={(e) => setTerm(e.target.value)}
				style={{ marginBottom: 12 }}
			/>

			{isFetching ? (
				<Spin />
			) : list.length === 0 ? (
				<Empty description={t('users.notFound', 'Не найдено')} />
			) : (
				<List
					dataSource={list}
					renderItem={(u) => (
						<List.Item
							style={{ cursor: 'pointer' }}
							onClick={() => onSelectUser(u)}
						>
							<b>{u.username}</b> — {u.first_name} {u.last_name}
						</List.Item>
					)}
				/>
			)}
		</Modal>
	);
}
