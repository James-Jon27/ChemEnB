const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");

const { Review, User, Spot, ReviewImage } = require("../../db/models");

router.delete("/:imageId", requireAuth, async (req, res) => {
	const img = await ReviewImage.findByPk(req.params.imageId);
	if (!img) {
		return res.status(404).json({
			message: "Review Image couldn't be found",
		});
	}

	const review = await Review.findByPk(img.reviewId);
	if (req.user.id !== review.userId) {
		return res.status(403).json({
			message: "Forbidden",
		});
	};

	await img.destroy();
	return res.json({
		message: "Successfully deleted",
	});
});

module.exports = router;
