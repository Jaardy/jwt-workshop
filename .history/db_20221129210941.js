"use strict";

const path = require("path");
const { Sequelize, Model, DataTypes, ValidationError } = require("sequelize");
const { userData, messageData } = require("./seedData");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "db.sqlite"),
  logging: false,
});

const User = class User extends Model {};

User.init(
  {
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
  },
  {
    sequelize: sequelize,
  }
);

const Message = class Message extends Model {};

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
  }
);

User.hasMany(Message);
Message.belongsTo(User);

async function main() {
  sequelize.sync({ force: true });
  await User.bulkCreate(userData);
  await Message.bulkCreate(messageData);
  console.log("ping`");
}
main();

module.exports = { User, Message, sequelize };
