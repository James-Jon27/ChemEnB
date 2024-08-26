"use strict";
const { Booking } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const relations = [
  {
    spotId: 1,
    userId: 2,
    startDate: "2025-11-19",
    endDate: "2025-12-20",
  },
  {
    spotId: 2,
    userId: 1,
    startDate: "2025-12-19",
    endDate: "2025-12-20",
  },
  {
    spotId: 3,
    userId: 1,
    startDate: "2025-11-21",
    endDate: "2025-11-22",
  },
  {
    spotId: 4,
    userId: 2,
    startDate: "2025-12-19",
    endDate: "2025-12-20",
  },
  {
    spotId: 5,
    userId: 1,
    startDate: "2025-11-19",
    endDate: "2025-11-20",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await Booking.bulkCreate(relations, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Bookings";
    await queryInterface.bulkDelete(options, relations, {});
  },
};
