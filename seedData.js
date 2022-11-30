const bcrypt = require('bcryptjs')
require('dotenv').config()
const SALT_COUNT = Number.parseInt(process.env.SALT_COUNT)



exports.userData = [
  { username: "Fozzie", unHashedpassword: "wokkawokka", password: '$2a$05$wgsZQQ8WZp3w5k/DF.a51eby0qsjHOwNtHTkXy75iG9OT3IvWhzVq'},
  { username: "Swedish Chef", unHashedpassword: "BorkBorkBork", password: '$2a$05$WC1oCxxJNQvR1EhO2Qg/VeVSGJg/773ldzQj3a5y0MDhgAV4f.Reu' },
  { username: "Animal", unHashedpassword: "AHHHHHHHHH", password: '$2a$05$f98QCvfrLYLaY3QfrKhd/eddByqN5dnrxGjJf3Jk2p4xYOgjXYd4S' },
];




exports.messageDataAnimal = [
  { message: "AHHHHH AHHHH AHHHHH" },
  { message: "AHHHHH AHHHHHHHHH AHHHHHHH" },
  { message: "AHHHHH?" },
];
exports.messageDataFozzie = [
  {
    message: "That's nothing! I once waited a whole year for September!",
  },
  {
    message:
      "I went to this bad sea food place the other day. Yeah, it was so bad, the catch of the day was salmon-ella!",
  },
];
exports.messageDataSwedishChef = [
  { message: "Today we make the chocolate mousse" },
  {
    message: "First, you take the chocolate, then you take the moose.",
  },
];
 