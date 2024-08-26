import { csrfFetch } from "./csrf";

const initialState = {};

const LOAD = "reviews/LOAD";

const load = (reviews) => {
	return {
		type: LOAD,
		payload: reviews,
	};
};

export const getReviews = (id) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots/${id}/reviews`);
	if (res.ok) {
		let data = await res.json();
		data = data.Reviews;
		dispatch(load(data));
		return data.Reviews;
	}
};

export default function reviewsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD: {
			const newState = {};
			action.payload.forEach((review) => {
				newState[review.id] = review;
			});

			return newState;
		}

		default:
			return state;
	}
}
