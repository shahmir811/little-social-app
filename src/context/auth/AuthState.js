import React, { useReducer } from 'react';
import jwtDecode from 'jwt-decode';

import AuthContext from './authContext';
import AuthReducer from './AuthReducer';

import { LOGIN, LOGOUT } from '../types';

const AuthState = (props) => {
	const INITIAL_STATE = {
		user: null,
	};

	if (localStorage.getItem('jwtToken')) {
		const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

		if (decodedToken.exp * 1000 < Date.now()) {
			localStorage.removeItem('jwtToken');
		} else {
			INITIAL_STATE.user = decodedToken;
		}
	}

	const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

	// login user
	const login = (userData) => {
		localStorage.setItem('jwtToken', userData.token);
		dispatch({
			type: LOGIN,
			payload: userData,
		});
	};

	// logout user
	const logout = () => {
		localStorage.removeItem('jwtToken');
		dispatch({ type: LOGOUT });
	};

	return (
		<AuthContext.Provider
			value={{
				user: state.user,
				login,
				logout,
			}}
			{...props}
		/>
	);
};

export default AuthState;
