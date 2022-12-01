const jwt = require('jsonwebtoken')
require('dotenv').config()
const {SIGNING_SECRET}= process.env

exports.authCheck = function (req, res, next) {
    if (!req.user) {
        res.status(401).send("go away!")
        return
    }
    
    next()
}

exports.authScreen = function ( req, res, next) {
    let header = req.get("Authorization");
    if (!header) {
        next()
        return
        return
      }
      let [type, token] = header.split(" ");  
    const user = jwt.verify(token, SIGNING_SECRET)
    req.user = user
    next()
    
}

