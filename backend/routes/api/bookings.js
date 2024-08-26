const express = require("express");

const { Booking, Spot } = require("../../db/models");

const router = express.Router();

const { requireAuth } = require("../../utils/auth");

const checkConflict = require("../../utils/conflict");

// GET current user's bookings
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;
  const Bookings = await Booking.findAll({
    where: { userId },
    include: [
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
          //"previewImg",
        ],
      },
    ],
  });
  res.status(200).json({ Bookings });
});

// PUT booking by ID
router.put("/:bookingId", requireAuth, async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const toEdit = await Booking.findByPk(+bookingId);

    // 404
    if (!toEdit) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // 403
    if (new Date(toEdit.startDate).getTime() < Date.now()) {
      return res
        .status(403)
        .json({ message: "Past bookings can't be modified" });
    }

    // 403
    if (toEdit.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { startDate, endDate } = req.body;
    const isConflicting = await checkConflict({
      id: toEdit.id,
      spotId: toEdit.spotId,
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
    toEdit.set({ startDate, endDate });
    const edited = await toEdit.save();
    res.json(edited);
  } catch (e) {
    e.status = 400;
    next(e);
  }
});

router.delete("/:bookingId", requireAuth, async (req, res) => {
  const { bookingId } = req.params;
  const currBooking = await Booking.findByPk(bookingId);
  if (!currBooking) {
    res.status(404).json({ message: "Booking couldn't be found" });
  }
  if (currBooking.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // 403
  if (new Date(currBooking.startDate).getTime() < Date.now()) {
    return res.status(403).json({ message: "Past bookings can't be modified" });
  }
  currBooking.destroy();

  res.json({ message: "Successfully deleted" });
});

module.exports = router;
