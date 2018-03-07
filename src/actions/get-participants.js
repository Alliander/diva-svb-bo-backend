const config = require('./../config');
const axios = require('axios');
const Client = require('ssh2-sftp-client');
const StreamToPromise = require('stream-to-promise');
const _ = require('underscore');

function stripJwt(jwt) {
  return new Buffer(jwt.split('.')[1], 'base64').toString('ascii');
}

/**
 * Returns a promise that adds the validity of the participant's signature
 * to the specified participant object.
*/
const checkSignature = (participant) => {
  const url = `${config.irmaApiServerUrl}/api/v2/signature/checksignature`;
  const options = {
    headers: {
      Accept: 'text/plain',
      'Content-Type': 'application/json',
    },
  };

  return axios
    .post(url, stripJwt(participant.permission), options)
    .then(response => _.extend(participant, { valid: JSON.parse(stripJwt(response.data)).status === 'VALID' }));
};

function checkSftp() {
  const sftp = new Client();
  return sftp
    .connect({
      host: config.sftpHost,
      username: config.sftpUsername,
      password: config.sftpPassword,
    })
    .then(() => sftp.list(config.sftpPath))
    .then(files => files.map(file => sftp.get(`${config.sftpPath}/${file.name}`)))
    .then(filePromises => Promise.all(filePromises))
    .then(fileStreams => fileStreams.map(stream => new StreamToPromise(stream)))
    .then(readables => Promise.all(readables)) // 
    .then(files => files.map(file => JSON.parse(file.toString())));
}

module.exports = function requestHandler(req, res) {
  checkSftp()
    .then(participants => participants.map(participant => checkSignature(participant)))
    .then(validityRequests => Promise.all(validityRequests))
    .then((participants) => {
      res.setHeader('Content-type', 'application/json; charset=utf-8');
      res.json(participants);
    })
    .catch((err) => {
      console.warn(err);
    });
};
