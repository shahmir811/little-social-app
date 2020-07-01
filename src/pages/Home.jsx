import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';

import AuthContext from '../context/auth/authContext';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

const Home = () => {
	// Using AuthContext
	const authContext = useContext(AuthContext);
	const { user } = authContext;

	const { loading, data } = useQuery(FETCH_POSTS_QUERY);

	if (loading) {
		return (
			<Grid>
				<Grid.Row className="page-title">Loading posts...</Grid.Row>
			</Grid>
		);
	}

	return (
		<Grid columns={3}>
			{user && (
				<Grid.Column>
					<PostForm />
				</Grid.Column>
			)}
			<Grid.Row className="page-title">
				<h1>Recent posts</h1>
			</Grid.Row>
			<Grid.Row>
				<Transition.Group>
					{data &&
						data.getPosts.map((post) => (
							<Grid.Column key={post.id}>
								<PostCard post={post} />
							</Grid.Column>
						))}
				</Transition.Group>
			</Grid.Row>
		</Grid>
	);
};

export default Home;
