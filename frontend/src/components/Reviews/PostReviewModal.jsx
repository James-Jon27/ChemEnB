import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import "./Reviews.css";
import "./ReviewModal.css";

export default function PostReviewModal({ spotId }) {
	const dispatch = useDispatch();
	const {closeModal} = useModal();
	const [review, setReview] = useState("");
	const [stars, setStars] = useState(null);
	const [hoveredStars, setHoveredStars] = useState(null);
	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();

		setErrors({});
		let rev = { review: review, stars: stars };
		const res = await dispatch(createReview(rev, spotId));
		if(res){
			closeModal()
			return res;
		}
	};

	const handleMouseEnter = (index) => setHoveredStars(index);
	const disabled = () => (review.length < 10 || !stars ? true : false);
	const handleClick = (index) => setStars(index);

	const star = (i, st) => (i <= st ? { color: "brown" } : { color: "white" });

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
				<button className="lIButt" type="submit" disabled={disabled()}>
					Submit Your Review
				</button>
			</form>
		</div>
	);
}
