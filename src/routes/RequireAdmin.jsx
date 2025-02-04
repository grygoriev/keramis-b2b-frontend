import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireAdmin({ children }) {
	// Допустим, роль хранится в localStorage
	const role = localStorage.getItem('role'); // 'internal_manager', 'admin' и т.д.

	if (role !== 'internal_manager' && role !== 'admin') {
		return <Navigate to="/login" />;
	}
	return children;
}
