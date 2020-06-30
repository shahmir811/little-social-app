import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import AuthContext from '../context/auth/authContext';

const Register = (props) => {
	// using context
	const authContext = useContext(AuthContext);
	const { login } = authContext;

	const [errors, setErrors] = useState({});
	const [values, setValues] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const { username, email, password, confirmPassword } = values;

	const onSubmitHandler = (e) => {
		e.preventDefault();
		setErrors({});
		addUser();
	};

	const onChangeHandler = (e) => {
		setValues({
			...values,
			[e.target.name]: e.target.value,
		});
	};

	const [addUser, { loading }] = useMutation(REGISTER_USER, {
		update: (proxy, result) => {
			// update function will be executed if mutation is successfully executed
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
				<h1>Register</h1>
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
					label="Email"
					placeholder="Email ..."
					name="email"
					type="email"
					value={email}
					error={errors.email ? true : false}
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
				<Form.Input
					label="Confirm Password"
					placeholder="Confirm Password"
					name="confirmPassword"
					type="password"
					value={confirmPassword}
					error={errors.confirmPassword ? true : false}
					onChange={onChangeHandler}
				/>

				<Button type="submit" primary>
					Register
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

const REGISTER_USER = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$confirmPassword: String!
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			username
			createdAt
			token
		}
	}
`;

export default Register;
