import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import { MdStars } from "react-icons/md";
import Reviews from "../Reviews";
import "./SpotDetails.css";
import { getReviews } from "../../store/reviews";

export default function SpotDetails() {
	const dispatch = useDispatch();
	const { id } = useParams();
	const spot = useSelector((state) => state.spots.detail);
	const review = useSelector((state) => Object.values(state.reviews));

	useEffect(() => {
		const fetch = async () => {
			dispatch(spotActions.getOneSpot(id));
			dispatch(getReviews(id));
		};

		fetch();
	}, [dispatch, id]);

	useEffect(() => {
		const revCount = async () => {
			if(spot && review.length !== spot.numReviews) {
				await dispatch(spotActions.getOneSpot(id));
				await dispatch(getReviews(id))
			}
		};
		if (spot) {
			revCount();
		}
	}), [spot, review.length, dispatch, id];

	if (!spot) {
		return <h1 style={{ color: "brown", textAlign: "center" }}>Loading...</h1>;
	}
	const { name, city, state, country, SpotImages, Owner, description, price, avgStarRating, numReviews } = spot;

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
			return <>NEW</>;
		}
	};

	const srcImg = (images) => {
		if (!images) {
			return "";
		} else {
			return images[0].url;
		}
	};

	return (
		<div>
			<h1>{name}</h1>
			<span style={{ fontWeight: "bold" }}>
				{city}, {state}, {country}
			</span>
			<div className="spot-images" style={{ paddingTop: "10px" }}>
				<div className="bigImg">
					<img src={srcImg(SpotImages)} alt="previewImage" />
				</div>
				<div className="the-rest">
					{SpotImages.slice(1).map(({ id, url }) => {
						return (
							<div key={id} className="IMAGE">
								<img src={url} alt={name} />
							</div>
						);
					})}
				</div>
			</div>
			<span className="about-spot">
				<div className="desc">
					<h3>
						Hosted by {Owner.firstName} {Owner.lastName}
					</h3>
					<p>{description}</p>
				</div>
				<div className="booking" style={{ border: "2.5px solid brown" }}>
					<div className="pR">
						<div className="price">${price} night</div>
						<div className="rating">
							<MdStars /> {rating(numReviews)}
						</div>
					</div>
					<button className="pageButt" style={{ width: "100%", justifyContent: "center" }} onClick={() => alert("Feature Coming Soon!")}>
						RESERVE
					</button>
				</div>
			</span>
			<hr style={{ color: "black", height: "2px" }} />
			<h1>
				<MdStars /> {rating(numReviews)}
			</h1>
			<Reviews />
		</div>
	);
}
