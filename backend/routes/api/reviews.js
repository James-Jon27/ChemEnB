const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");

const { Review, User, Spot, ReviewImage } = require("../../db/models");

router.get("/current", requireAuth, async (req, res) => {
	const userId = req.user.id;

	const reviews = await Review.findAll({
		where: {
			userId,
		},
		include: [
			{
				model: User,
				attributes: ["id", "firstName", "lastName"],
			},
			{
				model: Spot,
				attributes: [
					"id",
					"ownerId",
					"address",
					"city",
					"state",
					"country",
					"lat",
					"lng",
					"name",
					"price",
					//previewImage
				],
			},
			{
				model: ReviewImage,
				attributes: ["id", "url"],
			},
		],
	});

	res.json({ Reviews: reviews });
});

router.put("/:reviewId", requireAuth, async (req, res, next) => {
	const review = await Review.findByPk(req.params.reviewId);
	if (!review) {
		return res.status(404).json({
			message: "Review couldn't be found",
		});
	}

	if (Number(req.user.id) === review.userId) {
		try {
			await review.set(req.body);
			await review.save();
			res.json(review);
		} catch (e) {
			e.status = 400
            next(e)
		}
	} else {
        res.status(403).json({message: "Forbidden"})
    }
});

router.post("/:reviewId/images", requireAuth, async (req, res) => {
	const review = await Review.findByPk(req.params.reviewId);
	if (!review) {
		return res.status(404).json({
			message: "Review couldn't be found",
		});
	}

	if (Number(req.user.id) === review.userId) {
		const  reviewId  = review.id;
		const { url } = req.body;

		const images = await ReviewImage.findAll({
            where: {
                reviewId,
			},
		});
		if (images.length >= 10) {
            return res.status(403).json({
                message: "Maximum number of images for this resource was reached",
			});
		}
       const newImage =  await ReviewImage.create({
                reviewId,
                url,
            });
		await newImage.save();
		return res.status(201).json(newImage);
	} else {
        res.status(403).json({message: "Forbidden"})
    }
});

router.delete("/:reviewId", requireAuth, async (req, res) => {
	const review = await Review.findByPk(req.params.reviewId);
	if (!review) {
		return res.status(404).json({
			message: "Review couldn't be found",
		});
	}
	if (Number(req.user.id) === review.userId) {
		await review.destroy();
		return res.json({
			message: "Successfully deleted",
		});
	} else {
        res.status(403).json({message: "Forbidden"})
    }
});

module.exports = router;
