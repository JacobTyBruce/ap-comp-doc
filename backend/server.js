require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const url = require('url');
const qs = require('querystring')

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

// schemas for whatever youre doing
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favoriteColor: String,
})
const challengeSchema = new mongoose.Schema({
    title: String,
    desc: String,
    dateCreated: Date
})

// generate model
// model = collection !!!!!!!!!!!
// When searching use below Class Variable to search ie. Use route param as this
// first param is uppercase singular
const Car = mongoose.model('Car', userSchema)

// string to connect to mongodb, use .env for variables before uploading
const mongo = `mongodb+srv://${dbUser}:${dbPass}@cluster0.gczfd.mongodb.net/${dbName}?retryWrites=true&w=majority`
// connect
mongoose.connect(mongo, {useNewUrlParser: true})
// reference connection
const db = mongoose.connection
// errors
db.on('error', console.error.bind(console, 'connection error:'));

const app = express();

app.get('/api/get/all', (req, res) => {
    Car.find().then(data => {res.send(data)});
})

// ADD PARAMS FOR DIFFERENT COLLECTIONS

app.get('/api/get/', (req, res) => {
    Car.find(req.query).then(data => {res.send(data)})
})

app.get('/api/post/:id', (req, res) => {
    Car.create({name: 'Website Test', age: 42, favoriteColor: 'Still Blue'}, (err, doc) => {
        res.send(doc)
    })
})

app.get('/api/delete/:id', (req, res) => {
    Car.deleteOne({name: req.params.id}, (err, doc) => {
        if (err) {res.send(err);return};
        res.send(doc);
    })
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
});