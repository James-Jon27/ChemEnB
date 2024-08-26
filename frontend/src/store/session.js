import { csrfFetch } from "./csrf";

//no user logged in
const initialState = { user: null };

const CURR_USER = "session/ACTIVE";
const REMOVE_USER = "session/REMOVE";

const logIn = (userInformation) => {
	return {
		type: CURR_USER,
		payload: userInformation,
	};
};

const logOut = () => {
	return {
		type: REMOVE_USER,
	};
};

export const loginThunk = (logInCredentials) => async (dispatch) => {
	const { credential, password } = logInCredentials;
	const res = await csrfFetch(`/api/session`, {
		method: "POST",
		body: JSON.stringify({ credential, password }),
	});

	if (res.ok) {
		const credentials = await res.json();
		dispatch(logIn(credentials.user));
		return res;
	}
};

export const restoreUser = () => async (dispatch) => {
	const res = await fetch(`/api/session`);
	if (res.ok) {
		const data = await res.json();
		dispatch(logIn(data.user));
	}
};

export const signUp = (userS) => async (dispatch) => {
        const { username, firstName, lastName, email, password } = userS;
		const res = await csrfFetch(`api/users`, {
			method: "POST",
			body: JSON.stringify({
				username,
				firstName,
				lastName,
				email,
				password,
			}),
		});
		const user = await res.json();
		dispatch(logIn(user.user));
	};

export const logoutThunk = () => async (dispatch) => {
	const res = await csrfFetch(`/api/session`, {
		method: "DELETE"
	});

	const data = await res.json();
	dispatch(logOut());
	return data;
};

export default function sessionReducer(state = initialState, action) {
	switch (action.type) {
		case CURR_USER: {
			const newState = { ...state, user: action.payload };
			return newState;
		}

		case REMOVE_USER: {
			const newState = { ...state, user: null };
			return newState;
		}
		default:
			return state;
	}
}
