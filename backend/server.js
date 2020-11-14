require("dotenv").config();
const fs = require('fs');
const https = require('https');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

var key = fs.readFileSync(__dirname + process.env.KEY_PATH);
var cert = fs.readFileSync(__dirname + process.env.CERT_PATH);
var options = {
  key: key,
  cert: cert
}

// schemas for whatever youre doing
const commentSchema = new mongoose.Schema(
  {
    postedBy: String,
    text: String
  },
  { timestamps: true }
)
const docSchema = new mongoose.Schema(
  {
    title: String,
    desc: String,
    text: String,
    // implement later ref: Object,
    tags: Array,
    posted: Boolean,
    comments: [commentSchema]
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
    comments: [commentSchema]
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: String,
    text: String,
    postedBy: String,
    posted: Boolean,
    comments: [commentSchema]
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
    sessionToken: Array,
    resetToken: String
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
//const Comment = mongoose.model("Comment", commentSchema)
// string to connect to mongodb, use .env for variables before uploading
const mongo = `mongodb+srv://${dbUser}:${dbPass}@cluster0.gczfd.mongodb.net/${dbName}?retryWrites=true&w=majority`;
// connect
mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// reference connection
const db = mongoose.connection;
// errors
db.on("error", console.error.bind(console, "connection error:"));

// token verification middleware
// add role check support
function verifyToken(role) {
  return function (req, res, next) {

    // get access token from header
    // if an error throws here its because no auth was sent in request
    try {
      var accessToken = req.headers.authorization.split(" ")[1]
      console.log(accessToken)
    } catch (error) {
      console.log('No or wrong Auth provided')
      console.log('Auth Provided: '+ req.headers.authorization)
      res.status(400).send('No Auth Provided')
      console.log(error)
      return;
    }
    
    // checks if token is actually present and not Null -- prevents jwt malformed error
    console.log(accessToken, typeof accessToken)
    if (accessToken == 'null') {
      console.log('Token was null')
      res.status(401).send('No Token Sent Or Was Of Value "null"')
      return;
    }
    // check if access is good -- time exp and formation
    jwt.verify(accessToken, process.env.AUTH_SERVER_SECRET, async (err, accessResDecoded) => {
      if (!err) {console.log(accessResDecoded)}
      if (err) {console.log(err)}
      // if access is good, this fires
      if (!err) {
        console.log('Access Is Good')
        // get acc info
        try {
          console.log('Getting Account')
          var account = await Users.find({
            roles: accessResDecoded.roles,
            userId: accessResDecoded.userId
          })
          console.log(account[0])
        } catch (error) {
          console.log('Error Getting Account')
          console.log(error)
        }
        // checks if special privilledge is needed
        if (role) {
          // checks if user has role if needed
          console.log('Role Needed')
          if (accessResDecoded.roles.includes(role)) {
            try {
              let newRefresh = await axios.post(`${process.env.AUTH_SERVER_URL}/get-refresh`, account[0])
              console.log(newRefresh.data)
              res.cookie('token', newRefresh.data)
            } catch (error) {
              console.log('Error getting new refresh')
            }
            next()
          } else {
            // fires if not auth'ed for route
            console.log('Not Auth')
            res.status(401).send('Not Authorized For This Route')
          }
        } else {
          // fires if no special perms needed
          console.log('No role needed')
          try {
            let newRefresh = await axios.post(`${process.env.AUTH_SERVER_URL}/get-refresh`, account[0])
            console.log(newRefresh.data)
            res.cookie('token', newRefresh.data)
          } catch (error) {
            console.log('Error getting new refresh')
          }
          next()
        }
      } else {
        // if access is bad/expired, this fires
        // check if cookie (refresh) exists
        console.log('Access Bad') 
        if (Object.prototype.hasOwnProperty.call(req.cookies, "token")) {
          // if so, get new access
          console.log('Getting new Access')
          console.log('Refresh Token: ' + req.cookies.token)
          // get new acess
          try {
            var newAccess = await axios.post(`${process.env.AUTH_SERVER_URL}/get-access`, { token: req.cookies.token })
          } catch (error) {
            if (error.contains('Invalid Refresh')) {
              console.log('Invalid Refresh')
            } else {
              console.log('Error')
            }
            res.clearCookie('token')
            console.log('Cookie Cleared')
            res.status(400).send('Bad Tokens')
            console.log('Erro Msg: ')
            console.log(error)
            return;
          }
          console.log('New Access: ' + newAccess.data)
          res.access = newAccess.data
          try {
            var accessDecoded = await axios.post(`${process.env.AUTH_SERVER_URL}/decode`, { token: newAccess.data })
            console.log(accessDecoded.data)
          } catch (error) {
            console.log("Couldn't decode token")
            console.log(error)
            res.status(500).send('Trouble Decoding Token')
          }
          try {
            console.log('Getting Account')
            var account = await Users.find({
              roles: accessDecoded.data.roles,
              userId: accessDecoded.data.userId
            })
            console.log(account[0])
          } catch (error) {
            console.log('Error Getting Account')
            console.log(error)
          }
          if (role) {
            if (accessDecoded.data.roles.includes(role)) {
              try {
                let newRefresh = await axios.post(`${process.env.AUTH_SERVER_URL}/get-refresh`, account[0])
                console.log(newRefresh.data)
                res.cookie('token', newRefresh.data)
              } catch (error) {
                console.log('Error getting new refresh')
              }
              next()
            } else {
              res.status(401).send('Not Authorized For This Route')
            }
          } else {
            try {
              let newRefresh = await axios.post(`${process.env.AUTH_SERVER_URL}/get-refresh`, account[0])
              console.log(newRefresh.data)
              res.cookie('token', newRefresh.data)
            } catch (error) {
              console.log('Error getting new refresh')
            }
            next()
          }
        } else {
          // if no cookies/refresh token is present, this fires
          res.send('Not authorized to use this resource, login to try again', 401)
        }
      }
    })
  }
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
    collection.find({}, { password: 0, sessionToken: 0, email: 0, resetToken: 0 }).sort({ 'updatedAt': -1 }).then(function (data) {
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
    collection.find(query, { password: 0, sessionToken: 0, email: 0, resetToken: 0 }).sort({ 'updatedAt': -1 }).then((data) => {
      res.send(data);
    });
  }
});

app.post("/api/post/:col", verifyToken('admin'), (req, res) => {
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
      console.log(res.access)
      if (res.access) {
        console.log('Sending Access Back')
        res.send({
          data: data,
          access: res.access
        })
      } else {
        res.send(data);
      }
    });
  }
});

app.post("/api/post-comment/:col", verifyToken('user'), async (req, res) => {
  console.log('Comment Recieved');
  console.log(req.params.col)
  console.log('Cehcking for new access, temp')
  console.log(res.access)
  let collection = getCollection(req.params.col);
  if (collection == "None") {
    res.send(
      "Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col
    );
  } else {
    try {
      // gets post
      const post = await collection.findById(req.body.post);
      post.comments.push(req.body.comment);
      const updated = await post.save()
      console.log(updated)
      res.status(201).send('Comment Created')
    } catch (error) {
      console.log(error);
      res.status(500).send('Error Creating Comment')
    }
  }
})

app.patch("/api/update/:col/", verifyToken('admin'), (req, res) => {
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
      console.log(req.body.query)
      console.log(req.body.replace)
      collection.findOneAndUpdate(
        req.body.query,
        req.body.replace,
        { 
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
         },
        (err, doc) => {
          if (err) { res.status(500).send(err) }
          else {
            console.log(res.access)
            console.log(doc)
            if (res.access) {
              console.log('Sending Access Back')
              res.send({
                data: doc,
                access: res.access
              })
            } else {
              res.send(doc);
            }
          }
        }
      );
    }
  }
});

app.delete("/api/delete/:col/:contentId", verifyToken('admin'), (req, res) => {
  console.log('Delete Request')
  let collection = getCollection(req.params.col);
  if (collection == "None") {
    res.send(
      "Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col
    );
  } else {
    collection.findByIdAndDelete(req.params.contentId).then((data) => {
      res.send(data);
      console.log(data)
    });
  }
});

app.get("/api/login", async (req, res) => {
  console.log("Login received");
  console.log(req.cookies);
  if (Object.prototype.hasOwnProperty.call(req.cookies, "token")) {
    console.log('Has Cookies')
    try {
      // gets access
      var access = await axios.post(`${process.env.AUTH_SERVER_URL}/get-access`, {
        token: req.cookies.token
      })
    } catch (accessError) {
      if (accessError.response.status == 401) {
        res.clearCookie('token')
        res.status(401).send('Token is bad or cannot find user. Please Try again')
        console.log('Cleared Cookie')
        return;
      } else {
        console.log('Problem Getting Access')
        console.log(accessError)
        res.status(500).send('Trouble Getting Access Token')
        return;
      }
    }
    console.log('New Access: ' + access.data)
    try {
      // decodes refresh token, which has user info
      var decoded = await axios.post(`${process.env.AUTH_SERVER_URL}/decode`, {
        token: req.cookies.token
      })
    } catch (refreshError) {
      console.log('Trouble Decoding Refresh')
      console.log(refreshError)
      res.status(500).send('Trouble Decoding Refresh')
      return;
    }
    console.log('Decoded')
    console.log(decoded.data)
    try {
      // finds user account in DB
      var acc = await Users.find({ username: decoded.data.username, userId: decoded.data.userId }, { password: 0 })
      console.log('Account and token good')
      console.log('Access, again: ' + access.data)
      acc[0].sessionToken = access.data;
      console.log(acc[0])
      // gets new refresh
      try {
        var newRefresh = await axios.post(`${process.env.AUTH_SERVER_URL}/get-refresh`, acc[0])
        res.cookie("token", newRefresh.data, { httpOnly: true });
      } catch (error) {
        console.log('Trouble Getting New Access')
        console.log(error)
        return;
      }
      res.status(200).send(acc)
    } catch (accError) {
      console.log('Error Getting Account')
      console.log(accError)
      res.status(500).send('Trouble Finding Account')
      return;
    }
  } else {
    // ----------------------------------------------------------- LOGIN REQUEST WITHOUT COOKIES ------------------------------------------------------------
    console.log('Does not have cookies')
    if (req.headers.hasOwnProperty('authorization')) {
      var auth = Buffer.from(req.headers.authorization.split(" ")[1], "base64").toString();
      console.log(auth)
    } else {
      res.status(400).send('No Auth Header, Bad Request')
      return;
    }
    var username = auth.substring(0, auth.indexOf(":"));
    var password = auth.substring(auth.indexOf(":") + 1, auth.length);
    try {
      // get user account based on username
      var account = await Users.find({ username: username }, { resetToken: 0 });
      console.log(account)
    } catch (accErr) {
      // error if trouble finding acc
      console.log('Trouble Finding Error, err: ')
      console.log(accErr)
      res.status(500).send('Trouble Finding Account in Database')
      return;
    }
    // check if any account was found
    if (account.length < 1) {
      console.log('No Account Was Found')
      res.status(400).send('No account found with those credentials!')
      return;
    }
    // compare passwords
    var result = await bcrypt.compare(password, account[0].password);
    console.log(result)
    if (result === true) {
      // this block fires if password is correct
      try {
        // gets refresh async, increased error handling
        var refresh = await axios.post(`${process.env.AUTH_SERVER_URL}/get-refresh`, account[0])
      } catch (refreshError) {
        // fires if problem getting refresh
        console.log('Error Getting Refresh');
        console.log(refreshError)
        return;
      }
      // set cookie
      res.cookie("token", refresh.data, { httpOnly: true });
      console.log('Set Refresh In Cookie')
      // get access
      try {
        var accessToken = await axios.post(`${process.env.AUTH_SERVER_URL}/get-access`, { token: refresh.data })
        console.log('Got Access')
        console.log(accessToken)
      } catch (accessError) {
        console.log('Error Getting Access')
        console.log(accessError)
        return;
      }
      res.status(200).send({
        username: account[0].username,
        email: account[0].email,
        userId: account[0].userId,
        roles: account[0].roles,
        access: accessToken.data,
      });
    } else {
      // fires if password is wrong
      console.log('Bad Password')
      res.status(401).send('Wrong Credentials')
      return;
    }
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
      Users.updateOne({ username: decoded.data.username, userId: decoded.data.userId }, { $pull: { sessionToken: req.cookies.token } })
        .exec();
      console.log("Removed Session Token from User Account");
    })
    .catch((err) => console.log(err));
});

app.post('/api/set-reset', async (req, res) => {
  var email = req.body.email
  console.log(email)
  try {
    // get reset token
    var resetToken = await axios.get(`${process.env.AUTH_SERVER_URL}/reset-token`)
    console.log('Got Reset Token')
    var resetCode = await axios.post(`${process.env.AUTH_SERVER_URL}/decode`, { token: resetToken.data })
    console.log(resetCode)
    // set reset token
    var test = await Users.updateOne({ email: email }, { resetToken: resetToken.data })
    console.log(test)
    console.log('Set Reset Token')
    // set nodemailer settings
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    // send email
    let info = await transporter.sendMail({
      from: 'Boo 👻 <jakobitheonly@gmail.com>', // sender address
      to: "jakobitheonly@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `<b>${resetCode.data.code}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.send('Sent and Updated')

  } catch (error) {
    console.log(error)
    res.send(500).send('Error Creating Reset Token')
  }
})

app.post('/api/check-reset', async (req, res) => {
  console.log('Checking Reset')
  // user submitted data
  var userCode = req.body.userCode
  var email = req.body.email
  // async ops
  try {
    // get user account from DB
    var user = await Users.findOne({ email: email })
    // get reset token from user acc in DB - xxx.xxx.xxx
    var resetToken = user.resetToken
    // get code - xxxxx -- decodes this /\ to this \/
    var resetCode = await axios.post(`${process.env.AUTH_SERVER_URL}/decode`, { token: resetToken })
    // check if valid
    if (userCode == resetCode.data.code) {
      // if valid, this fires, checks if token is expired
      axios.post(`${process.env.AUTH_SERVER_URL}/verify`, { token: resetToken })
      res.status(200).send('Code is correct and Valid')
    } else {
      res.status(401).send('Token is not valid')
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

app.post('/update-account', async (req, res) => {
  // checks if username or password -- can expanded in the future
  var type = req.body.type
  console.log(type)
  // gets user email from app, is configured so that it's correct email in app
  var email = req.body.email
  console.log(email)
  // new data to change
  var newData = req.body.newData
  console.log(newData)
  // checks if password, then hashes it
  if (type == 'password') {
    newData = bcrypt.hashSync(newData, 12);
  }
  console.log(newData)
  // updates user account -- in future, make all occurrences of posts and docs containing old username update to new one
  try {
    // updates data and removes code
    var update = await Users.updateOne({ email: email }, { [type]: newData, resetToken: "" })
    console.log(update)
    res.status(204).send('Account Updated!')
  } catch (err) {
    console.log(err)
    res.status(500).send('Error Updating Account')
  }
})

// ---------- Test route and port ----------------
app.get("/test", verifyToken('admin'), async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  })

  let info = await transporter.sendMail({
    from: `"Boo 👻" <${process.env.EMAIL_USER}>`, // sender address
    to: "jakobitheonly@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.send('Sent')
});

var server = https.createServer(options, app)

server.listen(8081, () => {
  console.log("Listening on port 8081");
});