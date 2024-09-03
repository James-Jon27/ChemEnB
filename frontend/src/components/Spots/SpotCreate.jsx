// https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.usgbc.org%2Fsites%2Fdefault%2Ffiles%2F2022-12%2Fromney%2520hall.jpg&f=1&nofb=1&ipt=c602cdee39d31c8e22c2dff6a64d0bc4d0d4450ca7ffa3b025264fa0df4359a9&ipo=images
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createSpot, postImages } from "../../store/spots";
import { useNavigate } from "react-router-dom";
import "./SpotCreate.css";

export default function SpotCreate() {
	const dispatch = useDispatch();
	const nav = useNavigate();
	const [country, setCountry] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	// const [latitude, setLatitude] = useState("");
	// const [longitude, setLongitude] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [name, setName] = useState("");
	const [images, setImages] = useState([]);
	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();

		setErrors({});
		let err = {};
		if (!country) err.country = "Country is required";
		if (!address) err.address = "Street Address is required";
		if (!city) err.city = "City is required";
		if (!state) err.state = "State is required";
		if (!name) err.name = "Title is required";
		if (name.length > 50) err.name = "Name must be less than 50 characters";
		if (!price) err.price = "Price is required";
		if (price < 0) err.price = "Price must be greater than $0";
		if (description.length < 30) {
			err.description = "Description needs 30 or more characters";
		}
		if (description.length > 255) {
			err.description = "Description can not exceed 255 characters";
		}
		if (!images[0]) err.previewImage = "Preview Image is required";
		if (!images.every(({ url }) => url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith("images") || url === "") && images.length > 1) err.image = "Image URL must end in .png, .jpg, or .jpeg";
		if (err.image || err.previewImage) setImages([]);

		setErrors(err);

		if (Object.keys(errors).length > 1) {
			return;
		}

		const newSpot = await dispatch(
			createSpot(
				{
					address,
					city,
					state,
					country,
					name,
					description,
					price,
					lat: parseFloat(1.0),
					lng: parseFloat(-1.0),
				},
				images[0]
			)
		);

		await dispatch(postImages(images.splice(1), newSpot.id)).catch(async (res) => {
			return res;
		});

		nav(`/spots/${newSpot.id}`);
	};
	
	return (
		<div>
			<div className="create" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
				<div className="text">
					<h1>Create a Spot</h1>
					<h3 style={{ paddingTop: "0", paddingBottom: "0", marginTop: "0", marginBottom: "0" }}>Where&apos;s your Spot located?</h3>
					<p style={{ paddingTop: "0", marginTop: "0" }}>Guests will only get your exact address once they booked a reservation.</p>
				</div>
				<form className="spot-form" onSubmit={handleSubmit}>
					<ul style={{ listStyle: "none", paddingLeft: "0px" }}>
						<li>
							Country
							<input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)}></input>
							{errors.country && <p className="errors">{errors.country}</p>}
						</li>
						<li>
							Street Address
							<input type="text" placeholder="Street Address" value={address} onChange={(e) => setAddress(e.target.value)}></input>
							{errors.address && <p className="errors">{errors.address}</p>}
						</li>
						<li>
							<label>
								<div className="sideBySide1">
									<p>City</p>
									<input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)}></input>
									{errors.city && <p className="errors">{errors.city}</p>}
								</div>
								<div className="sideBySide2">
									<p>State</p>
									<input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)}></input>
									{errors.state && <p className="errors">{errors.state}</p>}
								</div>
							</label>
						</li>
						{/* <li>
							<label>
								<div className="sideBySide">
									<p>Latitude</p>
									<input type="number" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(Number(e.target.value))}></input>
									{errors.lat && <p className="errors">{errors.lat}</p>}
								</div>
								<div className="sideBySide">
									<p>Longitude</p>
									<input type="number" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(Number(e.target.value))}></input>
									{errors.lng && <p className="errors">{errors.lng}</p>}
								</div>
							</label>
						</li> */}
					</ul>
					<hr />
					<h2 style={{ marginBottom: "0" }}>Describe your place to guests</h2>
					<p style={{ paddingTop: "0", paddingBottom: "0", marginTop: "2px", marginBottom: "0" }}>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
					<textarea className="desc" type="text" placeholder="Please write at least 30 characters" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
					{errors.description && <p className="errors">{errors.description}</p>}
					<hr />
					<h2 style={{ marginBottom: "0" }}>Create a title for your spot</h2>
					<p style={{ paddingTop: "0", paddingBottom: "0", marginTop: "2px", marginBottom: "0" }}>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
					<input type="text" placeholder="Name of your spot" value={name} onChange={(e) => setName(e.target.value)}></input>
					{errors.name && <p className="errors">{errors.name}</p>}
					<hr />
					<h2 style={{ marginBottom: "0" }}>Set a base price for your spot</h2>
					<p style={{ paddingTop: "0", paddingBottom: "0", marginTop: "2px", marginBottom: "0" }}>Competitive pricing can help your listing stand out and rank higher in search results.</p>$ <input type="number" placeholder="Price per night (USD)" value={price} onChange={(e) => setPrice(Number(e.target.value))}></input>
					{errors.price && <p className="errors">{errors.price}</p>}
					<hr />
					<h2 style={{ marginBottom: "0" }}>Liven up your spot with photos</h2>
					<p style={{ paddingTop: "0", paddingBottom: "0", marginTop: "2px", marginBottom: "0" }}>Submit a link to at least one photo to publish your spot</p>
					<input type="text" placeholder="Preview Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: true }])}></input>
					{errors.previewImage && <p className="errors">{errors.previewImage}</p>}
					{errors.image && <p className="errors">{errors.image}</p>}
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					{errors.image && <p className="errors">{errors.image}</p>}
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					{errors.image && <p className="errors">{errors.image}</p>}
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					{errors.image && <p className="errors">{errors.image}</p>}
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					{errors.image && <p className="errors">{errors.image}</p>}
					<hr />
					<div className="butt">
						<button className="pageButt">Create Spot</button>
					</div>
				</form>
			</div>
		</div>
	);
}
