import { useState } from "react";
import "./Reviews.css";
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviews";

export default function PostReviewModal({ spotId }) {
	const dispatch = useDispatch();
	const [review, setReview] = useState("");
	const [stars, setStars] = useState(null);
	const [hoveredStars, setHoveredStars] = useState(null);
	const [errors, setErrors] = useState({});

	const handleSubmit = (e) => {
		e.PreventDefault();

		setErrors({});
		return dispatch(createReview({ review, stars }, spotId)).catch(async (res) => {
			const data = await res.json();
			if (data.errors) {
				setErrors(data.errors);
			}
		});
	};

	const handleMouseEnter = (index) => setHoveredStars(index);
	const disabled = () => review.length < 10 || !stars ? true : false;
	const handleClick = (index) => setStars(index);

	console.log(hoveredStars, "HS");
	console.log(stars, "S");

	const star = (i, st) => (i <= st ? { color: "pink" } : { color: "dimgrey" });

	return (
		<div className="reviewModal">
			<h1>How was your stay?</h1>
			<form onSubmit={handleSubmit}>
				{errors.message && <p className="errors">{errors.message}</p>}
				<textarea value={review} onChange={(e) => setReview(e.target.value)}></textarea>
				<div className="star-rating">
					{[1, 2, 3, 4, 5].map((index) => (
						<span key={index} style={star(index, hoveredStars)} className="stars" onPointerEnter={() => handleMouseEnter(index)} onPointerLeave={() => (stars ? setHoveredStars(stars) : setHoveredStars(null))} onClick={() => handleClick(index)}>
							☆
						</span>
					))}
					STARS
				</div>
				<button className="lIButt" type="submit" disabled={disabled}>
					Submit Your Review
				</button>
			</form>
		</div>
	);
}
