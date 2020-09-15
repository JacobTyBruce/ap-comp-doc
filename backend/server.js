const express = require('express');
const mongoose = require('mongoose');

// schema for whatever youre doing
const userSchema = new mongoose.Schema({
    name: String,
    age: Number,
    favoriteColor: String,
})

// generate model
// model = collection !!!!!!!!!!!
const Person = mongoose.model('Person', userSchema)

// string to connect to mongodb, use .env for variables before uploading
const mongo = 'mongodb+srv://jake:JKee2k20@cluster0.gczfd.mongodb.net/users?retryWrites=true&w=majority'
// connect
mongoose.connect(mongo, {useNewUrlParser: true})
// reference connection
const db = mongoose.connection
// errors
db.on('error', console.error.bind(console, 'connection error:'));

const app = express();

app.get('/api/get/all', (req, res) => {
    Person.find().then(data => {res.send(data)});
})

app.get('/api/post/:id', (req, res) => {
    Person.create({name: 'Website Test', age: 42, favoriteColor: 'Still Blue'}, (err, doc) => {
        res.send(doc)
    })
})

app.get('/api/delete/:id', (req, res) => {
    Person.deleteOne({name: req.params.id}, (err, doc) => {
        if (err) {res.send(err);return};
        res.send(doc);
    })
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
});