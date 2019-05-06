/** IMPORTS **/

const mysql = require("mysql");


module.exports = class MysqlManager {
	
	
	/** CONSTRUCTORS **/

	constructor(App, config){
		this.con = mysql.createConnection(config.mysql);
		this.App = App;
		this.prefix = "MYSQL";

		this.con.connect(err => {
			if (err){
				this.App.throwErr(err);
				throw err
			}
		});

		this.App.debug("Database connected!", this.prefix)
	}
	
	
}
