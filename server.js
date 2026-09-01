const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function send(res, status, body, type) {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(ROOT, safePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // fallback to index.html for unknown paths (e.g. clean nav)
      fs.readFile(path.join(ROOT, 'index.html'), (err2, data2) => {
        if (err2) return send(res, 404, 'Not found', 'text/plain');
        send(res, 200, data2, TYPES['.html']);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, data, TYPES[ext] || 'application/octet-stream');
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('listening on ' + PORT);
});
