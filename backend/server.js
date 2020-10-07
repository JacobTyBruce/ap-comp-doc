require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken')

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

// schemas for whatever youre doing
const docSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    text: String,
    // implement later ref: Object,
    tags: Array,
    posted: Boolean,
  },
  { timestamps: true }
);
const challengeSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    challenge: String,
    text: String,
    posted: Boolean,
  },
  { timestamps: true }
);
const usersSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    userId: String,
    roles: Array,
    sessionToken: String,
    resetToken: String
  },
  { timestamps: true }
);
const postSchema = new mongoose.Schema(
  {
    title: String,
    text: String,
    postedBy: String,
    posted: Boolean,
  },
  { timestamps: true }
);

// generate model
// model = collection !!!!!!!!!!!
// When searching use below Class Variable to search ie. Use route param as this
// first param is uppercase singular
const Users = mongoose.model("User", usersSchema);
const Challenges = mongoose.model("Challenge", challengeSchema);
const Docs = mongoose.model("Doc", docSchema);
const Posts = mongoose.model("Post", postSchema);
// string to connect to mongodb, use .env for variables before uploading
const mongo = `mongodb+srv://${dbUser}:${dbPass}@cluster0.gczfd.mongodb.net/${dbName}?retryWrites=true&w=majority`;
// connect
mongoose.connect(mongo, { useNewUrlParser: true, useUnifiedTopology: true });
// reference connection
const db = mongoose.connection;
// errors
db.on("error", console.error.bind(console, "connection error:"));

// token verification middleware
const verifyToken = function verifyToken(req, res, next) {

  // get access token from header
  var accessToken = req.headers.authorization.split(" ")[1]
  // check if access is good
  jwt.verify(accessToken, process.env.AUTH_SERVER_SECRET, (accessResDecoded, err) => {
    // if access is good, this fires
    if (!err) {
      req.body.decoded = accessResDecoded
      next()
      // if not, this does
    } else {
      // check if cookie (refresh) exists
      if (Object.prototype.hasOwnProperty.call(req.cookies, "token")) {
        // if so, get new access
        console.log('Getting new Access')
        console.log('Refresh Token: ' + req.cookies.token)
        axios.post(`${process.env.AUTH_SERVER_URL}/get-access`, { token: req.cookies.token }).then(newAccess => {
          res.write(newAccess)
          console.log(res.body)
          console.log('New Access: ' + newAccess)
          next()
        }).catch(err => {
          // catches arbitrary error with getting new access
          console.log('Error getting new access')
          console.log('Return Body: ' + err)
          res.send('Arbitrary Error with request, please try again', 400)
        })
      } else {
        // if no cookies/refresh token is present, this fires
        res.send('Not authorized to use this resource, login to try again', 401)
      }
    }
  })
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());

// mapping function for URL and collection
function getCollection(urlReq) {
  let param;
  switch (urlReq) {
    case "users":
    case "Users":
      param = Users;
      break;
    case "challenges":
    case "Challenges":
      param = Challenges;
      break;
    case "docs":
    case "Docs":
      param = Docs;
      break;
    case "posts":
    case "Posts":
      param = Posts;
      break;
    default:
      param = "None";
  }
  return param;
}

app.get("/api/get/:col/all", (req, res) => {
  let collection = getCollection(req.params.col);
  if (collection == "None") {
    res.send(
      "Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col
    );
  } else {
    collection.find({}, { password: 0, sessionToken: 0 }).then(function (data) {
      res.send(data);
    });
  }
});

app.get("/api/get/:col/", (req, res) => {
  console.log("GET request received");
  let collection = getCollection(req.params.col);
  let query = req.query;
  if (collection == "None") {
    res.send(
      "Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col
    );
  } else {
    collection.find(query, { password: 0, sessionToken: 0 }).then((data) => {
      res.send(data);
    });
  }
});

app.post("/api/post/:col", verifyToken, (req, res) => {
  console.log("post request");
  let collection = getCollection(req.params.col);
  if (collection == "None") {
    res.send(
      "Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col
    );
  } else {
    collection.create(req.body).then((data) => {
      console.log(data);
      console.log(data.createdAt);
      res.send(data);
    });
  }
});

app.patch("/api/update/:col/", verifyToken, (req, res) => {
  console.log("Patch Request");
  let collection = getCollection(req.params.col);
  if (collection == "None") {
    res.send(
      "Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col
    );
  } else {
    // check if all query is supplied, if not look in body
    if (req.query.hasOwnProperty("all") == true) {
      console.log("All");
      collection
        .updateMany(req.body.query, req.body.replace, { new: true })
        .then((err, doc) => {
          res.send("All Updated");
        });
    } else {
      console.log("Not all");
      collection.findOneAndUpdate(
        req.body.query,
        req.body.replace,
        { new: true },
        (err, doc) => {
          res.send(doc);
        }
      );
    }
  }
});

app.delete("/api/delete/:col", verifyToken, (req, res) => {
  let collection = getCollection(req.params.col);
  if (collection == "None") {
    res.send(
      "Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col
    );
  } else {
    collection.deleteOne(req.body).then((data) => {
      res.send(data);
    });
  }
});

app.get("/api/login", async (req, res) => {
  console.log("Login recieved");
  console.log(req.cookies);
  if (Object.prototype.hasOwnProperty.call(req.cookies, "token")) {
    console.log('Has Cookies')
    // fires if cookie token is good
    try {
      // gets access
      var access = await axios.post(`${process.env.AUTH_SERVER_URL}/get-access`, {
        token: req.cookies.token
      })
      // decodes refresh token, which has user info
      var decoded = await axios.post(`${process.env.AUTH_SERVER_URL}/decode`, {
        token: req.cookies.token
      })
      // finds user account in DB
      var acc = await Users.find({ username: decoded.data.username, userId: decoded.data.userId }, { password: 0 })
      console.log('Account and token good')
      console.log(acc)
      res.status(200).send(acc)
    } catch (error) {
      // fires if cookie was bad
      if (!req.headers.authorization) {
        // token is bad, clears cookie and requests user to login again
        console.log(error)
        res.clearCookie('token')
        res.status(401).send('Token is bad or cannot find user. Please Try again')
        console.log('Cleared Cookie')
      } else {
        try {
          // login with auth provided -- this is for when tab was left open and cookie did not clear but token is expired and a user logs in normally
          console.log('Cookie, but expired')
          // get auth header
          var auth = Buffer.from(
            req.headers.authorization.split(" ")[1],
            "base64"
          ).toString();
          console.log(auth)
          // get username and pass
          var username = auth.substring(0, auth.indexOf(":"));
          var password = auth.substring(auth.indexOf(":") + 1, auth.length);
          // find account -- do not return password and sessionToken is not returned because it will mess up search later
          var account = await Users.find({ username: username }, {sessionToken: 0})
          // validate password
          var result = await bcrypt.compare(password, account[0].password)
          console.log(result)
          if (result == true) {
            // fires if password matches
            console.log(account[0])
            // get refresh token
            var refreshToken = await axios.post(`${process.env.AUTH_SERVER_URL}/get-refresh`, account[0])
            console.log(refreshToken.data)
            // set refresh in user account -- enables auth server search
            var setRefresh = await Users.updateOne(account[0], { $set: { sessionToken: refreshToken.data } }, {new: true})
            console.log(setRefresh)
            // set cookie
            res.cookie("token", refreshToken.data, { httpOnly: true });
            // get access
            var accessToken = axios.post(`${process.env.AUTH_SERVER_URL}/get-access`, {token: refreshToken})
            // send response 
            res.status(200).send({
              username: account[0].username,
              email: account[0].email,
              userId: account[0].userId,
              roles: account[0].roles,
              access: accessToken,
            });
          } else {
            res.status(401).send('Wrong Credentials')
            console.log('Wrong credentials')
            return;
          }
        } catch (error) {
          res.status(500).send('Errow with Request')
          console.log(error)
        }
      }
    }
  } else {
    console.log('Does not have cookies')
    var auth = Buffer.from(
      req.headers.authorization.split(" ")[1],
      "base64"
    ).toString();
    console.log(auth)
    var username = auth.substring(0, auth.indexOf(":"));
    var password = auth.substring(auth.indexOf(":") + 1, auth.length);
    Users.find({ username: username }).then((account) => {
      bcrypt.compare(password, account[0].password).then((result) => {
        console.log(result)
        if (result === true) {
          // get refresh
          console.log(account[0])
          axios
            .post(`${process.env.AUTH_SERVER_URL}/get-refresh`, account[0])
            .then((refreshTokenRes) => {
              // set refresh in DB so auth server can lookup for access
              let acc = Users.findOneAndUpdate(
                {
                  username: account[0].username,
                  userId: account[0].userId,
                },
                { $set: { sessionToken: refreshTokenRes.data } },
                { new: true }
              ).exec();
              // set cookie
              res.cookie("token", refreshTokenRes.data, { httpOnly: true });
              // get access
              axios
                .post(`${process.env.AUTH_SERVER_URL}/get-access`, { token: refreshTokenRes.data })
                .then((accessTokenRes) => {
                  console.log(refreshTokenRes.data);
                  console.log(account[0]);
                  res.send({
                    username: account[0].username,
                    email: account[0].email,
                    userId: account[0].userId,
                    roles: account[0].roles,
                    access: accessTokenRes.data,
                  });
                })
                .catch((err) => {
                  res.send(err);
                });
            })
            .catch((err) => {
              res.send(err);
            });
        }
        if (result === false) {
          res.send(false);
        }
      });
    }).catch((err) => {
      console.log('Wrong Username or Password')
      res.status(401).send('Wrong Username or Password')
    });
  }
});

app.post("/api/signup", async (req, res) => {
  console.log("Received Signup Request");
  var emailAvailable;
  var userAvailable;

  emailCheck = await Users.find({ email: req.body.email }).exec();
  emailAvailable = emailCheck.length == 0 ? true : false;

  var userCheck = await Users.find({ username: req.body.username }).exec();
  userAvailable = userCheck.length == 0 ? true : false;

  console.log("Checked Availability", emailAvailable, userAvailable);
  if (emailAvailable == true && userAvailable == true) {
    req.body.userId = Math.random()
      .toString(36)
      .substr(2, 13);
    req.body.roles = ["user"];
    req.body.password = bcrypt.hashSync(req.body.password, 12);
    Users.create(req.body).then((data) => {
      res.send(
        (({ username, email, roles, userId }) => ({
          username,
          email,
          roles,
          userId,
        }))(data)
      );
    });
    console.log("Created User");
  } else {
    console.log("Error creating");
    var errorMsg = {
      errors: [],
    };
    console.log(emailAvailable, userAvailable);
    if (emailAvailable == false) {
      errorMsg.errors.push("Account Already Registered With Email");
      console.log("Pushed Error with Email");
    }
    if (userAvailable == false) {
      errorMsg.errors.push("Account Already Registered With Username");
      console.log("Pushed Error with username");
    }
    res.send(errorMsg);
  }
});

app.get("/api/logout", (req, res) => {
  console.log("Logout Request");
  console.log(req.cookies);
  res.clearCookie("token");
  res.send('Success, cookie "Token" removed');
  // use cookie parser to get account info
  axios
    .post(`${process.env.AUTH_SERVER_URL}/decode`, { token: req.cookies.token })
    .then((decoded) => {
      console.log("Removing Session Token from User Account");
      Users.updateOne({ username: decoded.data.username, userId: decoded.data.userId }, { sessionToken: "" })
        .exec();
      console.log("Removed Session Token from User Account");
    })
    .catch((err) => console.log(err));
});

app.post('/api/set-reset', async (req, res) => {
  var account;
  // checks for username or email
  if (req.body.hasOwnProperty('email')) {
    var email = req.body.email
    try {
      account = await Users.find({ email: email }, { password: 0, sessionToken: 0 }).exec()
    } catch {
      res.status(401).send('Error creating request')
    }
  } else {
    var username = req.body.username
    try {
      account = await Users.find({ username: username }, { password: 0, sessionToken: 0 }).exec()
    } catch {
      res.status(401).send('Error creating request')
    }
  }
  console.log(account)
  try {
    var code = Math.random()
      .toString(36)
      .substr(2, 6);
    var resetToken = jwt.sign({ username: account.username, email: account.email, code: 12345 }, process.env.AUTH_SERVER_SECRET, { expiresIn: '5m' })
    console.log(resetToken)
    var newAccount = await Users.findOneAndUpdate(account, { resetToken: resetToken })
    res.send(newAccount)
  }
  catch (err) {
    console.log(err)
    res.send('Failed to Update User')
  }
})

app.get("/test", (req, res) => {
  bcrypt
    .compare(
      "$2b$12$5j1SZKX/G85Sqru/XU4elejnNvIOdt8hjazDWj334Ge9s7OkRaXqC",
      "$2b$12$Kw3epUaGJRxJ6fACoR68y.BHkIDR0IhQfkGLCIUh4YHJRrLLDdZJi"
    )
    .then((result) => {
      console.log(result);
      res.send(result);
    });
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});