import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { AiFillExperiment } from "react-icons/ai";
function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);

	const sessionLinks = sessionUser ? (
		<>
			<ProfileButton user={sessionUser} />
		</>
	) : (
		<>
			<ProfileButton />
		</>
	);

	const ulClass = sessionUser ? "nav-li-user" : "nav-li";

	return (
		<ul className={ulClass}>
			<li style={{ width: "max-content", fontSize: "2.5rem", margin: "0.5rem" }}>
				<NavLink className="home" to="/">
					ChemEnB <AiFillExperiment />
				</NavLink>
			</li>
			{isLoaded && sessionLinks}
		</ul>
	);
}

export default Navigation;
