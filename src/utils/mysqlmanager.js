/** IMPORTS **/

const mysql = require("mysql");


module.exports = class MysqlManager {
	
	
	/** CONSTRUCTORS **/

	constructor(App, config){
		this.con = mysql.createConnection(config.mysql);
		this.App = App;
		this.prefix = "MYSQL";

		this.con.connect(err => {
			if (err) throw err;
			/*
			this.con.query(`USE ${config.db}`, (err, res) => {
				if (err) this.App.throwErr(err);
				this.App.debug(`Using database: ${config.db}`, this.prefix)	
			})*/
		});

		this.App.debug("Database connected!", this.prefix)
	}
	
	
}
