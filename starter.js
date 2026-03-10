const fs = require('fs');
const https = require('https');
const express = require('express');
const next = require('next');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

const ensureHttps = (req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.status(400).json({ error: 'Requests must be made over HTTPS' });
    }
  };

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  https.createServer(httpsOptions, server).listen(3443, (err) => {
    if (err) throw err;
    console.log('> HTTPS server ready on https://localhost:3443');
  });
});
