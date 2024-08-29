import { csrfFetch } from "./csrf";

const initialState = {};

const LOAD = "reviews/LOAD";
const DELETE = "reviews/DELETE"

const load = (reviews) => {
	return {
		type: LOAD,
		payload: reviews,
	};
};

const remove = (id) => {
	return {
		type : DELETE,
		payload: id
	}
}

export const getReviews = (id) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots/${id}/reviews`);
	if (res.ok) {
		let data = await res.json();
		data = data.Reviews;
		dispatch(load(data));
		return data.Reviews;
	}
};

export const getUserReviews = () => async (dispatch) => {
	const res = await csrfFetch(`/api/reviews/current`);
	if (res.ok) {
		let data = await res.json();
		data = data.Reviews;
		dispatch(load(data));
		return data.Reviews;
	}
};

export const deleteReview = (id) => async (dispatch) => {
	const res = await csrfFetch(`/api/reviews/${id}`, {
		method: "DELETE"
	})

	if(res.ok) {
		const data = await res.json()
		dispatch(remove(id));
		return data
	} else {
		console.error(await res.json())
	}
}

export default function reviewsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD: {
			const newState = {};
			action.payload.forEach((review) => {
				newState[review.id] = review;
			});

			return newState;
		}

		case DELETE : {
			const newState = {...state}
			delete newState[action.payload]
			return newState;
		}

		default:
			return state;
	}
}
