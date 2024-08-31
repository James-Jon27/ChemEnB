import { useModal } from "../../context/Modal";
import "../SignUpFormModal/SignUpForm.css"

function OpenModalButton({
	modalComponent, // component to render inside the modal
	buttonText, // text of the button that opens the modal
	onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
	onModalClose, // optional: callback function that will be called once the modal is closed
}) {
	const { setModalContent, setOnModalClose } = useModal();

	const onClick = () => {
		if (onModalClose) setOnModalClose(onModalClose);
		setModalContent(modalComponent);
		if (typeof onButtonClick === "function") onButtonClick();
	};

	if (buttonText === "Delete" || buttonText === "Post Your Review") {
		return (
			<button className="pageButt" style={{marginBottom : "15px"}} onClick={onClick}>
				{buttonText}
			</button>
		);
	}

	return (
		<button  className="hover" onClick={onClick}>
			{buttonText}
		</button>
	);
}

export default OpenModalButton;
