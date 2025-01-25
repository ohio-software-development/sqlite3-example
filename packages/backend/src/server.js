const http = require('http');
const app = require('./app');

// Setup http server
const httpServer = http.createServer(app);
const port = 5000;

httpServer.listen(port, () => {
    console.log(`HTTP server listening: http://localhost:${port}`)
});