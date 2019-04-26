module.exports = class MessageOrm {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(App){
		this.App = App;
		this.con = App.MysqlManager.con;
		this.props = {
			prefix: "MESSAGE-ORM",
			table: "MESSAGES"
		};
	}
	
	
	/** REST **/
	
	/**
	 * This function create a message in database
	 * @param data {Object} data is text of the message, the chatName associated, the userId associated, and the date of the message
	 */
	create(data){
		this.con.query(`INSERT INTO ${props.table} VALUES (NULL, "${data.text}", "${data.chat}", ${data.userId}, "${data.date}"`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Creating message with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function delete a message in database
	 * @param data {Object} data is the id of the message
	 */
	deleteById(data){
		this.con.query(`DELETE FROM ${props.table} WHERE id=${data.id}`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Deleting message with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function delete a message in database
	 * @param data {Object} data is the username associated to message
	 */
	deleteByUserName(data){
		const query = `DELETE FROM $(props.table} WHERE userId=(
			SELECT id FROM ${this.App.UserOrm.props.table} WHERE username="${data.username}"
		)`;
		
		this.con.query(query, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Deleting message with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function delete a message in database
	 * @param data {Object} data is the userId associated to message
	 */
	deleteByUserId(data){
		this.con.query(`DELETE FROM $(props.table} WHERE userId=${data.userId}`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Deleting message with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function update a message in database
	 * @param data {Object} data is the id of the message
	 */
	updateById(data){
		this.con.query(`UPDATE ${props.table} SET text="${data.text}" WHERE id=${data.id}`,(err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Updating message with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function update a message in database 
	 * @param data {Object} data is the username associated to the message
	 */
	updateByUserName(data){
		const query = `UPDATE ${props.table} SET text="${datat.text}" WHERE userId=(
			SELECT id FROM ${this.App.UserOrm.props.table} WHERE username="${data.username}"
		)`;
		
		this.con.query(query,(err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Updating message with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function update a message in database 
	 * @param data {Object} data is the userId associated to the message
	 */
	updateByUserId(data){
		this.con.query(`UPDATE ${props.table} SET text="${data.text}" WHERE userId=${data.userId}`,(err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Updating message with: ${data}`, this.props.prefix)
		})
	}
	
	
}