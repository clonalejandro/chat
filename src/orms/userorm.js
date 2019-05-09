module.exports = class UserOrm {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(App){
		this.App = App;
		this.con = App.MysqlManager.con;
		this.props = {
			prefix: "USER-ORM",
			table: `${this.App.config.mysql.database}.USERS`
		};
	}
	
	
	/** REST **/
	
	/**
	 * This function get all user data from database
	 * @param {Object} data is the id of the user
	 * @param {*} callback
	 */
	getByPk(data, callback){
		this.con.query(`SELECT * FROM ${this.props.table} WHERE id="${data.id}"`, callback)
	}
	
	
	/**
	 * This function get all user data from database
	 * @param {Object} data is the username of the user
	 * @param {*} callback
	 */
	getByUserName(data, callback){
		this.con.query(`SELECT * FROM ${this.props.table} WHERE username="${data.username}"`, callback)
	}


	/**
	 * This function create a user in database
	 * @param {Object} data is the name of the user and the password of the user
	 * @param {*} callback
	 */
	create(data, callback = undefined){
		const query = `INSERT INTO ${this.props.table} VALUES (uuid(), "${data.username}", "${data.password}", ${data.rank})`;
		
		if (this.App.isNull(callback)) this.con.query(query, (err, res) => {
				if (err) this.App.throwErr(err, this.props.prefix);
				else this.App.debug(`Creating user with: ${JSON.stringify(data)}`, this.props.prefix)
		});
		else this.con.query(query, callback)
	}
	
	
	/**
	 * This function deletes a user in database
	 * @param {Object} data is the id of the user
	 * @param {*} callback
	 */
	deleteById(data, callback = undefined){
		const query = `DELETE FROM ${this.props.table} WHERE id="${data.id}"`;
		
		if (this.App.isNull(callback)) this.con.query(query, (err, res) => {
			if (err) this.App.throwErr(err, this.props.prefix);
			else this.App.debug(`Deleting user with: ${JSON.stringify(data)}`, this.props.prefix)
		});
		else this.con.query(query, callback)
	}
	
	
	/**
	 * This function deletes a user in database
	 * @param {Object} data is the name of the user
	 * @param {*} callback
	 */
	deleteByName(data, callback = undefined){
		const query = `DELETE FROM ${this.props.table} WHERE username="${data.username}"`;
		
		if (this.App.isNull(callback)) this.con.query(query, (err, res) => {
			if (err) this.App.throwErr(err, this.props.prefix);
			else this.App.debug(`Deleting user with: ${JSON.stringify(data)}`, this.props.prefix)
		});
		else this.con.query(query, callback)
	}
	
	
	/**
	 * This function updates a user in database
	 * @param {Object} data is the id of the user and newname of the user
	 * @param {*} callback
	 */
	updateById(data, callback = undefined){
		const query = `UPDATE ${this.props.table} SET username="${data.newusername}" WHERE id="${data.id}"`;
		
		if (this.App.isNull(callback)) this.con.query(query, (err, res) => {
			if (err) this.App.throwErr(err, this.props.prefix);
			else this.App.debug(`Updating user with: ${JSON.stringify(data)}`, this.props.prefix)
		});
		else this.con.query(query, callback)
	}
	
	
	/**
	 * This function updates a user in database
	 * @param {Object} data is the name of the user and newname of the user
	 * @param {*} callback
	 */
	updateByName(data, callback = undefined){
		const query = `UPDATE ${this.props.table} SET username="${data.newusername}" WHERE username="${data.username}"`;
		
		if (this.App.isNull(callback)) this.con.query(query, (err, res) => {
			if (err) this.App.throwErr(err, this.props.prefix);
			else this.App.debug(`Updating user with: ${JSON.stringify(data)}`, this.props.prefix)
		});
		else this.con.query(query, callback)
	}
	
	
}