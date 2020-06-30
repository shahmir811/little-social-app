import { LOGIN, LOGOUT } from '../types';

export default (state, action) => {
	const { type, payload } = action;

	switch (type) {
		case LOGIN:
			return {
				...state,
				user: payload,
			};

		case LOGOUT:
			return {
				...state,
				user: null,
			};

		default:
			return state;
	}
};
