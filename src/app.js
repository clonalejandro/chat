/** IMPORTS **/

const config  = require("../assets/data/config.json");
const express = require("express");
const Color   = require("./utils/color");

var SocketManager = require("./utils/socketmanager");
var MysqlManager = require("./utils/mysqlmanager");
var Log = require("./utils/log");


module.exports = class App {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(http, server, io){
		this.http = http;
		this.server = server;
		
		Log = new Log();
		MysqlManager = new MysqlManager(App, config);
	
		App.MysqlManager = MysqlManager;
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
     * This function debug data passed by parameter
     * @param {*} data message
     */
    static debug(data, type = "NORMAL"){
        data instanceof Object ? data = JSON.stringify(data) : data = data;
        const prefix = "[" + type + "]";
        const prompt = " ⇒ ";

        Log.write(prefix + prompt + data + "\n");

	if (!config.debug) return;

        if (prefix.includes("ERROR")) console.log(Color.FgRed + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else if (prefix.includes("ALERT")) console.log(Color.FgYellow + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else if (prefix.includes("TEST")) console.log(Color.FgCyan + prefix + Color.FgMagenta + prompt + Color.Reset + data);
        else console.log(Color.FgBlue + prefix + Color.FgMagenta + prompt + Color.Reset + data);
    }


    /**
     * This function throw custom alerts
     * @param {*} data alert 
     */
    static throwAlert(data){
        data instanceof Object ? data = JSON.stringify(data) : data = data;
        App.debug(data, "ALERT");
    }


    /**
     * This function throw custom errors
     * @param {*} err error
     */
    static throwErr(err){
        if(!App.isNull(err)) App.debug(err.message, "ERROR");
    }
	

	/**
     * This function prepare the node server
	 */
	prepareServer(){
		this.server.use(express.static('public'));
		this.http.listen(config.port, () => {
			App.debug("The server has been started!");
			App.debug(`The server is listening the port: ${config.port}`);
		})
	}
	
		
	/**
     * This function register all listeners for the sockets and eneable this
     */
	prepareSockets(){
		SocketManager = new SocketManager(App);
		SocketManager.registerListeners();		
	}


}
