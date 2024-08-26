"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.Spot, { foreignKey: { name: "spotId" } });
      Booking.belongsTo(models.User, { foreignKey: { name: "userId" } });
    }
  }
  Booking.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          checkDate(date) {
            if (new Date(date).getTime() < Date.now()) {
              throw new Error("startDate cannot be in the past");
            } // only allow date strings after a specific date
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfter(date) {
            const end = new Date(date);
            const start = new Date(this.startDate);
            if (end.getTime() < start.getTime()) {
              throw new Error("endDate cannot be on or before startDate");
            }
          }, // only allow date strings before a specific date},
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
