const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

const { getRadiosParity, getData} = require('./data.js');

let data = {}

app.use(cors())

app.get('/radiosParity', (req, res) => {
    console.log("radiosParity");
    res.send(getRadiosParity(data));
    res.status(200);
});

app.get('/shows', (req, res) => {
    console.log("shows");
    let shows = [];
    for (let radio in data)
        for (let show in data[radio].shows)
            shows.push(show);
    res.send(shows);
    res.status(200);
});

app.get('/radioParity/:radio', (req, res) => {
    console.log("radioParity");
    res.send(getRadioParity(data, req.params.radio));
    res.status(200);
});

app.get('/showParity/:show', (req, res) => {
    console.log("showParity");
    res.send(geShowParity(data, req.params.show));
    res.status(200);
});

app.listen(port, async () => {
    data = await getData();
    console.log(`Listening on port ${port}`);
});