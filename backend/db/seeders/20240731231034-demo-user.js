"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate(
      [
        {
          email: "demo@user.io",
          firstName: "User1",
          lastName: "TestUser",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          email: "user2@user.io",
          firstName: "User2",
          lastName: "TestUser",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          email: "user3@user.io",
          firstName: "User3",
          lastName: "TestUser",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          email: "user4@user.io",
          firstName: "User4",
          lastName: "TestUser",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("asdfghjkl;"),
        },
        {
          email: "jimmytest@user.io",
          firstName: "Jimmy",
          lastName: "Test",
          username: "JimmyTest",
          hashedPassword: bcrypt.hashSync("123456789"),
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      {}
    );
  },
};
