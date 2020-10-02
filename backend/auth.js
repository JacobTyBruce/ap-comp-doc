// need to be able to receive refresh token and renew access
// check if refresh token is good by looking up in DB
// need to be able to create refresh tokens and access tokens

require("dotenv").config();
const jwt = require('jsonwebtoken')
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/get-refresh', (req,res) => {
    console.log(req.body)
    let acc = {
        _id: req.body._id,
        username: req.body.username,
        email: req.body.email,
        userId: req.body.userId,
        roles: req.body.roles
    }
    var token = jwt.sign(acc, process.env.AUTH_SERVER_SECRET, { expiresIn: '30m' })
    res.send(token)
    console.log(token)
    console.log('Refresh Token Sent')
})

app.post('/get-access', (req,res) => {
    // check refresh -- change to check cookie as this is where it will be sent in the future
    var accessToken = req.body.token
  console.log(accessToken)
    jwt.verify(accessToken, process.env.AUTH_SERVER_SECRET, (err, decoded) => {
      if (err) {
          res.send(err)
          console.log(err)
      } else {
          res.send(jwt.sign({name: 'Access'}, process.env.AUTH_SERVER_SECRET, {expiresIn: '30s' }))
          console.log('success')
      }

  })

})

app.post('/verify-token', (req,res) => {
    var decoded = jwt.verify(req.body.token,process.env.AUTH_SERVER_SECRET, (err, decoded) => {
        if (err) {
            res.send(err, 401)
        } else {
            res.send(decoded, 200)
        }
    })
})

app.post('/decode', (req, res) => {
    var decodedToken = jwt.decode(req.body.token, process.env.AUTH_SERVER_SECRET)
    res.send(decodedToken)
})

app.listen(8082, () => {
    console.log('Auth Server Running on port 8082')
})