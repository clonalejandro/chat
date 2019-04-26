module.exports = class ChatOrm {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(App){
		this.App = App;
		this.con = App.MysqlManager.con;
		this.props = {
			prefix: "CHAT-ORM",
			table: "CHATS"
		};
	}
	
	
	/** REST **/
	
	/**
	 * This function create a chat in database
	 * @param data {Object} data is the name of chat and userId associated
	 */
	create(data){
		this.con.query(`INSERT INTO ${props.table} VALUES (NULL, "${data.name}", ${data.userId})`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Creating chat with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function update a chat name in database
	 * @param data {Object} data is the id of chat and the newname of the chat
	 */
	updateById(data){
		this.con.query(`UPDATE ${props.table} SET name="${data.newname}" WHERE id=${data.id}`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Updating chat with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function update a chat name in database
	 * @param data {Object} data is the name of chat and the newname of the chat
	 */
	updateByName(data){
		this.con.query(`UPDATE ${props.table} SET name="${data.newname}" WHERE name="${data.name}"`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Updating chat with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function delete a chat in database
	 * @param data {Object} data is the name of chat
	 */
	deleteByName(data){
		this.con.query(`DELETE FROM ${props.table} WHERE name="${data.name}"`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Deleting chat with: ${data}`, this.props.prefix)
		})
	}
	

	/**
	 * This function delete a chat in database
	 * @param data {Object} data is the id of chat
	 */
	deleteById(data){
		this.con.query(`DELETE FROM ${props.table} WHERE id=${data.id}`, (err, res) => {
			if (err) this.App.throwErr(err)
			else this.App.debug(`Deleting chat with: ${data}`, this.props.prefix)
		})
	}

	
}
