/** IMPORTS **/

const express = require("express");
const server  = express();
const http    = require("http").Server(server);
const io      = require("socket.io")(http);
const App     = require("./app");
const manager = new App(http, server, io);


/** REST **/

manager.prepareServer();
manager.prepareSockets();
