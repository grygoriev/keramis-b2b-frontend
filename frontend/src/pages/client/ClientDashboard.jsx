// src/pages/client/ClientDashboard.jsx
import { useEffect, useState } from 'react';
import { Spin, Alert }         from 'antd';
import { DashboardHeader }     from './components/DashboardHeader';
import { DiscountsTable }      from './components/DiscountsTable';
import { BalanceList }         from './components/BalanceList';

import { fetchMyDiscounts, fetchMyBalance } from '../../api/clientDashboardApi';
import s from './ClientDashboard.module.css';

export const ClientDashboard = () => {
	const [loading, setLoading]   = useState(true);
	const [error  , setError]     = useState(null);
	const [data   , setData]      = useState({
		client   : null,
		user     : null,
		discounts: [],
		balance  : [],
	});

	useEffect(() => {
		(async () => {
			try{
				const [disc, bal] = await Promise.all([
					fetchMyDiscounts(),
					fetchMyBalance(),
				]);
				setData({
					client   : disc.client,
					user     : disc.user,
					discounts: disc.discounts,
					balance  : bal,
				});
			}catch(e){
				setError(e?.message || String(e));
			}finally{
				setLoading(false);
			}
		})();
	}, []);

	if (loading) return <Spin style={{margin:40}}/>;
	if (error)   return <Alert type="error" message={error} style={{margin:40}}/>;

	return (
		<div className={s.container}>
			<DashboardHeader client={data.client} user={data.user}/>
			<DiscountsTable  discounts={data.discounts}/>
			<BalanceList     balance={data.balance}/>
		</div>
	);
};
