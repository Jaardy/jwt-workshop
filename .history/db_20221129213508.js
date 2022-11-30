"use strict";

const path = require("path");
const { Sequelize, Model, DataTypes, ValidationError } = require("sequelize");
const { userData, messageData } = require("./seedData");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "db.sqlite"),
  logging: false,
});

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// User.hasMany(Message);
// Message.belongsTo(User);

async function main() {
  sequelize.sync({ force: true });
  // await User.bulkCreate(userData);
  await Message.bulkCreate(messageData);
  console.log("ping`");
}
main();

module.exports = { User, Message, sequelize };
