module.exports = class BanOrm {


    /** SMALL CONSTRUCTORS **/

    constructor(App){
        this.App = App;
        this.con = () => App.MysqlManager.con;
        this.props = {
            prefix: "BAN-ORM",
            table: `${this.App.config.mysql.database}.BANS`
        };
    }


    /** REST **/

    /**
     * This function get all bans data from database
     * @param {*} callback 
     */
    getAll(callback){
        const query = `SELECT * FROM ${this.props.table} 
            INNER JOIN ${this.App.UserOrm.props.table} 
            ON ${this.App.UserOrm.props.table}.id = ${this.props.table}.userId`;

        this.con().query(query, callback)
    }


    /**
     * This function get all ban data from the database
     * @param {Object} data is the userId associated to the ban
     * @param {*} callback 
     */
    getByPk(data, callback){
        this.con().query(`SELECT * FROM ${this.props.table} WHERE userId="${data.userId}"`, callback)
    }


    /**
     * This function get all ban data from the database
     * @param {Object} data is the username associated to the ban
     * @param {*} callback 
     */
    getByUserName(data, callback){
        const query = `SELECT * FROM ${this.props.table} WHERE userId=(
            SELECT id FROM ${this.App.UserOrm.props.table} WHERE username="${data.username}"
        )`;

        this.con().query(query, callback)
    }


    /**
     * This function creates a ban in the database
     * @param {Object} data is the userId associated to this ban 
     * @param {*} callback 
     */
    create(data, callback = undefined){
        const query = `INSERT INTO ${this.props.table} VALUES ("${data.userId}")`;

        if (this.App.isNull(callback)) this.con().query(query, (err, res) => {
            if (err) this.App.throwErr(err, this.props.prefix);
            else this.App.debug(`Creating a ban with: ${JSON.stringify(data)}`, this.props.prefix)
        });
        else this.con().query(query, callback)
    }


    /**
     * This function deletes a ban in the database
     * @param {Object} data is the userId associated to this ban
     * @param {*} callback 
     */
    delete(data, callback = undefined){
        const query = `DELETE FROM ${this.props.table} WHERE userId="${data.userId}"`;

        if (this.App.isNull(callback)) this.con().query(query, (err, res) => {
            if (err) this.App.throwErr(err, this.props.prefix);
            else this.App.debug(`Deleting a ban with: ${JSON.stringify(data)}`, this.props)
        });
        else this.con().query(query, callback)
    }
}