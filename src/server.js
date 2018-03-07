const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();
app.use(bodyParser.text()); // TODO: restrict to one endpoint
app.use(bodyParser.json()); // TODO: restrict to one endpoint

app.get('/api/get-participants', require('./actions/get-participants'));
app.get('/api/get-signature/:bsn', require('./actions/get-signature'));

const server = app.listen(config.port, () => {
  console.log(`Ketenpartner backend listening on port ${config.port}!`); // eslint-disable-line no-console
});

module.exports = { app, server };
