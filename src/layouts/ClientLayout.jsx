import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { GlobalHeader } from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter.jsx';

const { Header, Content, Footer } = Layout;

export default function ClientLayout() {
	return (
		<Layout style={{ minHeight: '100vh' }}>
			<GlobalHeader />
			<Header
				style={{
					background: '#fff',
					padding: '0 16px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<h2 style={{ margin: 0 }}>Client Layout</h2>
			</Header>
			<Content style={{ margin: '16px', background: '#fff', padding: 16 }}>
				<Outlet />
			</Content>
			<Footer style={{ padding: 0 }}>
				<GlobalFooter />
			</Footer>
		</Layout>
	);
}
