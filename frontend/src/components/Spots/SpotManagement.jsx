import { useDispatch, useSelector } from "react-redux";
import { MdStars } from "react-icons/md";
import { useEffect } from "react";
import * as spotActions from "../../store/spots";
import { Link } from "react-router-dom";
import "./Spots.css";
import OpenModalButton from "../OpenModalButton";
import DeleteFormModal from "../DeleteFormModal";

export default function SpotManagement() {
	const dispatch = useDispatch();

	const allSpots = useSelector((state) => state.spots);
	const spotsIterable = Object.values(allSpots);
	const spots = [];
	for (const spot of spotsIterable) {
		spots.push(spot);
	}
	useEffect(() => {
		dispatch(spotActions.mySpots());
	}, [dispatch]);

	if (!spots) {
		return <h1 style={{ color: "brown", textAlign: "center" }}>Loading...</h1>;
	}

	const rating = (num) => {
		if (isNaN(num)) return "NEW";
		return num;
	};

	return (
		<div>
			<h1>Manage Your Spots</h1>
			<Link to="/spots/new">
				<button className="pageButt">Create a Spot</button>
			</Link>
			<div className="grid">
				{spots.map(({ id, city, state, avgStarRating, price, previewImage, name }) => {
					return (
						<div key={id}>
							<Link style={{ color: "black" }} to={`/spots/${id}`} title={name}>
								<div className="tile" aria-labelledby="name">
									<div role="tooltip" id="name">
										{name}
									</div>
									<img className="spotImg" src={previewImage} alt={name} style={{ width: "25rem" }} />
									<span className="info">
										<p style={{ fontSize: "large", fontWeight: "bold" }}>
											{city}, {state}
										</p>
										<span className="ratings">
											<MdStars style={{ display: "flex", justifyContent: "center" }} />
											<p>{rating(avgStarRating)}</p>
										</span>
									</span>
									<span className="price">
										<h2>{price}</h2>
										<p>/night</p>
									</span>
								</div>
							</Link>
							<div className="butts">
								<Link to={`/spots/${id}/edit`}>
									<button className="pageButt">Update</button>
								</Link>
								<OpenModalButton buttonText="Delete" modalComponent={<DeleteFormModal id={id} item={"Lab"} />}>
									Delete
								</OpenModalButton>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
