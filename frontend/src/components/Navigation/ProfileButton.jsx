import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { TfiAlignJustify } from "react-icons/tfi";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import { Link } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import SignUpFormModal from "../SignUpFormModal";
import LoginFormModal from "../LoginFormModal";

function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const ulRef = useRef();

	const toggleMenu = (e) => {
		e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
		setShowMenu(!showMenu);
	};

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = (e) => {
			if (ulRef.current && !ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};

		document.addEventListener("click", closeMenu);

		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu]);

	const logout = (e) => {
		e.preventDefault();
		dispatch(sessionActions.logoutThunk());
		setShowMenu(false)
	};

	const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

	if(!user) {
		return (
			<div className="div">
				<button className="user" onClick={toggleMenu}>
					<TfiAlignJustify className="hover" style={{ color: "bisque", width: "3rem", height: "auto", paddingTop: "0" }} />
					<FaUserCircle className="hover" style={{ color: "bisque", width: "3rem", height: "auto", paddingTop: "0" }} />
				</button>
				<ul className={ulClassName} ref={ulRef}>
					<li>
						<OpenModalButton buttonText="Sign Up" modalComponent={<SignUpFormModal />} />
					</li>
					<li>
						<OpenModalButton buttonText="Log In" modalComponent={<LoginFormModal />} />
					</li>
				</ul>
			</div>
		);
	}

	return (
	<div style={{display: "flex", gap: "20px"}}>
			<Link to="/spots/new" style={{ fontSize : "1.5rem", alignContent : "center", textDecoration : "underline"}}>Create a Spot</Link>
		<div className="div">
			<button className="user" onClick={toggleMenu}>
				<TfiAlignJustify className="hover" style={{ color: "bisque", width: "3rem", height: "auto", paddingTop: "0" }} />
				<FaUserCircle className="hover" style={{ color: "bisque", width: "3rem", height: "auto", paddingTop: "0" }} />
			</button>
			<ul className={ulClassName} ref={ulRef}>
				<li>Hello, {user.firstName}</li>
				<li>{user.email}</li>
				<p style={{padding: "0", margin: "0", border: "0"}}>--------------------------</p>
				<li>
					<button className="manage">Manage Labs</button>
				</li>
				<li>
					<button className="manage">Manage Reviews</button>
				</li>
				<li>
					<button className="lOButt" onClick={logout}>
						Log Out
					</button>
				</li>
			</ul>
		</div>
	</div>
	);
}

export default ProfileButton;
