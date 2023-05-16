const PORT = 8080;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require('body-parser');

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/sparql", (req, res) => {
    console.log('Got body:', req.body);

    const options = {
        method: "GET",
        url: req.body.endpoint + req.body.query,
    }

    axios
        .request(options)
        .then((response) => {
            console.log('Request processed successfully');
            res.json(response.data);
        })
        .catch((error) => {
            console.log('Request failed');
            res.json(error);
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});