import React, { useState, Fragment } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { FETCH_POSTS_QUERY } from '../util/graphql';

const PostForm = () => {
	// const [errors, setErrors] = useState({});
	const [values, setValues] = useState({
		body: '',
	});

	const { body } = values;

	const onSubmitHandler = (e) => {
		e.preventDefault();
		createPost();
	};

	const onChangeHandler = (e) => {
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
		update: (proxy, result) => {
			values.body = '';
		},
		onError: (err) => {
			console.log('PostForm err', err);
		},
		variables: values,
		refetchQueries: [{ query: FETCH_POSTS_QUERY }],
	});

	return (
		<Fragment>
			<Form onSubmit={onSubmitHandler}>
				<h2>Create a post:</h2>
				<Form.Field>
					<Form.Input
						placeholder="Aoa"
						name="body"
						onChange={onChangeHandler}
						value={body}
						error={error ? true : false}
					/>
					<Button type="submit" color="teal">
						Submit
					</Button>
				</Form.Field>
			</Form>
			{error && (
				<div className="ui error message" style={{ marginBottom: 20 }}>
					<ul className="list">
						<li>{error.graphQLErrors[0].message}</li>
					</ul>
				</div>
			)}
		</Fragment>
	);
};

const CREATE_POST_MUTATION = gql`
	mutation createPost($body: String!) {
		createPost(body: $body) {
			id
			body
			createdAt
			username
			likes {
				id
				username
				createdAt
			}
			likeCount
			comments {
				id
				body
				username
				createdAt
			}
			commentCount
		}
	}
`;

export default PostForm;
