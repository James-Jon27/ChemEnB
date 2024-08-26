"use strict";
const { ReviewImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const imgs = [
  {
    reviewId: 1,
    url: "https://a0.muscache.com/im/pictures/5e67688b-757d-44d6-8b4b-1e91dc6fe49f.jpg?im_w=1920",
  },
  {
    reviewId: 2,
    url: "https://a0.muscache.com/im/pictures/073c9ee3-df86-441f-a7da-e7fa1b0a8457.jpg?im_w=1920",
  },
  {
    reviewId: 3,
    url: "https://a0.muscache.com/im/pictures/2864bf02-854b-49c0-976e-1511488d4d2f.jpg?im_w=1920",
  },
  {
    reviewId: 4,
    url: "https://a0.muscache.com/im/pictures/hosting/Hosting-53252166/original/50ff107f-f23b-4d24-8c27-0972208427a2.jpeg?im_w=320",
  },
  {
    reviewId: 5,
    url: "https://a0.muscache.com/im/pictures/miso/Hosting-20605023/original/0be3f493-fd2d-434e-b557-ad2c189b1543.jpeg?im_w=320",
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
    await ReviewImage.bulkCreate(imgs, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "ReviewImages";
    await queryInterface.bulkDelete(options, imgs, {});
  },
};
