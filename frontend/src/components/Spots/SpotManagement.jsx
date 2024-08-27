// https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.usgbc.org%2Fsites%2Fdefault%2Ffiles%2F2022-12%2Fromney%2520hall.jpg&f=1&nofb=1&ipt=c602cdee39d31c8e22c2dff6a64d0bc4d0d4450ca7ffa3b025264fa0df4359a9&ipo=images
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createSpot, postImages } from "../../store/spots";
import { useNavigate } from "react-router-dom";

export default function SpotManagement({ method }) {
	const findMethod = method ? "Create a New" : "Update a";
	const dispatch = useDispatch();
	const nav = useNavigate();
	const [country, setCountry] = useState("");
	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [latitude, setLatitude] = useState(null);
	const [longitude, setLongitude] = useState(null);
	const [price, setPrice] = useState("");
	const [description, setDescription] = useState("");
	const [name, setName] = useState("");
	const [errors, setErrors] = useState({});
	const [previewImage, setPreviewImage] = useState("");
	const [images] = useState([]);
    console.log(images);

	const handleSubmit =  async (e) => {
		e.preventDefault();
		if (!longitude) {
			setLongitude(1.0);
		}

		if (!latitude) {
			setLatitude(1.0);
		}

		setErrors({});
		const newSpot = await dispatch(
			createSpot({
				address,
				city,
				state,
				country,
				lat: latitude,
				lng: longitude,
				name,
				description,
				price,
			})
		).catch(async (res) => {
			const data = await res.json();
			if (data.errors) {
				setErrors(data.errors);
				return errors;
			}
		});

		await dispatch(postImages(previewImage, images, newSpot.id))
        .catch(async (res) => {
			const data = await res.json();
			errors.previewImage = data.errors;
		});

        nav(`/spots/${newSpot.id}`);
	};

	const disabled = () => {
		if (description.length < 30) {
			errors.description = "Description needs 30 or more characters";
		} else if (description.length >= 30) {
			delete errors.description;
		}
		if (description.length < 30 || !country || !state || !address || !city || !price || !name || !previewImage) {
			return true;
		}
		return false;
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
			<h1>{findMethod} Spot</h1>
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
					<input type="text" placeholder="Preview Image URL" value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} required></input>
					{errors.previewImage && <p style={{ color: "brown" }}>{errors.previewImage}</p>}
					<input type="text" placeholder="Image URL" onChange={(e) => images.push(e.target.value)}></input>
					<input type="text" placeholder="Image URL" onChange={(e) => images.push(e.target.value)}></input>
					<input type="text" placeholder="Image URL" onChange={(e) => images.push(e.target.value)}></input>
					<input type="text" placeholder="Image URL" onChange={(e) => images.push(e.target.value)}></input>
				</label>
				<hr />
				<button className="pageButt" disabled={disabled()}>
					Create Spot
				</button>
			</form>
		</div>
	);
}
