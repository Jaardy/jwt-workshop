const jwt = require('jsonwebtoken')
const signingSecret = 'a random long string of words, but we should probably hide this.'

let payload = {user: "Fozzie", email: "fozzie@gmail.com"}

const token = jwt.sign(payload, signingSecret)


console.log(token)

const userData = jwt.verify(token, signingSecret)

console.log(userData)