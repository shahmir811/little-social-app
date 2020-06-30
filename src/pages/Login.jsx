import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import AuthContext from '../context/auth/authContext';

const Login = (props) => {
	// using context
	const authContext = useContext(AuthContext);
	const { login } = authContext;

	const [errors, setErrors] = useState({});
	const [values, setValues] = useState({
		username: '',
		password: '',
	});

	const { username, password } = values;

	const onSubmitHandler = (e) => {
		e.preventDefault();
		setErrors({});
		loginUser();
	};

	const onChangeHandler = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const [loginUser, { loading }] = useMutation(LOGIN_USER, {
		// update function will be executed if mutation is successfully executed
		update: (proxy, result) => {
			login(result.data.login);
			props.history.push('/');
		},
		onError: (err) => {
			setErrors(err.graphQLErrors[0].extensions.exception.errors);
		},
		variables: values,
	});

	return (
		<div className="form-container">
			<Form
				onSubmit={onSubmitHandler}
				noValidate
				className={loading ? 'loading' : ''}
			>
				<h1>Login</h1>
				<Form.Input
					label="Username"
					placeholder="Username ..."
					name="username"
					type="text"
					value={username}
					error={errors.username ? true : false}
					onChange={onChangeHandler}
				/>
				<Form.Input
					label="Password"
					placeholder="Password ..."
					name="password"
					type="password"
					value={password}
					error={errors.password ? true : false}
					onChange={onChangeHandler}
				/>

				<Button type="submit" primary>
					Login
				</Button>
			</Form>
			{Object.keys(errors).length > 0 && (
				<div className="ui error message">
					<ul className="list">
						{Object.values(errors).map((value) => (
							<li key={value}>{value}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

const LOGIN_USER = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Login;
