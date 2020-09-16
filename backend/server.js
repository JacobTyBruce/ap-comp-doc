require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

// schemas for whatever youre doing
// for testing on other db
const testUserSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favoriteColor: String,
})
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
    dateCreated: Date
})
const usersSchema = new mongoose.Schema({
    username: String,
    password: String,
    userId: String
})


// generate model
// model = collection !!!!!!!!!!!
// When searching use below Class Variable to search ie. Use route param as this
// first param is uppercase singular
const Car = mongoose.model('TestUser', testUserSchema)
const Users = mongoose.model('User', usersSchema)
const Challenges = mongoose.model('Challenge', challengeSchema)
const Docs = mongoose.model('Doc', docSchema)

// string to connect to mongodb, use .env for variables before uploading
const mongo = `mongodb+srv://${dbUser}:${dbPass}@cluster0.gczfd.mongodb.net/${dbName}?retryWrites=true&w=majority`
// connect
mongoose.connect(mongo, {useNewUrlParser: true})
// reference connection
const db = mongoose.connection
// errors
db.on('error', console.error.bind(console, 'connection error:'));

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
        collection.create(req.body).then(data => {res.send(data)});
    }
})

app.delete('/api/delete/:id/', (req, res) => {
    console.log('Delete Request')
    let collection = getCollection(req.params.col);
    if (collection == 'None') {res.send("Cannot get Entries or Collection. Error: 404 \n Query: " + req.params.col)}
    else {
        collection.deleteOne(req.query).then(data => {res.send(data)});
    }
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
});