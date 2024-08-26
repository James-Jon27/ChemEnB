"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: "ownerId" });
      Spot.hasMany(models.Booking, { foreignKey: "spotId" });
      Spot.hasMany(models.Review, { foreignKey: "spotId" });
      Spot.hasMany(models.SpotImage, { foreignKey: "spotId" });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          checkSize(lat) {
            if (lat < -90 || lat > 90) {
              throw new Error("Latitude must be within -90 and 90");
            }
          },
        },
      },
      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          checkSize(lng) {
            if (lng < -180 || lng > 180) {
              throw new Error("Longitude must be within -180 and 180");
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        validate: {
          checkName(name) {
            if (name && name.length >= 50) {
              throw new Error("Name must be less than 50 characters");
            }
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          checkPrice(price) {
            if (price < 0) {
              throw new Error("Price per day must be a positive number");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
