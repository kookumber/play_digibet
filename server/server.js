// Required libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http')
require('dotenv').config();

const PORT = process.env.PORT || process.env.API_PORT;

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors());

const server = http.createServer(app)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully')
        server.listen(PORT, () => {
            console.log(`Server listening on Port ${PORT}`)
        })
    }).catch((err) => {
        console.log('Connection to MongoDB failed!')
        console.log(err)
    })



