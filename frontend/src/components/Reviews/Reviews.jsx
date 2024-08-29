import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getReviews } from "../../store/reviews";
import OpenModalButton from "../OpenModalButton";
import DeleteFormModal from "../DeleteFormModal";
import "./Reviews.css"

export default function Reviews() {
	const dispatch = useDispatch();
	const allReviews = useSelector((state) => state.reviews);
	const sessionUser = useSelector((state) => state.session.user);

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
			<div>
				{sessionUser && <button>Post Your Review</button>}
				{reviews.map(({ id, review, createdAt, User }) => {
					let date = createdAt.split("-");
					let year = date[0];
					let month = {
						"01" : "January",
						"02": "February",
						"03": "March",
						"04": "April",
						"05": "May", 
						"06": "June", 
						"07": "July", 
						"08": "August",
						"09": "September", 
						"10": "October", 
						"11": "November", 
						"12": "December"
					}
					date = `${month[date[1]]}, ${year}`
					return (
						<div key={id}>
							<span className="reviews">
								<h4>{User.firstName}</h4>
								<h5>{date}</h5>
								<p>{review}</p>
								{sessionUser && sessionUser.id === User.id && <OpenModalButton buttonText="Delete" modalComponent={<DeleteFormModal id={id} item={"Review"} />} />}
							</span>
						</div>
					);
				})}
			</div>
		);
	}
}
