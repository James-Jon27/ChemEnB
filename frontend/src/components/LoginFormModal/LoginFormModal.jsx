import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const { closeModal } = useModal();

	const loginDemo = () => {
		return dispatch(sessionActions.loginThunk({ credential: "demo@user.io", password: "password" }))
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.errors) {
					setErrors(data.errors);
				}
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setErrors({});
		return dispatch(sessionActions.loginThunk({ credential, password }))
			.then(closeModal)
			.catch(async (res) => {
				const data = await res.json();
				if (data && data.errors) {
					setErrors(data.errors);
				}
			});
	};

	const disabled = (credential, password) => {
		if (credential.length < 4 || password.length < 6) return true;
		return false;
	};

	return (
		<div className="login-page">
			<h1 className="login">Log In</h1>
			<form className="login-form" onSubmit={handleSubmit}>
				<label className="lgLabel">
					<input style={{ height: "2em", fontSize: "1.5em", width: "98.5%"}} type="text" placeholder="Username or Email" value={credential} onChange={(e) => setCredential(e.target.value)} required />
				</label>
				<label className="lgLabel">
					<input style={{ height: "2em", fontSize: "1.5em", width: "98.5%"}} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				</label>
				<button disabled={disabled(credential, password)} className="lIButt" type="submit">
					Log In
				</button>
			</form>
			{errors.credential && <p>{errors.credential}</p>}
			{errors.password && <p>{errors.password}</p>}
			<button className="pageButt" style={{ marginTop: "1em" }} onClick={loginDemo}>
				DEMO USER
			</button>
		</div>
	);
}

export default LoginFormModal;
