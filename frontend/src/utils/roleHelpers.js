// src/utils/roleHelpers.js
export function getDashboardPath(role) {
	return role === 'internal_manager' ? '/admin/dashboard' : '/client/dashboard';
}
