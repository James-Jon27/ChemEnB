import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpot } from "../../store/spots";
import { deleteReview } from "../../store/reviews";

export default function DeleteFormModal ({id, item}) {
    const {closeModal} = useModal();
    const dispatch = useDispatch();
    const del = async (e) => {
        e.preventDefault()

        if(item === "Lab") {
        const deletion = await dispatch(deleteSpot(id))
        if(deletion) {
            closeModal()
        }
    } else if (item === "Review") {
        const deletion = await dispatch(deleteReview(id));
        if(deletion) {
            closeModal()
        }
    }
    }

    return (
			<div style={{ padding: "20px", border: "solid 5px brown", backgroundColor: "bisque" }}>
				<h1>Confirm Delete</h1>
				<p>Are you sure you want to remove this {item} from the listings?</p>
				<div className="butts" style={{ flexDirection: "column" }}>
					<button className="pageButt" style={{ width: "100%", justifyContent: "center", color: "white" }} onClick={del}>
						Yes (Delete {item})
					</button>
					<button className="pageButt" style={{ width: "100%", justifyContent: "center", color: "white", backgroundColor: "gray" }} onClick={closeModal}>
						No (Keep {item})
					</button>
				</div>
			</div>
		);
}