module.exports = class ChatOrm {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(App){
		this.App = App;
		this.con = App.MysqlManager.con;
		this.props = {
			prefix: "CHAT-ORM",
			table: `${this.App.config.mysql.database}.CHATS`
		};
	}
	
	
	/** REST **/
	
	/**
	 * This function create a chat in database
	 * @param {Object} data is the name of chat and userId associated
	 * @param {*} callback
	 */
	create(data, callback = undefined){
		const query = `INSERT INTO ${this.props.table} VALUES (NULL, "${data.name}", ${data.userId})`;
		
		if (this.App.isNull(callback)) this.con.query(query, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Creating chat with: ${JSON.stringify(data)}`, this.props.prefix)
		});
		else this.con.query(query, callback)
	}
	
	
	/**
	 * This function update a chat name in database
	 * @param {Object} data is the id of chat and the newname of the chat
	 * @param {*} callback
	 */
	updateById(data, callback = undefined){
		const query = `UPDATE ${this.props.table} SET name="${data.newname}" WHERE id=${data.id}`;
		
		if (this.App.isNull(callback)) this.con.query(query, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Updating chat with: ${JSON.stringify(data)}`, this.props.prefix)
		});
		else this.con.query(query, callback)
	}
	
	
	/**
	 * This function update a chat name in database
	 * @param {Object} data is the name of chat and the newname of the chat
	 * @param {*} callback
	 */
	updateByName(data, callback = undefined){
		const query = `UPDATE ${this.props.table} SET name="${data.newname}" WHERE name="${data.name}"`;
		
		if (this.App.isNull(callback)) this.con.query(query, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Updating chat with: ${JSON.stringify(data)}`, this.props.prefix)
		});
		else this.con.query(query, callback)
	}
	
	
	/**
	 * This function delete a chat in database
	 * @param {Object} data is the name of chat
	 * @param {*} callback
	 */
	deleteByName(data, callback = undefined){
		const query = `DELETE FROM ${this.props.table} WHERE name="${data.name}"`;
		
		if (this.App.isNull(callback)) this.con.query(query, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Deleting chat with: ${JSON.stringify(data)}`, this.props.prefix)
		});
		else this.con.query(query, callback)
	}
	

	/**
	 * This function delete a chat in database
	 * @param {Object} data is the id of chat
	 * @param {*} callback
	 */
	deleteById(data, callback = undefined){
		const query = `DELETE FROM ${this.props.table} WHERE id=${data.id}`;
		
		if (this.App.isNull(callback)) this.con.query(query, (err, res) => {
			if (err) this.App.throwErr(err)
			else this.App.debug(`Deleting chat with: ${JSON.stringify(data)}`, this.props.prefix)
		});
		else this.con.query(query, callback)
	}

	
}
