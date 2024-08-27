import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignUpForm.css";

function SignupFormModal() {
	const dispatch = useDispatch();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password === confirmPassword) {
			setErrors({});
			return dispatch(
				sessionActions.signUp({
					email,
					username,
					firstName,
					lastName,
					password,
				})
			)
				.then(closeModal)
				.catch(async (res) => {
					const data = await res.json();
					if (data?.errors) {
						setErrors(data.errors);
					}
				});
		}
		return setErrors({
			confirmPassword: "Confirm Password field must be the same as the Password field",
		});
	};

	const disabled = () => {
		if (
			username.length < 4 || 
			password.length < 6 || 
			email === '' ||
			firstName === '' ||
			lastName === '' ||
			confirmPassword === '' ||
			password === '' ||
			username ===  ''
		) return true;
		return false;
	};

	return (
		<div className="login-page">
			<h1 className="login">Sign Up</h1>
			<form className="signup-form" onSubmit={handleSubmit}>
				<label>
					<input style={{ height: "2em", fontSize: "1.5em" }} placeholder="Email" className="sign-input" type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
				</label>
				{errors.email && <p>{errors.email}</p>}
				<label>
					<input style={{ height: "2em", fontSize: "1.5em" }} placeholder="Username" className="sign-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
				</label>
				{errors.username && <p>{errors.username}</p>}
				<label>
					<input style={{ height: "2em", fontSize: "1.5em" }} placeholder="First Name" className="sign-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
				</label>
				{errors.firstName && <p>{errors.firstName}</p>}
				<label>
					<input style={{ height: "2em", fontSize: "1.5em" }} placeholder="Last Name" className="sign-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
				</label>
				{errors.lastName && <p>{errors.lastName}</p>}
				<label>
					<input style={{ height: "2em", fontSize: "1.5em" }} placeholder="Password" className="sign-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				</label>
				{errors.password && <p>{errors.password}</p>}
				<label>
					<input style={{ height: "2em", fontSize: "1.5em" }} placeholder="Confirm Password" className="sign-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
				</label>
				{errors.confirmPassword && <p>{errors.confirmPassword}</p>}
				<button disabled={disabled()} className="sUButt" type="submit">
					Sign Up
				</button>
			</form>
		</div>
	);
}

export default SignupFormModal;
