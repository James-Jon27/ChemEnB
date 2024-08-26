"use strict";
const { query } = require("express");
const { Spot } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const bulkSpots = [
	{
		ownerId: 1,
		address: "456 Innovation Blvd",
		city: "Silicon Valley",
		state: "California",
		country: "United States of America",
		lat: 37.3860517,
		lng: -122.0838511,
		name: "Quantum Quarters",
		description: "Lab specializing in quantum computing experiments",
		price: 250,
	},
	{
		ownerId: 2,
		address: "789 Inventor Ave",
		city: "Boston",
		state: "Massachusetts",
		country: "United States of America",
		lat: 42.3600825,
		lng: -71.0588801,
		name: "RoboRealm",
		description: "The ultimate robotics innovation hub",
		price: 200,
	},
	{
		ownerId: 3,
		address: "123 Future Lane",
		city: "Austin",
		state: "Texas",
		country: "United States of America",
		lat: 30.267153,
		lng: -97.7430608,
		name: "BioGen Studios",
		description: "Pioneering lab for genetic engineering and biotechnology",
		price: 300,
	},
	{
		ownerId: 1,
		address: "321 Discovery Drive",
		city: "Seattle",
		state: "Washington",
		country: "United States of America",
		lat: 47.606209,
		lng: -122.332069,
		name: "AstroLab",
		description: "Exploring the cosmos through cutting-edge space research",
		price: 350,
	},
	{
		ownerId: 2,
		address: "654 Experiment St",
		city: "San Diego",
		state: "California",
		country: "United States of America",
		lat: 32.715736,
		lng: -117.161087,
		name: "VR Ventures",
		description: "Virtual reality and immersive tech development center",
		price: 180,
	},
	{
		ownerId: 3,
		address: "987 Tech Way",
		city: "New York",
		state: "New York",
		country: "United States of America",
		lat: 40.712776,
		lng: -74.005974,
		name: "AI Alley",
		description: "Hub for artificial intelligence and machine learning research",
		price: 400,
	},
	{
		ownerId: 1,
		address: "135 Future Tech Dr",
		city: "Chicago",
		state: "Illinois",
		country: "United States of America",
		lat: 41.878113,
		lng: -87.629799,
		name: "NanoNexus",
		description: "Advanced lab focusing on nanotechnology and materials science",
		price: 220,
	},
	{
		ownerId: 2,
		address: "246 Discovery Ave",
		city: "Los Angeles",
		state: "California",
		country: "United States of America",
		lat: 34.052235,
		lng: -118.243683,
		name: "GreenTech Labs",
		description: "Innovative solutions for sustainable and green technology",
		price: 275,
	},
	{
		ownerId: 3,
		address: "357 Innovation Parkway",
		city: "Denver",
		state: "Colorado",
		country: "United States of America",
		lat: 39.739236,
		lng: -104.990251,
		name: "CyberSpace Labs",
		description: "Exploring the next generation of cybersecurity technologies",
		price: 230,
	},
	{
		ownerId: 1,
		address: "468 Creative Loop",
		city: "Atlanta",
		state: "Georgia",
		country: "United States of America",
		lat: 33.74905,
		lng: -84.388229,
		name: "Fusion Works",
		description: "Lab dedicated to fusion energy and cutting-edge physics research",
		price: 310,
	},
];
;
//ReviewImage
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(bulkSpots, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Spots";
    await queryInterface.bulkDelete(options, bulkSpots, {});
  },
};
