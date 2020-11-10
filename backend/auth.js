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

// mongoose schema, model, and connection for token validation
// schema
const usersSchema = new mongoose.Schema(
    {
      username: String,
      email: String,
      password: String,
      userId: String,
      roles: Array,
      sessionToken: Array,
      resetToken: String
    },
    { timestamps: true }
  );
  // model
const Users = mongoose.model("User", usersSchema);
// variables for connection
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
// string to connect to mongodb, use .env for variables before uploading
const mongo = `mongodb+srv://${dbUser}:${dbPass}@cluster0.gczfd.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true });
// reference connection
const db = mongoose.connection;
// errors
db.on("error", console.error.bind(console, "connection error:"));

// middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/get-refresh', (req, res) => {
    console.log('Getting Refresh Token For User ' + req.body.username)
    let acc = {
        type: 'Refresh',
        _id: req.body._id,
        username: req.body.username,
        email: req.body.email,
        userId: req.body.userId,
        roles: req.body.roles
    }
    var token = jwt.sign(acc, process.env.AUTH_SERVER_SECRET, { expiresIn: `${process.env.REFRESH_TIME}` })
    res.status(201).send(token)
    console.log("Refresh Token: " + token)
    console.log('Refresh Token Sent')
})

app.post('/get-access', (req, res) => {
    console.log('Getting new Access')
    // get refresh token
    var refreshToken = req.body.token
    console.log('User Refresh Token: ' + refreshToken)
    // verify if valid
    jwt.verify(refreshToken, process.env.AUTH_SERVER_SECRET, async (err, decoded) => {
        console.log(decoded)
        if (err) {
            // fires if not valid -- can add refresh later on with iss, but exp time is so long and refresh on each request this shouldnt be needed rn
            res.status(401).send('Invalid Refresh')
            console.log(err)
        } else {
            // fires if valid
            // checks if token has all properties needed -- prevents if user manages to get refresh but does not supply all props needed

            // check if there is a method to match against
            if (!(decoded.hasOwnProperty('username') && decoded.hasOwnProperty('email') && decoded.hasOwnProperty('userId'))) {
                // not enough info in token, not good
                console.log('Not enough info in token, malformed')
                res.status(401).send('Malformed Token')
                return;
            } else {
                // enough info, verified
                console.log('Enough info')
            }
                // get account based on info in refresh token -- this is purely to get roles and userId for access token
                console.log(decoded)
                var {username, email, userId, roles} = decoded
                var accQuery = {
                    username,
                    email,
                    userId,
                    roles
                }
                try {
                   var account = await Users.find(accQuery, {password: 0})
                    console.log(`Account from search - ${account}`) 
                } catch (error) {
                    console.log('Trouble Getting Account')
                    console.log(error)
                    res.status(500).send('Trouble Getting Account')
                }

                // checks if acc was actually found
                if (account.length < 1) {
                    console.log('No Account Match Found')
                    res.status(400).send('No Account Found With Match')
                    return;
                }
                // converts account variable to account object, info is sent back as array with one object since single user lookup
                account = account[0]
                console.log(account)
                // checks if info in token and info in DB match up
                if (account.username == decoded.username && account.email == decoded.email && account.userId == decoded.userId) {
                    console.log('Accounts Match')
                    console.log('Request Token: '+req.body.token)
                    console.log(account)
                    // sends token with info from DB to ensure correct data
                    newAccess = jwt.sign({ type: 'Access', roles: account.roles, userId: account.userId }, process.env.AUTH_SERVER_SECRET, { expiresIn: `${process.env.ACCESS_TIME}` })
                    res.status(201).send(newAccess)
                } else {
                    // if info is wrong, do not issue
                    res.send('Info In Token Is Incorrect', 401)
                }
        }

    })

})

// verifies REFRESH ONLY
app.post('/verify-token', (req, res) => {
    var decoded = jwt.verify(req.body.token, process.env.AUTH_SERVER_SECRET, async (err, decoded) => {
        if (err) {
            res.send(err, 401)
        } else if (decoded.type == 'Access') {
            res.send(decoded)
        } else {
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
    console.log('Decoding')
    var decodedToken = jwt.decode(req.body.token, process.env.AUTH_SERVER_SECRET)
    res.send(decodedToken)
    console.log(decodedToken)
})

app.post('/verify', async (req,res) => {
    try {
        var decoded = jwt.verify(req.body.token, process.env.AUTH_SERVER_SECRET)
        res.status(200).send('Valid Token')
    } catch (err) {
        console.log(err)
        res.status(401).send('Bad Token')
    }
})

app.get('/reset-token', (req,res) => {
    var code = Math.random().toString(10).substring(2,7)
    var resetToken = jwt.sign({code: code}, process.env.AUTH_SERVER_SECRET, {expiresIn: '15m'})
    res.status(201).send(resetToken)
})

app.listen(8082, () => {
    console.log('Auth Server Running on port 8082')
})