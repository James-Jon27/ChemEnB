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

	const ulClass = sessionUser ? "nav-li-user" : "nav-li"

	return (
		<ul className={ulClass}>
			<li style={{width: "max-content"}}>
				<NavLink className="home" to="/">
					ChemEnB <AiFillExperiment /> 
				</NavLink>
			</li>
			{isLoaded && sessionLinks}
		</ul>
	);
}

export default Navigation;
