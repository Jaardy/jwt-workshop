"use strict"

const express = require('express')
require('dotenv').config()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const {SIGNING_SECRET, SALT_COUNT} = process.env
const {  User, sequelize  } = require("./db");
const port = 3000

const app = express()

app.set("json spaces", 2);
app.use(express.json())

//Checks for Bearer token, if it is there, it verifies the token and sets the user data returned as a property on the request object.  The middleware calls next either way.
app.use(( req, res, next) => {
    let header = req.get("Authorization");
    if (!header) {
        next()
        return
      }
      let [type, token] = header.split(" ");  //Bearer ${hereisthetoken}
    const user = jwt.verify(token, SIGNING_SECRET)
    console.log(user)
    req.user = user
    next()
    
})

//This is middleware I've inserted at the end-point handlers to demostrate how I can insert logic after I've hit an end-point path.
const authCheck = function (req, res, next) {
    console.log('My Auth Check')
    next()
}

app.post('/register', async (req, res) => {
    const {username, password} = req.body
    const hashedPW = await bcrypt.hash(password, Number.parseInt(SALT_COUNT))
    const user = await User.create({username, password: hashedPW})
    const token  = jwt.sign({username, id: user.id,}, SIGNING_SECRET)
    res.status(200).send({message: 'User has been registered and logged in.', token})
})


app.post('/login', async (req, res, next) => {
    const {username, password} = req.body
    const user = await User.findOne({where: {username}})
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) {
        const token = await jwt.sign({username:user.username, id: user.id}, SIGNING_SECRET)
        res.status(200).send({message: "You're logged in", token})
      }
    }
  })

// Random end point to test
app.get('/', authCheck, (req, res)=> {
    res.send('Working')
})

app.listen(port, async () => {
    try {
      await sequelize.sync({force: true});
      console.log(`Listening on port ${port}`);
    } catch (err) {
      console.error("Failed to start server:", err);
       
    }
  });
  