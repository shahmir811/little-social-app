import React, { useState, Fragment } from 'react';
import { Icon, Button, Confirm } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { FETCH_POSTS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup';

const DeleteButton = (props) => {
	const [confirmOpen, setConfirmOpen] = useState(false);

	const mutation = props.commentId
		? DELETE_COMMENT_MUTATION
		: DELETE_POST_MUTATION;

	const [deletePostOrMutation] = useMutation(mutation, {
		update(proxy) {
			setConfirmOpen(false);
			if (props.callback) props.callback();
		},
		variables: { postId: props.postId, commentId: props.commentId },
		// Following code is added to remove post from cache
		refetchQueries: [{ query: FETCH_POSTS_QUERY }],
	});

	return (
		<Fragment>
			<MyPopup
				content={`${props.commentId ? 'Delete Comment' : 'Delete Post'} `}
			>
				<Button
					as="div"
					color="red"
					floated="right"
					onClick={() => setConfirmOpen(true)}
				>
					<Icon name="trash" style={{ margin: 0 }} />
				</Button>
			</MyPopup>

			<Confirm
				open={confirmOpen}
				onCancel={() => setConfirmOpen(false)}
				onConfirm={deletePostOrMutation}
			></Confirm>
		</Fragment>
	);
};

const DELETE_POST_MUTATION = gql`
	mutation deletePost($postId: ID!) {
		deletePost(postId: $postId)
	}
`;

const DELETE_COMMENT_MUTATION = gql`
	mutation deleteComment($postId: ID!, $commentId: ID!) {
		deleteComment(postId: $postId, commentId: $commentId) {
			id
			comments {
				id
				username
				createdAt
				body
			}
			commentCount
		}
	}
`;

export default DeleteButton;
