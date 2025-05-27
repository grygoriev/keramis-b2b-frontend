/* ─── src/pages/admin/clients/ClientPage.jsx ─── */
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, Select, Spin, message, Button } from 'antd';

import { selectCurrentLang } from '../../../store/langSlice';
import { transformLangToServer } from '../../../utils';

import {
	useGetClientDetailQuery,
	useGetGroupsQuery,
	usePatchClientMutation,
} from '../../../features/clients/clientsApi';

import { BalanceList } from '../../../shared/ui/BalanceList/BalanceList';
import css from './ClientPage.module.css';

export function ClientPage() {
	const { id } = useParams(); // numeric
	const { t } = useTranslation();

	/* текущий интерфейс-язык (передаём на сервер, если нужно перевести name) */
	const lang = transformLangToServer(useSelector(selectCurrentLang));

	/* ─── данные клиента (один запрос) ─────────────────────────────── */
	const {
		data: client,
		isFetching: loadClient,
		error: errClient,
	} = useGetClientDetailQuery({ id, lang });

	/* ─── список групп ─────────────────────────────────────────────── */
	const { data: groups = [], isFetching: loadGroups } = useGetGroupsQuery();

	const [patchClient] = usePatchClientMutation();

	if (loadClient || loadGroups) return <Spin style={{ margin: 40 }} />;
	if (errClient || !client) return <p style={{ margin: 40 }}>Error</p>;

	/* смена группы */
	const handleGroup = async (val) => {
		try {
			await patchClient({ id: client.id, payload: { client_group: val } }).unwrap();
			message.success(t('clients.updated', 'Обновлено'));
		} catch {
			message.error(t('clients.errUpdate', 'Ошибка'));
		}
	};

	return (
		<div className={css.wrapper}>
			<Button type="link">
				<Link to="/admin/clients">{t('common.back', 'Назад к списку')}</Link>
			</Button>

			<Card className={css.card}>
				<h2>{client.name}</h2>

				<div>
					<b>{t('clients.code', 'Код')}:</b> {client.code}
				</div>

				<div>
					<b>{t('clients.group', 'Группа')}:</b>{' '}
					<Select
						size="small"
						value={client.client_group ?? ''}
						onChange={handleGroup}
						style={{ width: 200 }}
					>
						{groups.map((g) => (
							<Select.Option key={g.id} value={g.id}>
								{g.name}
							</Select.Option>
						))}
					</Select>
				</div>

				{/* баланс из detail */}
				{client.balances && <BalanceList balance={client.balances} />}
			</Card>
		</div>
	);
}
