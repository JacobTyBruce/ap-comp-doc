const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');
const fs = require('fs');

const app = express();
const staticFileMiddleware = express.static('../dist');
app.use(staticFileMiddleware);
app.use(history({
    index: '../dist/index.html'
}));
app.use(staticFileMiddleware);

app.get('/', (req, res) => {
    res.sendFile('../dist/index.html')
})

app.listen(8080, '127.0.0.1', () => {
    console.log('Listening on port 8080');
});