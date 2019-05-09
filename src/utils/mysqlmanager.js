/** IMPORTS **/

const mysql = require("mysql");


module.exports = class MysqlManager {
	
	
	/** CONSTRUCTORS **/

	constructor(App, config){
		this.con = mysql.createConnection(config.mysql);
		this.App = App;
		this.prefix = "MYSQL";

		this.startConnection();
		this.registerErrorListener();
	}
	
	
	/**
	 * This function start the mysql connection
	 */
	startConnection(){
		this.con.connect(err => {
			if (err){
				this.App.throwErr(err);
				return setTimeout(this.startConnection, 2000);
			}
			else this.App.debug("Database connected!", this.prefix)
		})
	}
	
	
	/**
	 * This function register and handle the error listener
	 */
	registerErrorListener(){
		this.con.on('error', err => {
			this.App.throwErr(err, `${this.prefix}-ERROR`);
			
			if (err.code == 'PROTOCOL_CONNECTION_LOST')
				return this.startConnection();
			else throw err
		})
	}
	
	
}
