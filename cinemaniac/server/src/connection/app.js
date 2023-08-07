const express = require('express');
const cors = require('cors');
const routes = require('../routes/authenticationRoutes');
// const bodyParser = require('body-parser');

const app = express();
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', routes);

module.exports = app;

