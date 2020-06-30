import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthContext from '../context/auth/authContext';

const AuthRoute = ({ component: Component, ...rest }) => {
	const authContext = useContext(AuthContext);
	const { user } = authContext;

	return (
		<Route
			{...rest}
			render={(props) =>
				user ? <Redirect to="/" /> : <Component {...props} />
			}
		/>
	);
};

export default AuthRoute;
