/** IMPORTS **/

const mysql	 = require("mysql");


module.exports = class MysqlManager {
	
	
	/** CONSTRUCTORS **/

	constructor(App, config){
		this.App = App;
		this.prefix = "MYSQL";
		this.config = config;

		this.startConnection()
	}
	
	
	/**
	 * This function creates the mysql connection
	 */
	createConnection(){
		this.con = mysql.createConnection(this.config.mysql);
		this.registerErrorListener()//Register the listeners for the new connection
	}


	/**
	 * This function start the mysql connection
	 */
	startConnection(){
		this.createConnection();

		this.con.connect(err => {
			if (err){
				this.App.throwErr(err);
				return setTimeout(() => this.startConnection(), 2000)
			}
			else this.App.debug("Database connected!", this.prefix)
		})
	}
	
	
	/**
	 * This function register and handle the error listener
	 */
	registerErrorListener(){
		this.con.on('error', err => {			
			if (err.code == 'PROTOCOL_CONNECTION_LOST'){
				this.App.throwAlert("Database connection lost!, reconnecting...", this.prefix)
				return this.startConnection()
			}
			else {
				this.App.throwErr(err, this.prefix);
				throw err
			}
		})
	}
	
	
}
