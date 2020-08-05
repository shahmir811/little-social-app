import React, { useContext } from 'react';
import gql from 'graphql-tag';
import moment from 'moment';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Image, Card, Button, Icon, Label } from 'semantic-ui-react';

import AuthContext from '../context/auth/authContext';

import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

const SinglePost = (props) => {
	// Using Auth Context
	const authContext = useContext(AuthContext);
	const { user } = authContext;

	const postId = props.match.params.postId;
	console.log('POSTID: ', postId);

	// const {
	// 	data: { getPost },
	// } = useQuery(FETCH_POST_QUERY, {
	// 	variables: { postId },
	// });

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
								<Button
									as="div"
									labelPosition="right"
									onClick={() => console.log('Comment on post')}
								>
									<Button basic color="blur">
										<Icon name="comments" />
									</Button>
									<Label basic color="blue" pointing="left">
										{commentCount}
									</Label>
								</Button>
								{user && user.username === username && (
									<DeleteButton
										postId={post.id}
										callback={deletePostCallback}
									/>
								)}
							</Card.Content>
						</Card>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}

	return postMarkup;
};

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
