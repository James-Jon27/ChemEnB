import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOneSpot, getSpot, updateSpot } from "../../store/spots";
import { useNavigate, useParams } from "react-router-dom";

export default function SpotUpdate() {
	const dispatch = useDispatch();
	const nav = useNavigate();
	const { id } = useParams();
	const spot = useSelector((state) => state.spots.detail);
	useEffect(() => {
		const fetch = async () => {
			await dispatch(getSpot());
			await dispatch(getOneSpot(id));
		};

		fetch();
	}, [dispatch, id]);

	const [country, setCountry] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [name, setName] = useState("");
	const [images, setImages] = useState([]);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (spot) {
			setCountry(spot.country);
			setAddress(spot.address);
			setCity(spot.city);
			setState(spot.state);
			setLatitude(spot.lat || "");
			setLongitude(spot.lng || "");
			setPrice(spot.price || "");
			setDescription(spot.description || "");
			setName(spot.name || "");
			setImages(spot.images || []);
		}
	}, [spot, setAddress]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setErrors({});
		let err = {};
		if (!country) err.country = "Country is required";
		if (!address) err.address = "Street Address is required";
		if (!city) err.city = "City is required";
		if (!state) err.state = "State is required";
		if (!name) err.name = "Title is required";
		if (!price) err.price = "Price is required";
		if (description.length < 30) {
			err.description = "Description needs 30 or more characters";
		}
		if (!images[0]) err.previewImage = "Preview Image is required";
		if (!images.every(({ url }) => url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg"))) err.image = "Image URL must end in .png, .jpg, or .jpeg";
		if (err.image || err.previewImage) setImages([]);

		setErrors(err);

		if (Object.keys(errors)) {
			return;
		}
		const newSpot = await dispatch(
			updateSpot(
				{
					address,
					city,
					state,
					country,
					lat: latitude,
					lng: longitude,
					name,
					description,
					price,
				},
				images
			)
		);

		console.log(newSpot);

		nav(`/spots/${newSpot.id}`);
	};

	return (
		<div>
			<div className="create" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
				<div className="text">
					<h1>Update Your Spot</h1>
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
						<li>
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
						</li>
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
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					{errors.image && <p className="errors">{errors.image}</p>}
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					{errors.image && <p className="errors">{errors.image}</p>}
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					{errors.image && <p className="errors">{errors.image}</p>}
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					{errors.image && <p className="errors">{errors.image}</p>}
					<hr />
				</form>
					<button className="pageButt">Update a Spot</button>
			</div>
		</div>
	);
}
