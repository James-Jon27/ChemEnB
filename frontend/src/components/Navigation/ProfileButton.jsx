import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { TfiAlignJustify } from "react-icons/tfi";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
	const dispatch = useDispatch();
	const [showMenu, setShowMenu] = useState(false);
	const ulRef = useRef();

	const toggleMenu = (e) => {
		e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
		// if (!showMenu) setShowMenu(true);
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
	};

	const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

	return (
		<div className="div">
			<button className="user" onClick={toggleMenu}>
				<TfiAlignJustify className="hover" style={{ color: "bisque", width: "3rem", height: "auto", paddingTop: "0" }} />
				<FaUserCircle className="hover" style={{ color: "bisque", width: "3rem", height: "auto", paddingTop: "0" }} />
			</button>
			<ul className={ulClassName} ref={ulRef}>
				<li>
					Hello, {user.firstName} {user.lastName}
				</li>
				<li>{user.username}</li>
				<li>{user.email}</li>
				<li>
					<button className="lOButt" onClick={logout}>
						Log Out
					</button>
				</li>
			</ul>
		</div>
	);
}

export default ProfileButton;
