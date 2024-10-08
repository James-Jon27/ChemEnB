import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "./PostReviewModal";
import DeleteFormModal from "../DeleteFormModal";
import { getOneSpot } from "../../store/spots";
import "./Reviews.css";

export default function Reviews() {
	const dispatch = useDispatch();
	const { id } = useParams();
	const allReviews = useSelector((state) => state.reviews);
	const sessionUser = useSelector((state) => state.session.user);
	const owner = useSelector((state) => state.spots.detail.ownerId);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			dispatch(getReviews(id));
			dispatch(getOneSpot(id));
			setLoading(false);
		};

		fetch();
	}, [dispatch, id]);

	const spotReviews = Object.values(allReviews);
	const reviews = [];
	for (const review of spotReviews) {
		reviews.push(review);
	}

	const users = (id) => {
		return reviews.some(({ User }) => User && User.id === id);
	};

	const refetch = async () => {
		setLoading(true);
		await dispatch(getReviews(id));
		setLoading(false);
	};

	if (loading) {
		return <h1 style={{ color: "brown", textAlign: "center" }}>Loading...</h1>;
	}

	if (!reviews) {
		return <h1 style={{ color: "brown", textAlign: "center" }}>Loading...</h1>;
	} else if (reviews.length < 1) {
		return (
			<div>
				{sessionUser && sessionUser.id !== owner && !users(sessionUser.id) && <OpenModalButton buttonText="Post Your Review" modalComponent={<PostReviewModal spotId={id} onReviewPost={refetch} />} />}
				<h4>Be the first to post a review!</h4>
			</div>
		);
	} else {
		return (
			<div>
				{sessionUser && sessionUser.id !== owner && !users(sessionUser.id) && <OpenModalButton buttonText="Post Your Review" modalComponent={<PostReviewModal spotId={id} onReviewPost={refetch} />} />}
				<div style={{display: "flex", flexDirection: "column-reverse"}}>
					{reviews.map(({ id, review, createdAt, User }) => {
						if (User) {
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
										<div>{sessionUser && sessionUser.id === User.id && <OpenModalButton buttonText="Delete" modalComponent={<DeleteFormModal id={id} item={"Review"} onReviewDelete={refetch} />} />}</div>
									</span>
								</div>
							);
						}
					})}
				</div>
			</div>
		);
	}
}
