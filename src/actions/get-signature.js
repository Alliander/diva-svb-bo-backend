const config = require('./../config');
const Client = require('ssh2-sftp-client');
const StreamToPromise = require('stream-to-promise');

module.exports = function requestHandler(req, res) {
  const sftp = new Client();
  return sftp
    .connect({
      host: config.sftpHost,
      username: config.sftpUsername,
      password: config.sftpPassword,
    })
    .then(() => sftp.get(`${config.sftpPath}/${req.params.bsn}`))
    .then(stream => new StreamToPromise(stream))
    .then((file) => {
      res.setHeader('Content-type', 'application/octet-stream');
      res.send(JSON.parse(file.toString()).permission);
    })
    .catch((err) => {
      console.warn(err);
    });
};
