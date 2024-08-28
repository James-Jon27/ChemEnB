import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import { MdStars } from "react-icons/md";
import Reviews from "../Reviews";

export default function SpotDetails() {
	const dispatch = useDispatch();
	const { id } = useParams();
	const spot = useSelector((state) => state.spots.detail);
	useEffect(() => {
		dispatch(spotActions.getOneSpot(id))
	}, [dispatch, id]);

	if (!spot) {
		return <h1 style={{ color: "brown", textAlign: "center" }}>Loading...</h1>;
	}



	const { name, city, state, country, SpotImages, Owner, description, price, avgStarRating, numReviews } = spot;
	const preCheck = (preview) => (preview ? "preview" : "image");
	const rating = (num) => {
		if (num > 1) {
			return (
				<>
					{avgStarRating} · {numReviews} reviews
				</>
			);
		} else if (num === 1) {
			return (
				<>
					{avgStarRating} · {numReviews} review
				</>
			);
		} else {
            return (
                <>
                    NEW
                </>
            )
        }
	};

	return (
		<div>
			<h1>{name}</h1>
			<span>
				{city}, {state}, {country}
			</span>
			<div className="spot-images">
				{SpotImages.map(({ id, url, preview }) => {
					return <img key={id} src={url} alt={preCheck(preview)} className={preCheck(preview)} />;
				})}
			</div>
			<span className="about-spot">
				<div className="desc">
					<h3>
						Hosted by {Owner.firstName} {Owner.lastName}
					</h3>
					<p>{description}</p>
				</div>
				<div className="booking" style={{border: "1px solid brown"}}>
					<div>
						<div className="price">${price} night</div>
						<MdStars /> {rating(numReviews)}
					</div>
					<button className="bookingButt">RESERVE</button>
				</div>
			</span>
                <hr style={{color: "black", height: "2px"}}/>
                <h1><MdStars /> {rating(numReviews)}</h1>
			<Reviews />
		</div>
	);
}
