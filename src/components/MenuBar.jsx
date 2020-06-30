import React, { useState, useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import AuthContext from '../context/auth/authContext';

const MenuBar = () => {
	// using context
	const authContext = useContext(AuthContext);
	const { user, logout } = authContext;

	const pathname = window.location.pathname;
	const path = pathname === '/' ? 'home' : pathname.substr(1);

	const [activeItem, setActiveItem] = useState(path);

	const handleItemClick = (e, { name }) => setActiveItem(name);

	if (user) {
		return (
			<Menu pointing secondary size="massive" color="teal">
				<Menu.Item
					name={user.username}
					active={activeItem === 'home'}
					as={Link}
					to="/"
				/>
				<Menu.Menu position="right">
					<Menu.Item name="logout" onClick={logout} />
				</Menu.Menu>
			</Menu>
		);
	}

	return (
		<Menu pointing secondary size="massive" color="teal">
			<Menu.Item
				name="home"
				active={activeItem === 'home'}
				onClick={handleItemClick}
				as={Link}
				to="/"
			/>
			<Menu.Menu position="right">
				<Menu.Item
					name="login"
					active={activeItem === 'login'}
					onClick={handleItemClick}
					as={Link}
					to="/login"
				/>
				<Menu.Item
					name="register"
					active={activeItem === 'register'}
					onClick={handleItemClick}
					as={Link}
					to="/register"
				/>
			</Menu.Menu>
		</Menu>
	);
};

export default MenuBar;
