import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import "./Reviews.css";
import PostReviewModal from "./PostReviewModal";
import DeleteFormModal from "../DeleteFormModal";

export default function Reviews() {
	const dispatch = useDispatch();
	const allReviews = useSelector((state) => state.reviews);
	const sessionUser = useSelector((state) => state.session.user);
	const owner = useSelector((state) => state.spots.detail.ownerId);

	const spotReviews = Object.values(allReviews);
	const reviews = [];
	for (const review of spotReviews) {
		reviews.push(review);
	}
	const { id } = useParams();
	useEffect(() => {
		dispatch(getReviews(id));
	}, [dispatch, id]);

	const users = (id) => {
		if(reviews.length > 1) {
			let user = reviews.map(({ User }) => User.id);
			return user.includes(id);
		} else return false;
	}

	if (!reviews) {
		return <h1 style={{ color: "brown", textAlign: "center" }}>Loading...</h1>;
	} else if (reviews.length < 1) {
		return (
			<div>
				{sessionUser && sessionUser.id !== owner && users(sessionUser.id) && <OpenModalButton buttonText="Post Your Review" modalComponent={<PostReviewModal spotId={id} />} />}
				<h4>Be the first to post a review!</h4>
			</div>
		);
	} else {
		return (
			<div>
				{sessionUser && sessionUser.id !== owner && !users(sessionUser.id) && <OpenModalButton buttonText="Post Your Review" modalComponent={<PostReviewModal spotId={id} />} />}
				{reviews.map(({ id, review, createdAt, User }) => {
					let date = createdAt.split("-");
					let year = date[0];
					let month = {
						"01": "January",
						"02": "February",
						"03": "March",
						"04": "April",
						"05": "May",
						"06": "June",
						"07": "July",
						"08": "August",
						"09": "September",
						10: "October",
						11: "November",
						12: "December",
					};
					date = `${month[date[1]]}, ${year}`;
					return (
						<div key={id}>
							<span className="reviews">
								<h4>{User.firstName}</h4>
								<h5>{date}</h5>
								<p>{review}</p>
								<div>{sessionUser && sessionUser.id === User.id && <OpenModalButton buttonText="Delete" modalComponent={<DeleteFormModal id={id} item={"Review"} />} />}</div>
							</span>
						</div>
					);
				})}
			</div>
		);
	}
}
