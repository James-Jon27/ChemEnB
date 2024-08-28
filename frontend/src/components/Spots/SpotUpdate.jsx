import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSpot, getOneSpot, postImages } from "../../store/spots";
import { useNavigate, useParams } from "react-router-dom";

export default function SpotUpdate() {
	const spot = useSelector((state) => state.spots).detail;
    console.log(spot)
	const { id } = useParams();
	const dispatch = useDispatch();
	const nav = useNavigate();
	const [country, setCountry] = useState(spot.country);
	const [address, setAddress] = useState(spot.address);
	const [city, setCity] = useState(spot.city);
	const [state, setState] = useState(spot.state);
	const [latitude, setLatitude] = useState(spot.lat);
	const [longitude, setLongitude] = useState(spot.lng);
	const [price, setPrice] = useState(spot.price);
	const [description, setDescription] = useState(spot.description);
	const [name, setName] = useState(spot.name);
	const [images, setImages] = useState([]);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		dispatch(getOneSpot(id));
	}, [dispatch, id]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!longitude) setLongitude("0.0");
		if (!latitude) setLatitude("0.0");

		setErrors({});
		try {
			const newSpot = await dispatch(
				createSpot({
					address,
					city,
					state,
					country,
					lat: parseFloat(latitude),
					lng: parseFloat(longitude),
					name,
					description,
					price: parseFloat(price),
				})
			);

			await dispatch(postImages(images, newSpot.id));
			nav(`/spots/${newSpot.id}`);
		} catch (res) {
			const data = await res.json();
			if (data.errors) {
				setErrors(data.errors);
			}
		}
	};

	const disabled = () => {
		if (description.length < 30 || !country || !state || !address || !city || !price || !name || !images[0]) {
			return true;
		}
		return false;
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
			<h1>Update Your Spot</h1>
			<h3 style={{ paddingTop: "0", paddingBottom: "0", marginTop: "0", marginBottom: "0" }}>Where&apos;s your Spot located?</h3>
			<p style={{ paddingTop: "0", marginTop: "0" }}>Guests will only get your exact address once they booked a reservation.</p>
			<form className="spot-form" onSubmit={handleSubmit}>
				<ul style={{ listStyle: "none" }}>
					<li>
						<label className="spotLabel">
							Country
							<input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required></input>
						</label>
						{errors.country && <p style={{ color: "brown" }}>{errors.country}</p>}
					</li>
					<li>
						<label className="spotLabel">
							Street Address
							<input type="text" placeholder="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} required></input>
						</label>
						{errors.address && <p style={{ color: "brown" }}>{errors.address}</p>}
					</li>
					<li>
						<label className="spotLabel">
							City
							<input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required></input>
						</label>
						<label className="spotLabel">
							State
							<input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required></input>
						</label>
						{errors.city && <p style={{ color: "brown" }}>{errors.city}</p>}
						{errors.state && <p style={{ color: "brown" }}>{errors.state}</p>}
					</li>
					<li>
						<label className="spotLabel">
							Latitude
							<input type="number" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(Number(e.target.value))}></input>
						</label>
						{errors.lat && <p style={{ color: "brown" }}>{errors.lat}</p>}
						<label className="spotLabel">
							Longitude
							<input type="number" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(Number(e.target.value))}></input>
						</label>
						{errors.lng && <p style={{ color: "brown" }}>{errors.lng}</p>}
					</li>
				</ul>
				<hr />
				<label className="spotLabel">
					<h2 style={{ marginBottom: "0" }}>Describe your place to guests</h2>
					<p style={{ paddingTop: "0", paddingBottom: "0", marginTop: "2px", marginBottom: "0" }}>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
					<input type="blob" placeholder="Please write at least 30 characters" value={description} onChange={(e) => setDescription(e.target.value)} required></input>
				</label>
				{errors.description && <p style={{ color: "brown" }}>{errors.description}</p>}
				<hr />
				<label className="spotLabel">
					<h2 style={{ marginBottom: "0" }}>Create a title for your spot</h2>
					<p style={{ paddingTop: "0", paddingBottom: "0", marginTop: "2px", marginBottom: "0" }}>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
					<input type="text" placeholder="Name of your spot" value={name} onChange={(e) => setName(e.target.value)} required></input>
				</label>
				{errors.name && <p style={{ color: "brown" }}>{errors.name}</p>}
				<hr />
				<label className="spotLabel">
					<h2 style={{ marginBottom: "0" }}>Set a base price for your spot</h2>
					<p style={{ paddingTop: "0", paddingBottom: "0", marginTop: "2px", marginBottom: "0" }}>Competitive pricing can help your listing stand out and rank higher in search results.</p>$ <input type="number" placeholder="Price per night (USD)" value={price} onChange={(e) => setPrice(Number(e.target.value))} required></input>
				</label>
				{errors.price && <p style={{ color: "brown" }}>{errors.price}</p>}
				<hr />
				<label className="spotLabel">
					<h2 style={{ marginBottom: "0" }}>Liven up your spot with photos</h2>
					<p style={{ paddingTop: "0", paddingBottom: "0", marginTop: "2px", marginBottom: "0" }}>Submit a link to at least one photo to publish your spot</p>
					<input type="text" placeholder="Preview Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: true }])} required></input>
					{errors.images && <p style={{ color: "brown" }}>{errors.images}</p>}
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
					<input type="text" placeholder="Image URL" onChange={(e) => setImages([...images, { url: e.target.value, preview: false }])}></input>
				</label>
				<hr />
				<button className="pageButt" disabled={disabled()}>
					Create Spot
				</button>
			</form>
		</div>
	);
}
