﻿/** IMPORTS **/

const config	  = require('../assets/data/config.json');
const express	  = require('express');
const compress 	  = require('compression');
const flash		  = require('connect-flash');
const crypto      = require("crypto")
const Color		  = require('./utils/color');
const TaskTimer	  = require('./utils/tasktimer');
const Math		  = require('./utils/math');

var SocketManager = require('./utils/socketmanager');
var MysqlManager  = require('./utils/mysqlmanager');
var Log 		  = require('./utils/log');
var Api 		  = require('./utils/api');
var Router		  = require('./utils/router');
var Auth 		  = require('./utils/auth');
var ChatOrm 	  = require('./orms/chatorm');
var UserOrm 	  = require('./orms/userorm');
var MessageOrm	  = require('./orms/messageorm');
var BanOrm        = require("./orms/banorm");
var RankOrm 	  = require('./orms/rankorm');


module.exports = class App {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(http, server, io){
        this.http = http;
        this.server = server;
        
        Log = new Log();
        
        App.onlineUsers = new Array();
        App.config = config;
        App.salt = "";
        App.MysqlManager = new MysqlManager(App, config);
        App.ChatOrm = new ChatOrm(App);
        App.UserOrm = new UserOrm(App);
        App.MessageOrm = new MessageOrm(App);
        App.BanOrm = new BanOrm(App);
        App.RankOrm = new RankOrm(App);
        App.tasks = new Array();
        
        App.io = io
    }

    
    /** REST **/
    
    /**
     * This function replace all
     * @param {String} data 
     * @param {String} charToReplace charToReplace
     * @param {String} newChar newChar 
     * @return {String} data 
     */
    static replaceAll(data, charToReplace, newChar = ""){
        if (App.isNull(data)) return data;
        
        typeof data != "string" ? data = data.toString() : data = data;

        while (data.includes(charToReplace))
            data = data.replace(charToReplace, newChar);

        return data
    }


    /**
     * This function check if data is null
     * @param {*} data 
     * @return {boolean} isNull
     */
    static isNull(data){
        return data == null || data == undefined
    }
    
    
    /**
     * This function resolve ip from request
     * @param {*} req 
     */
    static resolveIp(req){
        const ip = req.connection.remoteAddress;

        if (ip.includes("::ffff:")) return ip.replace("::ffff:", "")
        else return ip
    }


    /**
     * This function set user as online
     * @param {*} req 
     */
    static addOnlineUser(req){
        App.onlineUsers.push(req.user);
        App.io.sockets.emit('status', "changed!")
    }


    /**
     * This function set user as offline
     * @param {*} req 
     */
    static removeOnlineUser(req){
        App.onlineUsers.map((element, i) => {
            if (element.id == req.user.id) delete App.onlineUsers[i]
        });

        App.io.sockets.emit('status', "changed!")
    }


    /**
     * This function debug data passed by parameter
     * @param {String || Object} data message to debug
     * @param {String} type
     */
    static debug(data, type = "INFO"){
        const prefix = `[${type}]`;
        const prompt = " ⇒ ";
        
        data = (data instanceof Object ? JSON.stringify(data) : data);

        Log.write(`${prefix}${prompt}${data}\n`);

        if (!config.debug) return;

        if (prefix.includes("ERROR")) console.log(Color.FgRed + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else if (prefix.includes("ALERT")) console.log(Color.FgYellow + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else if (prefix.includes("TEST")) console.log(Color.FgCyan + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else console.log(Color.FgBlue + prefix + Color.FgMagenta + prompt + Color.Reset + data);
    }

    
    /**
     * This function throw custom test debug messages
     * @param {*} data test
     */
    static throwTest(data){
        App.debug(data, "TEST")
    }
    
    
    /**
     * This function throw custom alerts
     * @param {*} data alert 
     */
    static throwAlert(data, type = "ALERT"){
        App.debug(data, (type == "ALERT" ? type : `${type}!ERROR`))
    }


    /**
     * This function throw custom errors
     * @param {*} err error
     */
    static throwErr(err, type = "ERROR", res = undefined){
        if(!App.isNull(err)) App.debug(
            err.message, (type == "ERROR" ? type : `${type}!ERROR`)
        )
        
        if (!App.isNull(res)) res.status(500).send(err.message)
    }


    /**
     * This function serialize the salt
     * @param {String} word 
     * @param {Number} size 
     * @return {String} salt
     */
    static serializeSalt(word, size = 6){

        if (App.salt == "")//Check if salt is empty gen a new salt 
            App.generateSalt(size);
        
        return `${word}${App.salt}`
    }


    /**
     * This function generates a random salt
     * @param {Number} size 
     */
    static generateSalt(size){
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < size; i++) 
            App.salt = App.salt.concat(chars.charAt(Math.rand(0, chars.length)))
    }


    /**
     * This function deserialize the salt
     * @param {String} word 
     * @param {Number} size
     * @return {String} salt 
     */
    static deserializeSalt(word, size = 6){
        return word.slice(0, word.length - size)
    }


    /**
     * This function configure proxy server
     * @param {*} rateLimit 
     */
    configureProxy(rateLimit){
        this.server.enable("trust proxy");

        const apiLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 350, // limit each IP to 350 requests per windowMs
            message: "Too many requests created from this IP, please try again after an hour"
        })

        this.server.use('/api/', apiLimiter)
    }
    
    
    /**
     * This function configure the middlewares
     * @param {*} cookieParser cookieParser
     * @param {*} bodyParser bodyParser
     * @param {*} session session
     * @param {*} passport passport
     */
    configureServer(cookieParser, bodyParser, session, passport){
        this.server.use(cookieParser());
        this.server.use(bodyParser.json());
        this.server.use(bodyParser.urlencoded({extended: true}));
        this.server.use(flash());
        this.server.use(session(config.session));
        this.server.use(passport.initialize());
        this.server.use(passport.session());
        this.server.use(compress());

        passport.serializeUser((user, done) => done(null, user.username));
        passport.deserializeUser((username, done) => App.UserOrm.getByUserName({username: username}, (err, rows) => done(err, rows[0])));
       
        Auth = new Auth(App, passport)
    }
    
    
    /**
     * This function prepare the node server
     */
    prepareServer(){
        this.server.use('/assets', express.static(`${ __dirname}/../public/assets/`, config.session.cookie));
        this.server.set('views', 'views');
        this.server.set('view engine', 'pug');
        
        this.http.listen(config.port, () => {
            App.debug("The server has been started!");
            App.debug(`The server is listening the port: ${config.port}`)
        })
    }
    
    
    /**
     * This function register all listeners for the sockets and eneable this
     */
    prepareSockets(){
        SocketManager = new SocketManager(App);
        SocketManager.registerListeners()	
    }

    
    /**
     * This function prepare all api
     */
    prepareApi(){
        Api = new Api(App, this.server);
        App.Api = Api;
    }
    
    
    /**
     * This function prepare main routes
     * @param {*} passport
     */
    prepareRoutes(passport){
        Router = new Router(App, this.server, passport);
        Router.render()
    }
    
    
    /**
     * This function start the task for the logRotate
     */
    startLogRotate(){
        new TaskTimer(App, 'Log rotate',  () => Log.logRotate(), Math.hoursToMilis(1))
    }
    

}