"use strict";

const path = require("path");
const { Sequelize, Model, DataTypes, ValidationError } = require("sequelize");
const { userData, messageData } = require("./seedData");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "db.sqlite"),
  logging: false,
});

const User = class User extends Model {
  static associate(models) {
    User.hasMany(models["Message"]);
  }
};

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

const Message = class Message extends Model {
  static associate(models) {
    Message.belongsTo(models["User"]);
  }
};

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
  await Message.bulkCreate(messageData, { include: [User] });
  console.log("ping`");
}
main();

module.exports = { User, Message, sequelize };
