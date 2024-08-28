import { csrfFetch } from "./csrf";

const initialState = {};
const LOAD = "spots/LOAD";
const LOAD_ONE = "spots/DETAILS";
const MANAGE = "spots/MANAGE";
const DELETE = "spots/DELETE";

const load = (spots) => {
	return {
		type: LOAD,
		payload: spots,
	};
};

const loadOne = (spot) => {
	return {
		type: LOAD_ONE,
		payload: spot,
	};
};

const manage = (spot) => {
	return {
		type: MANAGE,
		payload: spot,
	};
};

const deleteMe = (id) => {
	return {
		type: DELETE,
		payload: id,
	};
};

const image = (url, preview) => {
	return {
		url,
		preview,
	};
};

export const getSpot = () => async (dispatch) => {
	const res = await csrfFetch(`/api/spots`);
	if (res.ok) {
		const data = await res.json();
		dispatch(load(data.Spots));
		return data.Spots;
	}
};

export const mySpots = () => async (dispatch) => {
	const res = await csrfFetch(`/api/spots/current`);
	if (res.ok) {
		const data = await res.json();
		dispatch(load(data.Spots));
		return data.Spots;
	}
};

export const getOneSpot = (id) => async (dispatch) => {
	try {
		const res = await csrfFetch(`/api/spots/${id}`);
		if (res.ok) {
			const data = await res.json();
			dispatch(loadOne(data[0]));
			return data[0];
		}
	} catch (e) {
		return e;
	}
};

export const createSpot = (spot) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots`, {
		method: "POST",
		body: JSON.stringify(spot),
	});

	if (res.ok) {
		const createdSpot = await res.json();
		console.log(createdSpot);
		dispatch(manage(createdSpot));
		return createdSpot;
	}
};

export const updateSpot = (spot) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots/${spot.id}`, {
		method: "PUT",
		body: JSON.stringify(spot),
	});

	if (res.ok) {
		const createdSpot = await res.json();
		console.log(createdSpot);
		dispatch(manage(createdSpot));
		return createdSpot;
	}
};

export const deleteSpot = (id) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots/${id}`, {
		method: "DELETE",
	});

	if (res.ok) {
		const data = res.json();
		dispatch(deleteMe(id));
		return data;
	}
};

export const postImages = (imgs, spotId) => async () => {
	try {
		let res = [];
		imgs.forEach(async (img) => {
			const response = await csrfFetch(`api/spots/${spotId}/images`, {
				method: "POST",
				body: JSON.stringify(image(img.url, img.preview)),
			});
			res.push(response);
		});

		res.forEach(async (resp) => {
			if (resp.ok) {
				const data = await resp.json();
				return data;
			}
		});
	} catch (e) {
		return e;
	}
};

export default function spotsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD: {
			const allSpots = {};
			action.payload.forEach((spot) => (allSpots[spot.id] = spot));

			return allSpots;
		}

		case LOAD_ONE: {
			const newState = { ...state, detail: action.payload };
			return newState;
		}

		case MANAGE: {
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
