import { csrfFetch } from "./csrf";
const initialState = {};
const LOAD = "spots/LOAD";
const LOAD_ONE = "spots/DETAILS";
const MANAGE = "spots/MANAGE";
const DELETE = "spots/DELETE";
const IMAGE = "spots/POST_IMAGE";

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

const imgs = (imagesArr, spotId) => {
	return {
		type: IMAGE,
		payload: imagesArr,
		id: spotId,
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

export const createSpot = (spot, prevImg) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(spot),
	});

	if (res.ok) {
		const spot = await res.json();
		const imgRes = await csrfFetch(`/api/spots/${spot.id}/images`, {
			method: "POST",
			body: JSON.stringify(prevImg),
		});
		const img = await imgRes.json();
		console.log(img);
		spot.previewImage = {url : img}
		dispatch(manage(spot));
		return spot;
	} else {
		const errorData = await res.json();
		throw errorData.message;
	}
};

export const updateSpot = (spot, prevImg, id) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(spot),
	});

	if (res.ok) {
		const spot = await res.json();
		const imgRes = await csrfFetch(`/api/spots/${spot.id}/images`, {
			method: "POST",
			body: JSON.stringify(prevImg),
		});
		spot.previewImage = await imgRes.json();
		dispatch(manage(spot));
		return spot;
	} else {
		const errorData = await res.json();
		throw errorData.message;
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

export const postImages = (images, spotId) => async (dispatch) => {
	for (const image of images) {
		console.log(image)
		const res = await csrfFetch(`/api/spots/${spotId}/images`, {
			method: "POST",
			body: JSON.stringify(image),
		});

		if (res.ok) {
			const data = await res.json();
			dispatch(imgs(data, spotId));
		}
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

		case IMAGE: {
			const newState = { ...state };
			newState[action.id].SpotImages = action.payload;
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
