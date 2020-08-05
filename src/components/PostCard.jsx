import React, { useContext } from 'react';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import AuthContext from '../context/auth/authContext';

import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

const PostCard = (props) => {
	// Using AuthContext
	const authContext = useContext(AuthContext);
	const { user } = authContext;

	const {
		id,
		body,
		createdAt,
		username,
		// likeCount,
		commentCount,
		// likes,
	} = props.post;

	const commentOnPost = () => {
		console.log('Comment on post function');
	};

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="right"
					size="mini"
					src="https://react.semantic-ui.com/images/avatar/large/jenny.jpg"
				/>
				<Card.Header>{username}</Card.Header>
				<Card.Meta as={Link} to={`/posts/${id}`}>
					{moment(createdAt).fromNow(true)}
				</Card.Meta>
				<Card.Description>{body}</Card.Description>
			</Card.Content>
			<Card.Content extra>
				<LikeButton user={user} post={props.post} />

				<Button
					labelPosition="right"
					as={Link}
					to={`/posts/${id}`}
					onClick={commentOnPost}
				>
					<Button color="blue" basic>
						<Icon name="comments" />
					</Button>
					<Label basic color="blue" pointing="left">
						{commentCount}
					</Label>
				</Button>
				{user && user.username === username && <DeleteButton postId={id} />}
			</Card.Content>
		</Card>
	);
};

export default PostCard;
