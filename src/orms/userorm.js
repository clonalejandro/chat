module.exports = class UserOrm {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(App){
		this.App = App;
		this.con = App.MysqlManager.con;
		this.props = {
			prefix: "USER-ORM",
			table: "USERS"
		};
	}
	
	
	/** REST **/
	
	/**
	 * This function create a user in database
	 * @param data {Object} data is the name of the user and the password of the user
	 */
	create(data){
		this.con.query(`INSERT INTO ${props.table} VALUES (NULL, "${data.username}", "${data.password}")`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Creating user with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function deletes a user in database
	 * @param data {Object} data is the id of the user
	 */
	deleteById(data){
		this.con.query(`DELETE FROM ${props.table} WHERE id=${data.id}`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Deleting user with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function deletes a user in database
	 * @param data {Object} data is the name of the user
	 */
	deleteByName(data){
		this.con.query(`DELETE FROM ${props.table} WHERE username="${data.username}"`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Deleting user with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function updates a user in database
	 * @param data {Object} data is the id of the user and newname of the user
	 */
	updateById(data){
		this.con.query(`UPDATE ${props.table} SET username="${data.newusername}" WHERE id=${data.id}`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Updating user with: ${data}`, this.props.prefix)
		})
	}
	
	
	/**
	 * This function updates a user in database
	 * @param data {Object} data is the name of the user and newname of the user
	 */
	updateByName(data){
		this.con.query(`UPDATE ${props.table} SET username="${data.newusername}" WHERE username="${data.username}"`, (err, res) => {
			if (err) this.App.throwErr(err);
			else this.App.debug(`Updating user with: ${data}`, this.props.prefix)
		})
	}
	
	
}