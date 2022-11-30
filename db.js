"use strict";

const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const {
  userData,
  messageDataAnimal,
  messageDataFozzie,
  messageDataSwedishChef,
} = require("./seedData");

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
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.hasMany(Message, {foreignKey: 'userId'});
Message.belongsTo(User, {foreignKey: 'userId'});

async function main() {
  await sequelize.sync({ force: true });

  const Users = await User.bulkCreate(userData);
  await Promise.all(messageDataFozzie.map((x) => Users[0].createMessage(x)));
  await Promise.all(
    messageDataSwedishChef.map((x) => Users[1].createMessage(x))
  );
  await Promise.all(messageDataAnimal.map((x) => Users[2].createMessage(x)));
}
main();

module.exports = { User, Message, sequelize };
