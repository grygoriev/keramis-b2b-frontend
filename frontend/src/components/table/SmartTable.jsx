/* src/components/side-menu/SideMenu.jsx */
import { Table, Spin, Grid } from 'antd';
import s from './SmartTable.module.css';

const { useBreakpoint } = Grid;

export function SmartTable({
							   data, columns, loading=false,
							   mobileRenderer,  // (record)=>ReactNode
							   rowKey='id',     ...rest
						   }){
	const screens  = useBreakpoint();
	const isMobile = !screens.lg;

	const expandable = isMobile && mobileRenderer
		? { expandedRowRender: mobileRenderer }
		: undefined;

	return (
		<Spin spinning={loading}>
			<Table
				rowKey={rowKey}
				columns={columns}
				dataSource={data}
				pagination={false}
				scroll={{ x:768 }}
				expandable={expandable}
				className={s.table}
				{...rest}
			/>
		</Spin>
	);
}
