const PORT = 8080;
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require('body-parser');

require("dotenv").config();

const app = express();
const path = require('path');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/data/data_properties', express.static(path.join(__dirname, 'src/data/data_properties.json')));
app.use('/data/nodes', express.static(path.join(__dirname, 'src/data/nodes.json')));
app.use('/data/object_properties', express.static(path.join(__dirname, 'src/data/object_properties.json')));
app.use('/data/vars', express.static(path.join(__dirname, 'src/data/vars.json')));

app.post("/sparql", (req, res) => {
    console.log('Got body:', req.body);

    const options = {
        method: "POST",
        url: req.body.endpoint,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        },
        data: {
            query: req.body.query
        }
    };

    axios
        .request(options)
        .then((response) => {
            console.log('Request processed successfully');
            console.log(response.data);
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
