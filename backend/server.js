require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

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
    tags: Array
})
const challengeSchema = new mongoose.Schema({
    title: String,
    desc: String,
    challenge: String,
    text: String,
})
const usersSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    userId: String,
    roles: Array
})
const postSchema = new mongoose.Schema({
    title: String,
    text: String,
    postedBy: String,
    dateCreated: Date
})


// generate model
// model = collection !!!!!!!!!!!
// When searching use below Class Variable to search ie. Use route param as this
// first param is uppercase singular
const Users = mongoose.model('User', usersSchema)
const Challenges = mongoose.model('Challenge', challengeSchema)
const Docs = mongoose.model('Doc', docSchema)
const Posts = mongoose.model('Post', postSchema)

// string to connect to mongodb, use .env for variables before uploading
const mongo = `mongodb+srv://${dbUser}:${dbPass}@cluster0.gczfd.mongodb.net/${dbName}?retryWrites=true&w=majority`
// connect
mongoose.connect(mongo, {useNewUrlParser: true, useUnifiedTopology: true })
// reference connection
const db = mongoose.connection
// errors
db.on('error', console.error.bind(console, 'connection error:'));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())

// mapping function for URL and collection
function getCollection(urlReq) {
    let param;
    switch(urlReq) {
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
            param = 'None'
    }
    return param
}

app.get('/api/get/:col/all', (req, res) => {
    let collection = getCollection(req.params.col);
    if (collection == 'None') {res.send("Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col)}
    else {
        collection.find().then(data => {res.send(data)});
    }
})

app.get('/api/get/:col/', (req, res) => {
    let collection = getCollection(req.params.col);
    let urlQuery = req.query;
    if (collection == 'None') {res.send("Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col)}
    else {
        collection.find(urlQuery).then(data => {res.send(data)});
    }
})

app.post('/api/post/:col', (req, res) => {
    let collection = getCollection(req.params.col);
    if (collection == 'None') {res.send("Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col)}
    else {
        if (collection == Posts) {
            req.body.dateCreated = new Date().toJSON();
        }
        collection.create(req.body).then(data => {res.send(data)});
    }
})

app.delete('/api/delete/:col', (req, res) => {
    let collection = getCollection(req.params.col);
    if (collection == 'None') {res.send("Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col)}
    else {
        collection.deleteOne(req.body).then(data => {res.send(data)});
    }
})

app.get('/api/login', (req,res) => {
    console.log('Login recieved')
    console.log(req.headers.authorization)
    res.send('Verified')
})

app.listen(8081, () => {
    console.log('Listening on port 8081');
});