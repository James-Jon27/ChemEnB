import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
// import * as sessionActions from "../../store/session";
import "./Navigation.css";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignUpFormModal from "../SignUpFormModal";
import { AiFillExperiment } from "react-icons/ai";
function Navigation({ isLoaded }) {
	const sessionUser = useSelector((state) => state.session.user);
	// const dispatch = useDispatch();

	// const logout = (e) => {
	// 	e.preventDefault();
	// 	dispatch(sessionActions.logoutThunk());
	// };

	const sessionLinks = sessionUser ? (
		<>
			<li>
				<ProfileButton user={sessionUser} />
			</li>
			{/* <li>
				<button className="hover" style={{ color: "bisque", background: "none", border: "none", fontSize: "2.5rem", fontFamily: "Times New Roman, Times, serif" }} onClick={logout}>
					Log Out
				</button>
			</li> */}
		</>
	) : (
		<>
			<li>
				<OpenModalButton buttonText="Sign Up" modalComponent={<SignUpFormModal />} />
			</li>
			<li>
				<OpenModalButton buttonText="Log In" modalComponent={<LoginFormModal />} />
			</li>
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
