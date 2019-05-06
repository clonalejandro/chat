/** IMPORTS **/

const express 	   = require('express');
const rateLimit    = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');
const passport     = require('passport');
const server  	   = express();
const http    	   = require('http').Server(server);
const io      	   = require('socket.io')(http);
const App     	   = require('./app');
const manager 	   = new App(http, server, io);


/** REST **/

manager.startLogRotate();
manager.configureProxy(rateLimit);
manager.configureServer(cookieParser, bodyParser, session, passport);
manager.prepareServer();
manager.prepareSockets();
manager.prepareApi();
manager.prepareRoutes(passport);

