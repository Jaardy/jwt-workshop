"use strict"
require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const {auth, requiresAuth} = require('express-openid-connect')
const cookieParser = require('cookie-parser')


// const, authScreen} = require('./middleware')
const {User, Message, sequelize} = require('./db')

const {SIGNING_SECRET, SALT_COUNT, PORT} = process.env
const port = PORT || 3000

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: '3YDRCaVGp6lBKT6xdNYN8Juk3Hc2Nj9B',
  issuerBaseURL: 'https://dev-zy6e7tp6yqttk7l0.us.auth0.com'
};

const app = express();

app.set("json spaces", 2);

// app.use(authScreen)
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
app.use(express.json(), cookieParser())
app.use((req, res, next) => {
  console.log(req.oidc)
  next()
})

app.get('/', (req, res, next) => {
      console.log(JSON.stringify(req.oidc.user))
      res.send('ok') 
})


app.post('/register', async (req, res) => {
    const {username, password} = req.body
    const hashedPW = await bcrypt.hash(password, Number.parseInt(SALT_COUNT))
    const user = await User.create({username, password: hashedPW})
    const token  = jwt.sign({username, id: user.id,}, SIGNING_SECRET)
    res.status(200).send({message: `User has been registered and logged in.`, token})
})

app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (user.password) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = await jwt.sign(
        { username: user.username, id: user.id },
        SIGNING_SECRET
      );
      res.status(200).send({ message: "You're logged in", token });
    }
  }
});


app.get('/messages', async (req, res) => {
  const messages = await Message.findAll()
  res.status(200).send(messages)
})

app.get('/messages/:userId', async (req, res) => {
  const {userId} = req.params
  const messages = await Message.findAll({where: {userId: userId}})
  res.status(200).send(messages)
})

app.post('/messages', async (req, res) => {
  const {message: incomingMessage} = req.body
  const user = await User.findByPk(req.user.id)
  const createdMessage = await user.createMessage({message: incomingMessage})
  res.status(200).send(createdMessage)
})
 
app.delete('/messages/:messageId', async (req, res) => {
  const {messageId} = req.params
  

  const message = await Message.findByPk(messageId)
  if (!message) {
    res.status(200).send("Message wasn't found.")
    return
  }
  console.log(message?.userId, req.user.id)

  if (message && message?.userId != req.user.id) {
    res.status(403).send("You are not the owner of this resource.")
    return
  }
  const deletedPost = await Message.destroy({where: {userId: req.user.id, id: messageId}})
 
  res.send({message: "Message was deleted."})

})

app.listen(port, async () => {
    try {
      await sequelize.sync({force: true});
      console.log(`Listening on port ${port}`);
    } catch (err) {
      console.error("Failed to start server:", err);
       
    }
  });
  

