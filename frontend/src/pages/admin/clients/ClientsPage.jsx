/* ─── src/pages/admin/clients/ClientsPage.jsx ─── */
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { message } from 'antd';

import { selectCurrentLang } from '../../../store/langSlice';
import { transformLangToServer } from '../../../utils';

import {
	useGetClientsQuery,
	useGetGroupsQuery,
	usePatchClientMutation,
} from '../../../features/clients/clientsApi';

import { LoadingWrapper } from '../../../shared/ui/LoadingWrapper';
import { ClientsTable } from '../../../entities/client/ui/ClientsTable/ClientsTable';

export function ClientsPage() {
	const { t } = useTranslation();
	const lang = transformLangToServer(useSelector(selectCurrentLang));

	const {
		data: clients = [],
		isFetching: loadC,
		error: errC,
	} = useGetClientsQuery(lang, { keepPreviousData: true });

	const { data: groups = [], isFetching: loadG, error: errG } = useGetGroupsQuery();

	const [patchClient] = usePatchClientMutation();

	const loading = loadC || loadG;
	const error = errC || errG ? t('common.loadError', 'Ошибка загрузки данных') : null;

	const handlePatch = async (id, groupId) => {
		try {
			await patchClient({ id, payload: { client_group: groupId }, lang }).unwrap();
			message.success(t('clients.updated', 'Обновлено'));
		} catch {
			message.error(t('clients.errUpdate', 'Не удалось обновить'));
		}
	};

	return (
		<div style={{ padding: 16 }}>
			<h2>{t('clients.title', 'Клиенты')}</h2>

			<LoadingWrapper loading={loading} error={error} data={clients}>
				<ClientsTable
					clients={clients}
					groups={groups}
					loading={loading}
					onPatch={handlePatch}
				/>
			</LoadingWrapper>
		</div>
	);
}
