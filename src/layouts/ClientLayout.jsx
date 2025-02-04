import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { GlobalHeader } from '../components/GlobalHeader';

const { Header, Content } = Layout;

export default function ClientLayout() {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header style={{ background: '#fff', padding: '0 16px',
				display: 'flex', justifyContent: 'space-between',
				alignItems: 'center'}}>
				<h2 style={{ margin: 0 }}>Client Layout</h2>
				+        <GlobalHeader />
			</Header>
			<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
				<Outlet />
			</Content>
		</Layout>
	);
}
