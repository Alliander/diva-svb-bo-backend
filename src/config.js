const config = {
  port: process.env.PORT ? process.env.PORT : 4000,
  baseUrl: process.env.BASE_URL ? process.env.BASE_URL : 'http://localhost:4000',
  irmaApiServerUrl: process.env.IRMA_API_SERVER_URL ? process.env.IRMA_API_SERVER_URL : 'https://demo.irmacard.org/tomcat/irma_api_server',
  sftpHost: process.env.SFTP_HOST,
  sftpUsername: process.env.SFTP_USERNAME,
  sftpPassword: process.env.SFTP_PASSWORD,
  sftpPath: process.env.SFTP_PATH,
};

module.exports = config;
