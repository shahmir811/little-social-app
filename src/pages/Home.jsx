import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Grid } from 'semantic-ui-react';

import PostCard from '../components/PostCard';

const Home = () => {
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
			<Grid.Row className="page-title">
				<h1>Recent posts</h1>
			</Grid.Row>
			<Grid.Row>
				{data.getPosts &&
					data.getPosts.map((post) => (
						<Grid.Column key={post.id}>
							<PostCard post={post} />
						</Grid.Column>
					))}
			</Grid.Row>
		</Grid>
	);
};

const FETCH_POSTS_QUERY = gql`
	query {
		getPosts {
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

export default Home;
