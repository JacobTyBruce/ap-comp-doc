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

app.get('/get-refresh', (req,res) => {
    var token = jwt.sign({name: 'Refresh'}, process.env.AUTH_SERVER_SECRET, { expiresIn: '30m' })
    res.send(token)
    console.log('Refresh Token Sent')
})

app.post('/get-access', (req,res) => {
    // check refresh -- change to check cookie as this is where it will be sent in the future
    var accessToken = Buffer.from(
    req.headers.authorization.split(" ")[1],
    "base64"
  ).toString();
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
            res.send(err)
        } else {
            res.send(decoded)
        }
    })
})

app.listen(8082, () => {
    console.log('Auth Server Running on port 8082')
})