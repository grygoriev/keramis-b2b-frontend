import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Header, Content } = Layout;

export default function ClientLayout() {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header style={{ background: '#fff', padding: '0 16px' }}>
				<h2>Client Layout</h2>
			</Header>
			<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
				<Outlet />
			</Content>
		</Layout>
	);
}
