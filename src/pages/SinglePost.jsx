import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import moment from 'moment';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
	Grid,
	Image,
	Card,
	Button,
	Icon,
	Label,
	Form,
} from 'semantic-ui-react';

import AuthContext from '../context/auth/authContext';
import MyPopup from '../util/MyPopup';

import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

const SinglePost = (props) => {
	// Using Auth Context
	const authContext = useContext(AuthContext);
	const { user } = authContext;

	const commentInputRef = useRef(null);
	const [comment, setComment] = useState('');

	const postId = props.match.params.postId;

	const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
		update: () => {
			setComment('');
			commentInputRef.current.blur();
		},
		variables: {
			postId,
			body: comment,
		},
	});

	const { loading, error, data } = useQuery(FETCH_POST_QUERY, {
		variables: {
			postId,
		},
	});

	let postMarkup;

	const deletePostCallback = () => {
		props.history.push('/');
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error.</p>;

	if (!data.getPost) {
		postMarkup = <p>Loading Post...</p>;
	} else {
		const {
			id,
			body,
			createdAt,
			username,
			comments,
			likes,
			likeCount,
			commentCount,
		} = data.getPost;
		const post = {
			id,
			body,
			createdAt,
			username,
			comments,
			likes,
			likeCount,
			commentCount,
		};

		postMarkup = (
			<Grid>
				<Grid.Row>
					<Grid.Column width={2}>
						<Image
							floated="right"
							size="small"
							src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
						/>
					</Grid.Column>

					<Grid.Column width={10}>
						<Card fluid>
							<Card.Content>
								<Card.Header>{username}</Card.Header>
								<Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
								<Card.Description>{body}</Card.Description>
							</Card.Content>
							<hr />
							<Card.Content extra>
								<LikeButton user={user} post={post} />
								<MyPopup content="Comment on this post">
									<Button
										as="div"
										labelPosition="right"
										onClick={() => console.log('Comment on post')}
									>
										<Button basic color="blue">
											<Icon name="comments" />
										</Button>
										<Label basic color="blue" pointing="left">
											{commentCount}
										</Label>
									</Button>
								</MyPopup>

								{user && user.username === username && (
									<DeleteButton
										postId={post.id}
										callback={deletePostCallback}
									/>
								)}
							</Card.Content>
						</Card>
						{user && (
							<Card fluid>
								<Card.Content>
									<p>Post a comment</p>
									<Form>
										<div className="ui action input fluid">
											<input
												type="text"
												name="comment"
												placeholder="Comment..."
												value={comment}
												onChange={(e) => setComment(e.target.value)}
												ref={commentInputRef}
											/>
											<button
												type="submit"
												className="ui button teal"
												disabled={comment.trim() === ''}
												onClick={submitComment}
											>
												Submit
											</button>
										</div>
									</Form>
								</Card.Content>
							</Card>
						)}
						{comments.map((comment) => (
							<Card fluid key={comment.id}>
								<Card.Content>
									{user && user.username === comment.username && (
										<DeleteButton postId={id} commentId={comment.id} />
									)}
									<Card.Header>{comment.username}</Card.Header>
									<Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
									<Card.Description>{comment.body}</Card.Description>
								</Card.Content>
							</Card>
						))}
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}

	return postMarkup;
};

const SUBMIT_COMMENT_MUTATION = gql`
	mutation($postId: String!, $body: String!) {
		createComment(postId: $postId, body: $body) {
			id
			comments {
				id
				body
				createdAt
				username
			}
			commentCount
		}
	}
`;

const FETCH_POST_QUERY = gql`
	query($postId: ID!) {
		getPost(postId: $postId) {
			id
			body
			createdAt
			username
			likeCount
			likes {
				username
			}
			commentCount
			comments {
				id
				username
				createdAt
				body
			}
		}
	}
`;

export default SinglePost;
