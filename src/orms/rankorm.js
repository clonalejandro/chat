module.exports = class RankOrm {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(App){
		this.App = App;
		this.con = App.MysqlManager.con;
		this.props = {
			prefix: "RANK-ORM",
			table: `${this.App.config.mysql.database}.RANKS`
		};
	}
	
	
	/** REST **/
	
	/**
	 * This function get all rank data from database
	 * @param {Object} data is the id of the rank
	 * @param {*} callback
	 */
	getByPk(data, callback){
		this.con.query(`SELECT * FROM ${this.props.table} WHERE id=${data.id}`, callback)
	}
	
	
	/**
	 * This function get all rank data from database
	 * @param {Object} data is the name of the rank
	 * @param {*} callback
	 */
	getByRankName(data, callback){
		this.con.query(`SELECT * FROM ${this.props.table} WHERE name="${data.name}"`, callback)
	}
	
	
	/**
	 * This function get all rank data from database
	 * @param {Object} data is the id of the user associated to rank
	 * @param {*} callback
	 */
	getByUserId(data, callback){
		const usersTable = this.App.UserOrm.props.table;
		const query = `SELECT * FROM ${this.props.table} WHERE id=(
			SELECT rankId FROM ${usersTable} WHERE id="${data.userId}"
		)`;
		
		this.con.query(query, callback)
	}
	
	
	/**
	 * This function get all rank data from database
	 * @param {Object} data is the username of the user associated to rank
	 * @param {*} callback
	 */
	getByUserName(data, callback){
		const usersTable = this.App.UserOrm.props.table;
		const query = `SELECT * FROM ${this.props.table} WHERE id=(
			SELECT rankId FROM ${usersTable} WHERE username="${data.username}"
		)`;
		
		this.con.query(query, callback)
	}
	
	
}