// need to be able to receive refresh token and renew access
// check if refresh token is good by looking up in DB
// need to be able to create refresh tokens and access tokens

require("dotenv").config();
const jwt = require('jsonwebtoken')
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require('axios')

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/get-refresh', (req,res) => {
    console.log('Getting Refresh Token For User '+req.body.username)
    let acc = {
        type: 'Refresh',
        _id: req.body._id,
        username: req.body.username,
        email: req.body.email,
        userId: req.body.userId,
        roles: req.body.roles
    }
    var token = jwt.sign(acc, process.env.AUTH_SERVER_SECRET, { expiresIn: '1h' })
    res.send(token)
    console.log("Refresh Token: "+token)
    console.log('Refresh Token Sent')
})

app.post('/get-access', (req,res) => {
    var refreshToken = req.body.token
  console.log('User Refresh Token: '+refreshToken)
    jwt.verify(refreshToken, process.env.AUTH_SERVER_SECRET, (err, decoded) => {
      if (err) {
          res.send(err)
          console.log(err)
      } else {
          console.log('Valid Refresh, sending new access now')
          newAccess = jwt.sign({type: 'Access'}, process.env.AUTH_SERVER_SECRET, {expiresIn: '5m' })
          res.send(newAccess)
          console.log('Access Sent')
          console.log('Access Token: '+newAccess)
      }

  })

})

// verifies REFRESH ONLY
app.post('/verify-token', (req,res) => {
    var decoded = jwt.verify(req.body.token,process.env.AUTH_SERVER_SECRET, async (err, decoded) => {
        if (err) {
            res.send(err, 401)
        } else if (decoded.type == 'Access') {
            res.send(decoded)
        } else{
            console.log(decoded)
            //check if right account
            let queryString = `?username=${decoded.username}&&email=${decoded.email}&&userId=${decoded.userId}`
            try {
                let account = await axios.get(`${process.env.VUE_APP_API_URL}/api/get/users/${queryString}`)
                
            } catch (err) {
                console.log(err)
                res.send('Error with session, please log out of all instances', 400)
            }
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