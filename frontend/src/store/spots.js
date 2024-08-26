import { csrfFetch } from "./csrf";

const initialState = {};
const LOAD = "spots/LOAD";
const LOAD_ONE = "spots/DETAILS";

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

export const getSpot = () => async (dispatch) => {
	const res = await csrfFetch(`/api/spots`);
	if (res.ok) {
		const data = await res.json();
		dispatch(load(data.Spots));
		return data.Spots;
	}
};

export const getOneSpot = (id) => async (dispatch) => {
	const res = await csrfFetch(`/api/spots/${id}`);
	if (res.ok) {
		const data = await res.json();
		dispatch(loadOne(data[0]));
		return data[0];
	}
};

export default function spotsReducer(state = initialState, action) {
	switch (action.type) {
		case LOAD: {
			const allSpots = {};
			action.payload.forEach((spot) => allSpots[spot.id] = spot);

			return allSpots;
		}

		case LOAD_ONE: {
			const newState = {...state, detail: action.payload};
			return newState;
		}

		default:
			return state;
	}
}
