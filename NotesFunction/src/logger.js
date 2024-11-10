const { Client } = require('@elastic/elasticsearch');
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');
const fs = require('fs');
const { printf} = winston.format;
const https = require('https');
const path = require('path');

// Elasticsearch configuration
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD
  },
  caFingerprint: process.env.CA_FINGERPRINT,
  tls: {
    ca: fs.readFileSync('./ca.crt'),
    rejectUnauthorized: false
  }
});

esClient.ping()
  .then(response => console.log("Elasticsearch is connected for notes function"))
  .catch(error => {
    console.error("Elasticsearch connection failed for notes function:", error);
    console.log("notes env var",process.env.NODE_EXTRA_CA_CERTS);
    const cert = fs.readFileSync(process.env.NODE_EXTRA_CA_CERTS, 'utf8');
    console.log('notes certificate', cert)
  })
  
// Create Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`)
  ),
  transports: [
    new ElasticsearchTransport({
      client: esClient,
      index: 'simplenote',
      level: 'info'
    }),
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" })
  ]
});

logger.on('error', (error) => {
  console.error('Elasticsearch logging error:', error);
});

logger.info('Test log message Notes Function');
module.exports = logger;