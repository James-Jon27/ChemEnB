"use strict";
const { Review } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const reviews = [
	{ spotId: 1, userId: 1, stars: 5, review: "This place exceeded our expectations! The host was incredibly welcoming, and the apartment was spotless and beautifully decorated. Highly recommend for a relaxing stay." },
	{ spotId: 1, userId: 2, stars: 4, review: "Really enjoyed our stay here. The location was perfect and the amenities were great. The only downside was the noise from the street, but overall, a great experience." },
	{ spotId: 1, userId: 3, stars: 3, review: "The apartment was okay, but the check-in process was a bit confusing and the WiFi was unreliable. The location is convenient, though." },
	{ spotId: 1, userId: 4, stars: 5, review: "Absolutely loved it! The place was just as described and the host went above and beyond to make us feel at home. We’ll definitely be coming back." },
	{ spotId: 1, userId: 5, stars: 4, review: "Great spot for a city getaway. The apartment was clean and well-equipped. A little noisy at times, but the host was very responsive and helpful." },

	{ spotId: 2, userId: 2, stars: 2, review: "Unfortunately, our stay was not as expected. The apartment was not very clean, and the amenities were lacking. The host was unresponsive to our concerns." },
	{ spotId: 2, userId: 3, stars: 3, review: "The location was good, but the apartment could use some updates. It was a bit worn out and not as comfortable as we had hoped. The host was friendly, though." },
	{ spotId: 2, userId: 5, stars: 4, review: "Decent place with a good location. The apartment was cozy and the host was pleasant. A few minor issues with cleanliness, but overall a good stay." },
	{ spotId: 2, userId: 4, stars: 2, review: "Not very impressed. The apartment was smaller than expected, and there were some maintenance issues. It served its purpose but not ideal for a longer stay." },
	{ spotId: 2, userId: 1, stars: 4, review: "Good value for the money. The apartment was functional and the host was accommodating. A few minor issues, but nothing that ruined our stay." },

	{ spotId: 3, userId: 3, stars: 5, review: "Wonderful experience! The home was stylish, comfortable, and in a great location. The host was very welcoming and provided excellent recommendations." },
	{ spotId: 3, userId: 1, stars: 4, review: "Great place to stay! The apartment was spacious and well-furnished. A bit of noise from the street, but the location was very convenient and the host was great." },
	{ spotId: 3, userId: 2, stars: 4, review: "Very enjoyable stay. The place was clean and well-organized. The host was helpful and easy to communicate with. A bit more noise than expected, but still a nice stay." },
	{ spotId: 3, userId: 4, stars: 5, review: "Fantastic property! The apartment was immaculate and had all the amenities we needed. The host was very attentive and made us feel right at home." },
	{ spotId: 3, userId: 5, stars: 4, review: "Very nice stay. The location was perfect, and the apartment was comfortable. The host was responsive and made sure we had everything we needed." },

	{ spotId: 4, userId: 1, stars: 2, review: "Disappointing stay. The apartment was not very clean and had a few maintenance issues. The host was slow to respond to our concerns." },
	{ spotId: 4, userId: 2, stars: 3, review: "Average experience. The place was functional but not particularly comfortable. The host was friendly, but there were a few issues with the apartment that need addressing." },
	{ spotId: 4, userId: 4, stars: 1, review: "Terrible stay. The apartment was in poor condition and the host was unresponsive. Would not recommend this place." },
	{ spotId: 4, userId: 5, stars: 2, review: "Not very pleasant. The apartment was smaller and less clean than expected. The host’s communication was lacking." },
	{ spotId: 4, userId: 3, stars: 3, review: "It was okay, but the apartment needs some upgrades. The host was polite but not very helpful with the issues we encountered." },

	{ spotId: 5, userId: 2, stars: 4, review: "Very nice place. The apartment was clean and well-located. The host was accommodating and made sure we had everything we needed for a pleasant stay." },
	{ spotId: 5, userId: 1, stars: 5, review: "Exceptional stay! The place was beautiful, well-kept, and in a fantastic location. The host was very friendly and provided excellent local tips." },
	{ spotId: 5, userId: 4, stars: 4, review: "Enjoyable stay overall. The apartment was spacious and well-equipped. The host was helpful and made sure we had a great experience." },
	{ spotId: 5, userId: 3, stars: 5, review: "Absolutely loved it! The apartment was stylish, comfortable, and had everything we needed. The host was fantastic and very attentive." },
	{ spotId: 5, userId: 5, stars: 4, review: "Great place to stay. The location was ideal and the apartment was very comfortable. The host was very responsive and helpful throughout our stay." },

	{ spotId: 6, userId: 3, stars: 3, review: "The stay was decent but had some issues. The apartment was okay, though it could use some updates. The host was friendly but not very responsive." },
	{ spotId: 6, userId: 1, stars: 4, review: "Good place for the price. The apartment was clean and had all the essentials. The location was convenient, and the host was pleasant." },
	{ spotId: 6, userId: 2, stars: 3, review: "Average stay. The apartment was fine but lacked some comfort. The host was nice but could have been more proactive in addressing issues." },
	{ spotId: 6, userId: 4, stars: 4, review: "Nice spot. The apartment was well-kept and in a good location. The host was helpful and made sure we had a comfortable stay." },
	{ spotId: 6, userId: 5, stars: 3, review: "Decent place but not exceptional. The apartment was functional, though there were a few minor issues. The host was friendly but not very engaged." },

	{ spotId: 7, userId: 2, stars: 5, review: "Amazing stay! The property was beautiful, and the host was incredibly accommodating. Everything was perfect from check-in to check-out." },
	{ spotId: 7, userId: 5, stars: 4, review: "Great property with excellent amenities. The location was ideal and the host was very welcoming. A few minor issues, but overall a great experience." },
	{ spotId: 7, userId: 1, stars: 5, review: "Exceptional experience! The home was perfect—spacious, clean, and well-located. The host was very helpful and made us feel at home." },
	{ spotId: 7, userId: 4, stars: 5, review: "Fantastic stay. The property was just as described and the host was very accommodating. Couldn’t have asked for a better experience." },
	{ spotId: 7, userId: 3, stars: 4, review: "Really enjoyed the stay. The apartment was lovely and the host was great. A few minor issues but nothing that detracted from the overall experience." },

	{ spotId: 8, userId: 3, stars: 2, review: "Not a great stay. The apartment was in poor condition and not very clean. The host was unresponsive and did not address our concerns." },
	{ spotId: 8, userId: 1, stars: 3, review: "Average place. The apartment was okay but had some cleanliness issues. The host was friendly but not very helpful with our concerns." },
	{ spotId: 8, userId: 2, stars: 2, review: "Disappointing. The apartment was smaller than expected and not well-maintained. The host’s communication was lacking." },
	{ spotId: 8, userId: 4, stars: 3, review: "It was an okay stay. The apartment had its issues but was acceptable for a short visit. The host was polite but not very engaged." },
	{ spotId: 8, userId: 5, stars: 2, review: "Not up to par. The apartment had several problems and the host did not respond to our issues in a timely manner." },

	{ spotId: 9, userId: 1, stars: 4, review: "Great place. The apartment was clean and well-located. The host was helpful and made sure we had a comfortable stay." },
	{ spotId: 9, userId: 2, stars: 5, review: "Absolutely wonderful! The property was exactly as described and the host was amazing. Everything was perfect and we would love to stay here again." },
	{ spotId: 9, userId: 3, stars: 4, review: "Very nice stay. The apartment was well-equipped and in a great location. The host was responsive and made us feel welcome." },
	{ spotId: 9, userId: 4, stars: 4, review: "Good experience. The apartment was comfortable and clean. The host was great and provided useful local tips." },
	{ spotId: 9, userId: 5, stars: 5, review: "Fantastic stay! The property was beautiful and the host went out of their way to ensure we had a great time. Highly recommended!" },

	{ spotId: 10, userId: 2, stars: 3, review: "It was an okay stay. The apartment was fine but needed some updates. The host was friendly but the check-in process could have been smoother." },
	{ spotId: 10, userId: 1, stars: 4, review: "Nice place overall. The apartment was clean and in a good location. The host was responsive and made sure we were comfortable." },
	{ spotId: 10, userId: 3, stars: 3, review: "Decent apartment but not exceptional. It was clean but could use some improvements. The host was polite but not very proactive." },
	{ spotId: 10, userId: 4, stars: 4, review: "Good value for the price. The apartment was comfortable and the host was helpful. A few minor issues, but nothing that affected our stay significantly." },
	{ spotId: 10, userId: 5, stars: 3, review: "The stay was acceptable but had some issues. The apartment was okay, but there were some maintenance problems. The host was decent but not very involved." },
];

;

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
    await Review.bulkCreate(reviews, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = "Reviews";
    await queryInterface.bulkDelete(options, reviews, {});
  },
};
