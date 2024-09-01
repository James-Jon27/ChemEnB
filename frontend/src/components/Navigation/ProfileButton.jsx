import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { TfiAlignJustify } from "react-icons/tfi";
import { FaUserCircle } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import { NavLink, useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton";
import SignUpFormModal from "../SignUpFormModal";
import LoginFormModal from "../LoginFormModal";

function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const nav = useNavigate();
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
		setShowMenu(false);
		nav("/");
	};

	const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

	if (!user) {
		return (
			<div className="div">
				<button className="user" onClick={toggleMenu}>
					<TfiAlignJustify className="hover" style={{ color: "bisque", width: "3rem", height: "auto", paddingTop: "0" }} />
					<FaUserCircle className="hover" style={{ color: "bisque", width: "3rem", height: "auto", paddingTop: "0" }} />
				</button>
				<ul className={ulClassName} style={{alignItems: "start", paddingLeft : "10px", paddingRight: "70px"}} ref={ulRef}>
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
		<div style={{ display: "flex", gap: "20px" }}>
			<NavLink to="/spots/new" style={{ fontSize: "1.5rem", alignContent: "center", textDecoration: "underline" }}>
				Create a New Lab
			</NavLink>
			<div className="div">
				<button className="user" onClick={toggleMenu}>
					<TfiAlignJustify className="hover" style={{ color: "bisque", width: "3rem", height: "auto", paddingTop: "0" }} />
					<FaUserCircle className="hover" style={{ color: "bisque", width: "3rem", height: "auto", paddingTop: "0" }} />
				</button>
				<ul className={ulClassName} ref={ulRef}>
					<li
						style={{
							fontSize: "1.8rem",
							margin: "0.5rem",
						}}>
						Hello, {user.firstName}
					</li>
					<li
						style={{
							fontSize: "1.8rem",
							margin: "0.5rem",
						}}>
						{user.email}
					</li>
					<hr style={{color: "bisque", width: "100%"}}/>
					<li
						style={{
							fontSize: "1.8rem",
							margin: "0.5rem",
						}}>
						<NavLink to="spots/current">
							<button className="manage" onClick={toggleMenu}>
								Manage Labs
							</button>
						</NavLink>
					</li>
					<li
						style={{
							fontSize: "1.8rem",
							margin: "0.5rem",
						}}>
						<NavLink to="reviews/current">
							<button className="manage" onClick={toggleMenu}>
								Manage Reviews
							</button>
						</NavLink>
					</li>
					<li
						style={{
							fontSize: "1.8rem",
							margin: "0.5rem",
						}}>
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
