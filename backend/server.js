const express = require('express');
/*const history = require('connect-history-api-fallback');
const path = require('path');
const fs = require('fs');*/
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://jake:<JKee2k20>@cluster0.gczfd.mongodb.net/<sample_restaraunts>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("smaple_restaraunts").collection("restaraunts");
  // perform actions on the collection object
  console.log(collection);
  client.close();
});


const app = express();

app.get('/', (req, res) => {
    res.sendFile('../dist/index.html')
})

app.listen(8080, () => {
    console.log('Listening on port 8080');
});