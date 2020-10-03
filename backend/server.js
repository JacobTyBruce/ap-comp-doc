require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios");
const cookieParser = require("cookie-parser");

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
  console.log('About to send access for verification')
  console.log(req.cookies)
  console.log(req.cookies.token)
  // check if access is good
  axios.post(`${process.env.AUTH_SERVER_URL}/verify-token`, { token: accessToken }).then(accessRes => {
    // fires if access jwt is good
    next()
  }).catch(accessErr => {
    // fires if access jwt is bad
    // checks for refresh token, if present, fires to get another access, if not fails with status 401 not auth

    // if cookie/refresh token is present, this fires
    if (Object.prototype.hasOwnProperty.call(req.cookies, "token")) {
      console.log('Getting new Access')
      console.log('Refresh Token: '+req.cookies.token)
      axios.post(`${process.env.AUTH_SERVER_URL}/get-access`, { token: req.cookies.token }).then(newAccess => {
        req.body.newAccess = newAccess
        console.log(res.body)
        next()
      }).catch(err => {
        // catches arbiturary error
        console.log('Error getting new access')
        console.log('Return Body: '+err)
        res.send('Arbiturary Error with request, please try again', 400)
      })
    } else {
      // if no cookies/refresh token is present, this fires
      res.send('Not authorized to use this resource, login to try again', 401)
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

// ------ CAN FIX API BY FILTERING RESULTS IN .find() BY PASSING SECOND OBJECT OF PROPS TO RETURN ----------

app.get("/api/get/:col/all", (req, res) => {
  let collection = getCollection(req.params.col);
  if (collection == "None") {
    res.send(
      "Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col
    );
  } else {
    collection.find().then(function(data) {
      console.log(data)
      let newData = data
        for (let i = 0; i < data.length; i++) {
          newData[i].password = null
          newData[i].sessionToken = null
        }
      res.send(newData);
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
    collection.find(query).then((data) => {
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
    axios
      .post(`${process.env.AUTH_SERVER_URL}/decode`, {
        token: req.cookies.token,
      })
      .then((decoded) => {
        console.log(decoded.data)
        axios
          .post(`${process.env.AUTH_SERVER_URL}/get-access`, {
            token: req.cookies.token
          })
          .then(async (access) => {
            var acc = await Users.find({ username: decoded.data.username, userId: decoded.data.userId })
            console.log(acc)
            res.send({
              username: acc[0].username,
              email: acc[0].email,
              userId: acc[0].userId,
              roles: acc[0].roles,
              access: access.data,
            });
          });
      });
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
          axios
            .post(`${process.env.AUTH_SERVER_URL}/get-refresh`, account[0])
            .then((refreshTokenRes) => {
              // get access
              axios
                .post(`${process.env.AUTH_SERVER_URL}/get-access`, { token: refreshTokenRes.data })
                .then((accessTokenRes) => {
                  console.log(refreshTokenRes.data);
                  console.log(account[0]);
                  //Users.find({username: account[0].username, userId: account[0].userId}).update({ $set: { sessionToken: refreshTokenRes.data }}).exec()
                  let acc = Users.findOneAndUpdate(
                    {
                      username: account[0].username,
                      userId: account[0].userId,
                    },
                    { $set: { sessionToken: refreshTokenRes.data } },
                    { new: true }
                  ).exec();
                  res.cookie("token", refreshTokenRes.data, { httpOnly: true });
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
      Users.find({ username: decoded.username, userId: decoded.userId })
        .updateOne({ $set: { sessionToken: "" } })
        .exec();
      console.log("Removed Session Token from User Account");
    })
    .catch((err) => console.log(err));
});

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
