import { useSelector } from 'react-redux';
import { selectCurrencyRates, selectCurrencyStatus } from '../../../../store/currencySlice';
import { Tooltip, Spin } from 'antd';

export function Currency() {
	const rates  = useSelector(selectCurrencyRates);   // { USD: 41.6, … }
	const status = useSelector(selectCurrencyStatus);  // loading / …

	if (status === 'loading') return <Spin size="small" />;
	if (!rates || Object.keys(rates).length === 0) return null;

	// Что показываем в шапке (можно расширить)
	const show = ['USD', 'EUR'];

	return (
		<span style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
      {show.map((code, idx) => (
		  rates[code] && (
			  <Tooltip title={`1 ${code} = ${rates[code]}`} key={code}>
            <span style={{ marginRight: idx === show.length - 1 ? 0 : 8 }}>
              {code}&nbsp;{rates[code]}
            </span>
			  </Tooltip>
		  )
	  ))}
    </span>
	);
}
