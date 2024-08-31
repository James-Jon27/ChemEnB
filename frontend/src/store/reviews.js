import { csrfFetch } from "./csrf";

const initialState = {};

const LOAD = "reviews/LOAD";
const DELETE = "reviews/DELETE";
const CREATE = "reviews/ADD";

const load = (reviews) => {
	return {
		type: LOAD,
		payload: reviews,
	};
};

const create = (review) => {
	return {
		type: CREATE,
		payload: review,
	};
};

const remove = (id) => {
	return {
		type: DELETE,
		payload: id,
	};
};

export const getReviews = (id) => async (dispatch) => {
	try {
		const res = await csrfFetch(`/api/spots/${id}/reviews`);
		if (res.ok) {
			let data = await res.json();
			data = data.Reviews;
			dispatch(load(data));
			return data.Reviews;
		}
	} catch (e) {
		console.error(e);
		return e;
	}
};

export const getUserReviews = () => async (dispatch) => {
	try {
		const res = await csrfFetch(`/api/reviews/current`);
		if (res.ok) {
			let data = await res.json();
			data = data.Reviews;
			dispatch(load(data));
			return data.Reviews;
		}
	} catch (e) {
		console.error(e);
		return e;
	}
};

export const createReview = (review, spotId) => async (dispatch) => {
	try {
		const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
			method: "POST",
			body: JSON.stringify(review),
		});
		if (res.ok) {
			const data = await res.json();
			dispatch(create(data));
		} else {
			const errorData = await res.json();
			throw new Error(errorData.message);
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const deleteReview = (id) => async (dispatch) => {
	const res = await csrfFetch(`/api/reviews/${id}`, {
		method: "DELETE",
	});

	if (res.ok) {
		const data = await res.json();
		dispatch(remove(id));
		return data;
	} else {
		console.error(await res.json());
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

		case CREATE: {
			const ap = action.payload;
			const newState = { ...state };
			newState[ap.id] = action.payload;
			return newState;
		}

		case DELETE: {
			const newState = { ...state };
			delete newState[action.payload];
			return newState;
		}

		default:
			return state;
	}
}
