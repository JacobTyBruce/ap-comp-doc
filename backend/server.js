require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

// schemas for whatever youre doing
const docSchema = new mongoose.Schema({
  title: String,
  desc: String,
  text: String,
  ref: Object,
  dateUpdated: Date,
  tags: Array,
  posted: Boolean
});
const challengeSchema = new mongoose.Schema({
  title: String,
  desc: String,
  challenge: String,
  text: String,
  updated: Date,
  posted: Boolean
});
const usersSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  userId: String,
  roles: Array,
});
const postSchema = new mongoose.Schema({
  title: String,
  text: String,
  postedBy: String,
  dateCreated: Date,
  posted: Boolean
});

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

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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
    collection.find().then((data) => {
      res.send(data);
    });
  }
});

app.get("/api/get/:col/", (req, res) => {
  let collection = getCollection(req.params.col);
  let urlQuery = req.query;
  if (collection == "None") {
    res.send(
      "Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col
    );
  } else {
    collection.find(urlQuery).then((data) => {
      res.send(data);
    });
  }
});

app.post("/api/post/:col", (req, res) => {
    console.log('post request')
  let collection = getCollection(req.params.col);
  if (collection == "None") {
    res.send(
      "Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col
    );
  } else {
    // redundent as front end does this 
    /*
    if (collection == Posts) {
      req.body.dateCreated = new Date().toJSON();
    }
    */
   console.log(collection);
    collection.create(req.body).then((data) => {
      res.send(data);
    });
  }
});

app.delete("/api/delete/:col", (req, res) => {
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

app.get("/api/login", (req, res) => {
  console.log("Login recieved");
  var auth = Buffer.from(
    req.headers.authorization.split(" ")[1],
    "base64"
  ).toString();
  var username = auth.substring(0, auth.indexOf(":"));
  var password = auth.substring(auth.indexOf(":") + 1, auth.length);
  Users.find({ username: username }).then((data) => {
    bcrypt.compare(password, data[0].password).then((result) => {
      if (result === true) {
        res.send({
          username: data[0].username,
          email: data[0].email,
          userId: data[0].userId,
          roles: data[0].roles,
        });
      }
      if (result === false) {
        res.send(false);
      }
    });
  });
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
