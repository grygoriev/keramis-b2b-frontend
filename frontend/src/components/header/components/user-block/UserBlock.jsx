// src/components/header/components/user-block/UserBlock.jsx
import { Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

export function UserBlock({
							  isLoggedIn,
							  username,
							  dashboardPath,
							  onLogout,
						  }) {
	if (!isLoggedIn) {
		// Если не залогинен – показываем ссылку на логин
		return (
			<Link to="/login">
				<Button type="primary">Login</Button>
			</Link>
		);
	}

	// Иначе показываем «Hello, username» + Logout
	return (
		<>
			{username && (
				<Tooltip title="Перейти в кабинет">
					<Link to={dashboardPath} style={{ color: 'inherit' }}>
						Hello, {username}
					</Link>
				</Tooltip>
			)}
			<Button danger onClick={onLogout}>
				Logout
			</Button>
		</>
	);
}
