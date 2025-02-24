import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireAdmin({ children }) {
	// Берем роль из localStorage
	const role = localStorage.getItem('role'); // 'internal_manager', 'admin' и т.д.

	if (role !== 'internal_manager') {
		return <Navigate to="/forbidden" />;
	}
	return children;
}
