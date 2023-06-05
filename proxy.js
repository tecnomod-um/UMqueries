const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const bodyParser = require('body-parser');

require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dataFiles = {
    data_properties: "src/data/data_properties.json",
    object_properties: "src/data/object_properties.json",
    vars: "src/data/vars.json",
    nodes: "src/data/nodes.json"
};

const sendFileChunks = (res, file) => {
    const filePath = path.join(__dirname, file);
    const stream = fs.createReadStream(filePath, {
        highWaterMark: Number(process.env.CHUNKSIZE)
    });

    stream.on("data", (chunk) => {
        if (file === "src/data/nodes.json") console.log("Sent a piece of node");
        res.write(chunk);
    });

    stream.on("end", () => {
        console.log(`${file} sent`);
        res.end();
    });

    stream.on("error", (error) => {
        console.error(error);
        res.sendStatus(500);
    });
};

app.get("/data/:file", (req, res) => {
    const file = dataFiles[req.params.file];

    if (file) {
        sendFileChunks(res, file);
    } else {
        res.sendStatus(404);
    }
});

app.post("/sparql", (req, res) => {
    console.log('Got sparql query:', req.body);

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

app.listen(process.env.BACKEND, () => {
    console.log(`Server is running on port ${process.env.BACKEND}`);
});
