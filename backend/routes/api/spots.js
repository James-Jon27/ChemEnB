const express = require("express");
const {
  Spot,
  SpotImage,
  User,
  Review,
  Booking,
  ReviewImage,
  sequelize,
} = require("../../db/models");

const { requireAuth } = require("../../utils/auth");

const checkConflict = require("../../utils/conflict");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

const spotsInfo = async (spots) => {
  const res = [];
  for (let i = 0; i < spots.length; i++) {
    // check reviews
    const spot = spots[i];
    const reviews = await Review.findAll({ where: { spotId: spot.id } });
    const totalRating = reviews.reduce((acc, el) => acc + el.stars, 0);
    let avgStarRating = (totalRating / reviews.length).toFixed(1);

    // check images
    const img = await SpotImage.findOne({
      where: { spotId: spot.id, preview: true },
    });

    let previewImage = null;
    if (img) {
      previewImage = img.url;
    }

    res.push({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: reviews.length,
      avgStarRating, //placeholder
      previewImage, //placeholder
      SpotImages: spot.SpotImages,
      Owner: spot.User,
    });
  }
  return res;
};

// Validation creating a spot
const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be within -90 and 90"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be within -180 and 180"),
  check("name")
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("name").exists({ checkFalsy: true }).withMessage("Name is required"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Price per day must be a positive number"),
  handleValidationErrors,
];
// delete
// GET all reviews for a spot based on :spotId
router.get("/:spotId/reviews", async (req, res, next) => {
  try {
    const spot = await Spot.findOne({
      where: { id: req.params.spotId },
      include: { model: Review },
    });

    if (!spot) {
      res.status(404).json({ message: "Spot couldn't be found" });
    }

    const clearReviews = [];
    for (let i = 0; i < spot.Reviews.length; i++) {
      const curr = spot.Reviews[i];
      clearReviews[i] = {
        id: curr.id,
        userId: curr.userId,
        spotId: curr.spotId,
        review: curr.review,
        stars: curr.stars,
        createdAt: curr.createdAt,
        updatedAt: curr.updatedAt,
        User: await User.findByPk(curr.userId),
        ReviewImages: await ReviewImage.findAll({
          where: { reviewId: curr.id },
          attributes: ["id", "url"],
        }),
      };
    }

    return res.status(200).json({ Reviews: clearReviews });
  } catch (err) {
    next(err);
  }
});

//POST a Review for a Spot based on the Spot's id
router.post("/:spotId/reviews", requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  //404 error if spot not found
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  const { review, stars } = req.body;
  const id = spot.id;
  const userId = req.user.id;

  //Error response: Review from the current user already exists for the Spot
  const revs = await Review.findOne({
    where: {
      spotId: id,
      userId,
    },
  });

  if (revs) {
    return res.status(500).json({
      message: "User already has a review for this spot",
    });
  }

  try {
    const createdReview = await Review.create({
      spotId: id,
      userId,
      review,
      stars,
    });
    await createdReview.save();
    return res.status(201).json(createdReview);
  } catch (e) {
    e.status = 400;
    next(e);
  }
});

// GET all bookings for a spot based on :spotId
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  try {
    const spot = await Spot.findOne({
      where: { id: req.params.spotId },
      include: { model: Booking },
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (req.user && spot.ownerId === req.user.id) {
      const safeBooking = [];
      for (let i = 0; i < spot.Bookings.length; i++) {
        const currBooking = spot.Bookings[i];
        const currUser = await User.findByPk(currBooking.userId);
        safeBooking.push({
          User: currUser,
          id: currBooking.id,
          spotId: currBooking.spotId,
          userId: currBooking.userId,
          startDate: currBooking.startDate,
          endDate: currBooking.endDate,
          createdAt: currBooking.createdAt,
          updatedAt: currBooking.updatedAt,
        });
      }

      res.status(200).json({ Bookings: safeBooking });
    } else {
      const safeBooking = spot.Bookings.map((b) => {
        return { spotId: b.spotId, startDate: b.startDate, endDate: b.endDate };
      });
      return res.status(200).json({ Bookings: safeBooking });
    }
  } catch (err) {
    next(err);
  }
});

// POST Add an image to spot
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const imgs = await SpotImage.findAll({ where: { spotId: spot.id } });
  if (!imgs) preview = true;
  if (preview) {
    for (let i = 0; imgs && i < imgs.length; i++) {
      const img = imgs[i];
      if (img.preview) {
        img.preview = false;
        await img.save();
      }
    }
  }

  const newImage = await SpotImage.create({
    spotId,
    url,
    preview,
  });

  res.status(201).json({
    id: newImage.id,
    url: newImage.url,
    preview: newImage.preview,
  });
});

// POST a booking for a spot based on :spotId
router.post("/:spotId/bookings", requireAuth, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const spot = await Spot.findOne({
      where: { id: req.params.spotId },
      include: { model: Booking },
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
    if (spot.ownerId === req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const isConflicting = await checkConflict({
      id: null,
      spotId: req.params.spotId,
      startDate,
      endDate,
    });

    if (isConflicting) {
      const err = new Error(
        "Sorry, this spot is already booked for the specified dates"
      );
      err.status = isConflicting.status || 403;
      delete isConflicting.status;
      err.errors = isConflicting;
      return next(err);
    }

    const newBooking = await spot.createBooking({
      userId: req.user.id,
      spotId: req.params.spotId,
      startDate,
      endDate,
    });

    await newBooking.save();
    return res.status(201).json(newBooking);
  } catch (err) {
    err.status = 400;
    next(err);
  }
});

// GET all spots owned by the current user
router.get("/current", requireAuth, async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const spots = await Spot.findAll({
      where: { ownerId: currentUserId },
    });
    const spotsInform = await spotsInfo(spots);
    res.status(200).json({ Spots: spotsInform });
  } catch (err) {
    next(err);
  }
});

// GET details of a spot by id
router.get("/:spotId", async (req, res, next) => {
  const { spotId } = req.params;
  try {
    const spot = await Spot.findByPk(spotId, {
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: SpotImage, attributes: ["id", "url", "preview"] },
        { model: Review },
      ],
    });

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }
    const spotInformed = await spotsInfo([spot]);

    res.status(200).json(spotInformed);
  } catch (err) {
    next(err);
  }
});

// GET all spots
router.get("/", async (req, res, next) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;

  const where = {};
  const err = new Error("Bad Request");
  err.status = 400;
  err.errors = {};

  if (!page && page !== 0) {
    page = 1;
  }
  if (!size && size !== 0) {
    size = 20;
  }

  if (isNaN(Number(page))) page = 0;
  if (isNaN(Number(size))) size = 0;

  if (page < 1) {
    err.errors.page = "Page must be greater than or equal to 1";
  }
  if (size < 1 || size > 20) {
    err.errors.size = "Size must be between 1 and 20";
  }
  if (maxLat && (isNaN(Number(maxLat)) || maxLat < -90 || maxLat > 90)) {
    err.errors.maxLat = "Maximum latitude is invalid";
  }
  if (minLat && (isNaN(Number(minLat)) || minLat < -90 || minLat > 90)) {
    err.errors.minLat = "Minimum latitude is invalid";
  }
  if (maxLng && (isNaN(Number(maxLng)) || maxLng < -180 || maxLng > 180)) {
    err.errors.maxLng = "Maximum longitude is invalid";
  }
  if (minLng && (isNaN(Number(minLng)) || minLng < -180 || minLng > 180)) {
    err.errors.minLng = "Minimum longitude is invalid";
  }

  if (maxPrice) {
    if (isNaN(Number(maxPrice)) || maxPrice < 0) {
      err.errors.maxPrice = "Maximum price must be greater than or equal to 0";
    }
    if (!where.price) {
      where.price = {};
    }
    where.price[Op.lt] = maxPrice;
  }
  if (minPrice || minPrice === 0) {
    if (isNaN(Number(minPrice)) || minPrice < 0) {
      err.errors.minPrice = "Minimum price must be greater than or equal to 0";
    }
    if (!where.price) {
      where.price = {};
    }
    where.price[Op.gt] = minPrice;
  }

  if (maxLat) {
    if (!where.lat) {
      where.lat = {};
    }
    where.lat[Op.lt] = maxLat;
  }
  if (minLat) {
    if (!where.lat) {
      where.lat = {};
    }
    where.lat[Op.gt] = minLat;
  }
  if (maxLng) {
    if (!where.lng) {
      where.lng = {};
    }
    where.lng[Op.lt] = maxLng;
  }
  if (minLng) {
    if (!where.lng) {
      where.lng = {};
    }
    where.lng[Op.gt] = minLng;
  }

  size = Number(size);
  page = Number(page);

  try {
    if (Object.keys(err.errors).length) {
      throw err;
    }
    const spots = await Spot.findAll({
      where,
      limit: size,
      offset: size * (page - 1),
    });

    const spotsInform = await spotsInfo(spots);
    res.status(200).json({ Spots: spotsInform, page, size });
  } catch (err) {
    next(err);
  }
});

// PUT a spot by :spotId
router.put("/:spotId", requireAuth, validateSpot, async (req, res, next) => {
  const { spotId } = req.params;
  try {
    const spot = await Spot.findByPk(spotId, {
      include: [
        { model: User, attributes: ["id", "firstName", "lastName"] },
        { model: SpotImage, attributes: ["id", "url", "preview"] },
        { model: Review },
      ],
    });

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newSpotData = {
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      lat: req.body.lat,
      lng: req.body.lng,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    };

    spot.set(newSpotData);
    const edited = await spot.save();

    res.status(200).json(edited);
  } catch (err) {
    if (err.message === "Validation error") {
      err.status = 400;
    }

    next(err);
  }
});

// DELETE a spot by :spotId
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    spot.destroy();
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    next(err);
  }
});

// POST a new spot
router.post("/", requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const ownerId = req.user.id;

  try {
    const newSpot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    res.status(201).json(newSpot);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
