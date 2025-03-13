import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectUserRole } from '../store/authSlice.js';

export default function RequireAdmin({ children }) {
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const role = useSelector(selectUserRole);

	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}

	if (role !== 'internal_manager') {
		return <Navigate to="/forbidden" />;
	}
	return children;
}
