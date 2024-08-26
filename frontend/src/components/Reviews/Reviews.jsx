import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getReviews } from "../../store/reviews";

export default function Reviews() {
	const dispatch = useDispatch();
	const allReviews = useSelector((state) => state.reviews);
	const spotReviews = Object.values(allReviews);
	const reviews = [];
	for (const review of spotReviews) {
		reviews.push(review);
	}
	const { id } = useParams();
	useEffect(() => {
		dispatch(getReviews(id));
	}, [dispatch, id]);

	if (!reviews) {
		return <h1 style={{ color: "brown", textAlign: "center" }}>Loading...</h1>;
	} else if (reviews.length < 1) {
		return (
			<div>
				<button>Post Your Review</button>
				<h4>Be the first to post a review!</h4>
			</div>
		);
	} else {
		return (
			<div className="reviews">
				<button>Post Your Review</button>
				{reviews.map(({ id, review, createdAt, User }) => {
					return (
						<div key={id}>
							<span>
								<h4>{User.firstName}</h4>
								<h6>{createdAt}</h6>
								<p>{review}</p>
							</span>
						</div>
					);
				})}
			</div>
		);
	}
}
