const express = require('express');


const projectRouter = require('../routers/projectRouter.js');
const actionRouter = require('../routers/actionRouter.js');

const server = express();

server.use(express.json());

server.use('/api/projects', projectRouter);
server.use('/api/actions', actionRouter);


server.get('/', (req, res) => {
    res.send('<h1>Your server is up and running</h1>');
});

module.exports = server;