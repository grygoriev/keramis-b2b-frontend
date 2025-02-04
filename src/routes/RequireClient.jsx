import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireClient({ children }) {
	const role = localStorage.getItem('role'); // 'client_admin', 'client_user', etc.

	if (!role?.includes('client')) {
		return <Navigate to="/login" />;
	}
	return children;
}
