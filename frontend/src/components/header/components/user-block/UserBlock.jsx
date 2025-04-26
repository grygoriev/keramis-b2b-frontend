// src/components/header/components/user-block/UserBlock.jsx
import { Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

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
			{/* десктоп — текст, мобайл — скрыт через CSS */}
			<Link to={dashboardPath} className="user-block__hello" style={{color:'inherit'}}>
				Hello,&nbsp;{username}
			</Link>

			{/* иконка всегда видна; на десктопе можно скрыть, если не нужно */}
			<Link to={dashboardPath} className="user-block__icon" style={{color:'inherit'}}>
				<UserOutlined style={{fontSize:20}}/>
			</Link>

			<Button danger onClick={onLogout}>
				Logout
			</Button>
		</>
	);
}
