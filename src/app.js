﻿/** IMPORTS **/

const config  = require('../assets/data/config.json');
const express = require('express');
const flash   = require('connect-flash');
const Color   = require('./utils/color');

var SocketManager = require('./utils/socketmanager');
var MysqlManager  = require('./utils/mysqlmanager');
var Log 		  = require('./utils/log');
var Api 		  = require('./utils/api');
var Auth 		  = require('./utils/auth');
var ChatOrm 	  = require('./orms/chatorm');
var UserOrm 	  = require('./orms/userorm');
var MessageOrm	  = require('./orms/messageorm');


module.exports = class App {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(http, server, io){
        this.http = http;
        this.server = server;
		
        Log = new Log();
		
		App.config = config;
        App.MysqlManager = new MysqlManager(App, config);
        App.ChatOrm = new ChatOrm(App);
		App.UserOrm = new UserOrm(App);
		App.MessageOrm = new MessageOrm(App);
		
        App.io = io;
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

        return data;
    }


    /**
     * This function check if data is null
     * @param {*} data 
     * @return {boolean} isNull
     */
    static isNull(data){
        return data == null || data == undefined;
    }
	
	
    /**
     * This function debug data passed by parameter
     * @param {String || Object} data message to debug
	 * @param {String} type
     */
    static debug(data, type = "INFO"){
		const prefix = `[${type}]`;
        const prompt = " ⇒ ";
        
		data instanceof Object ? data = JSON.stringify(data) : data = data;

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
    static throwAlert(data){
        App.debug(data, "ALERT")
    }


    /**
     * This function throw custom errors
     * @param {*} err error
     */
    static throwErr(err){
        if(!App.isNull(err)) App.debug(err.message, "ERROR")
    }
	
	
    /**
     * This function configure proxy server
     * @param {*} rateLimit 
     */
    configureProxy(rateLimit){
        this.server.enable("trust proxy");

        const apiLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: "Too many requests created from this IP, please try again after an hour"
        })

        this.server.use('/api/', apiLimiter);
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

        passport.serializeUser((user, done) => done(null, user.id));
        passport.deserializeUser((id, done) => App.UserOrm.getByPk({id: id}, (err, rows) => done(err, rows[0])));
       
        Auth = new Auth(App, passport);
    }
	
	
	/**
     * This function prepare the node server
	 */
	prepareServer(){
		this.server.use(express.static('public'));
		this.http.listen(config.port, () => {
			App.debug("The server has been started!");
			App.debug(`The server is listening the port: ${config.port}`)
		});
	}
	
		
	/**
     * This function register all listeners for the sockets and eneable this
     */
	prepareSockets(){
		SocketManager = new SocketManager(App);
		SocketManager.registerListeners();		
	}

	
	/**
	 * This function prepare all api
	 */
	prepareApi(){
		Api = new Api(App, this.server)
	}
}
