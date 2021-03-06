module.exports = class MessageOrm {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(App){
        this.App = App;
        this.con = () => App.MysqlManager.con;
        this.props = {
            prefix: "MESSAGE-ORM",
            table: `${this.App.config.mysql.database}.MESSAGES`
        };
    }
    
    
    /** REST **/
    
    /**
     * This function create a message in database
     * @param {Object} data data is text of the message, the chatName associated, the userId associated, and the date of the message
     * @param {*} callback
     */
    create(data, callback = undefined){
        const query = `INSERT INTO ${this.props.table} VALUES (uuid(), "${data.text}", "${data.chatName}", "${data.userId}", "${data.date}")`;
        
        if (this.App.isNull(callback)) this.con().query(query, (err, res) => {
            if (err) this.App.throwErr(err, this.props.prefix);
            else this.App.debug(`Creating message with: ${JSON.stringify(data)}`, this.props.prefix)
        });
        else this.con().query(query, callback)
    }
    
    
    /**
     * This function get all data for message
     * @param {Object} data data is the chatName of the chat associated to this message 
     * @param {*} callback 
     */
    getByChatName(data, callback){
        const query = `SELECT * FROM ${this.props.table} WHERE chatName="${data.chatName}" ORDER BY date ASC`;

        this.con().query(query, callback)
    }


    /**
     * This function get all data for message
     * @param {Object} data data is the username of the user associated to this message 
     * @param {*} callback 
     */
    getByUserName(data, callback){
        const query = `SELECT * FROM ${this.props.table} WHERE userId = (
            SELECT id FROM ${this.App.UserOrm.props.table} WHERE username="${data.username}"
        )`;

        this.con().query(query, callback)
    }


    /**
     * This function get all data for message
     * @param {Object} data data is the userId of the user associated to this message 
     * @param {*} callback 
     */
    getByUserId(data, callback){
        const query = `SELECT * FROM ${this.props} WHERE userId="${data.userId}"`;

        this.con().query(query, callback)
    }


    /**
     * This function delete a message in database
     * @param {Object} data data is the id of the message
     * @param {*} callback
     */
    deleteById(data, callback = undefined){
        const query = `DELETE FROM ${this.props.table} WHERE id="${data.id}"`;
        
        if (this.App.isNull(callback)) this.con().query(query, (err, res) => {
            if (err) this.App.throwErr(err, this.props.prefix);
            else this.App.debug(`Deleting message with: ${JSON.stringify(data)}`, this.props.prefix)
        });
        else this.con().query(query, callback)
    }
    
    
    /**
     * This function delete a message in database
     * @param {Object} data data is the chatName associated to the message
     * @param {*} callback
     */
    deleteByChatName(data, callback = undefined){
        const query = `DELETE FROM ${this.props.table} WHERE chatName="${data.chatName}"`;

        if (this.App.isNull(callback)) this.con().query(query, (err, res) => {
            if (err) this.App.throwErr(err, this.props.prefix);
            else this.App.debug(`Deleting message with: ${JSON.stringify(data)}`, this.props.prefix)
        });
        else this.con().query(query, callback)
    }


    /**
     * This function delete a message in database
     * @param {Object} data data is the chatId of the chat associated to the message
     * @param {*} callback 
     */
    deleteByChatId(data, callback = undefined){
        const query = `DELETE FROM ${this.props.table} WHERE chatName=(
            SELECT name FROM ${this.App.ChatOrm.props.table} WHERE id="${data.chatId}"
        )`;
        
        if (this.App.isNull(callback)) this.con().query(query, (err, res) => {
            if (err) this.App.throwErr(err, this.props.prefix);
            else this.App.debug(`Deleting message with: ${JSON.stringify(data)}`, this.props.prefix)
        });
        else this.con().query(query, callback)
    }


    /**
     * This function delete a message in database
     * @param {Object} data data is the username associated to message
     * @param {*} callback
     */
    deleteByUserName(data, callback = undefined){
        const query = `DELETE FROM ${this.props.table} WHERE userId=(
            SELECT id FROM ${this.App.UserOrm.props.table} WHERE username="${data.username}"
        )`;
        
        if (this.App.isNull(callback)) this.con().query(query, (err, res) => {
            if (err) this.App.throwErr(err,this.props.prefix);
            else this.App.debug(`Deleting message with: ${JSON.stringify(data)}`, this.props.prefix)
        });
        else this.con().query(query, callback)
    }
    
    
    /**
     * This function delete a message in database
     * @param {Object} data data is the userId associated to message
     * @param {*} callback
     */
    deleteByUserId(data, callback = undefined){
        const query = `DELETE FROM ${this.props.table} WHERE userId="${data.userId}"`;
        
        if (this.App.isNull(callback)) this.con().query(query, (err, res) => {
            if (err) this.App.throwErr(err, this.props.prefix);
            else this.App.debug(`Deleting message with: ${JSON.stringify(data)}`, this.props.prefix)
        });
        else this.con().query(query, callback)
    }
    
    
    /**
     * This function update a message in database
     * @param {Object} data data is the id of the message
     * @param {*} callback
     */
    updateById(data, callback = undefined){
        const query = `UPDATE ${this.props.table} SET text="${data.text}" WHERE id="${data.id}"`;
        
        if (this.App.isNull(callback)) this.con().query(query,(err, res) => {
            if (err) this.App.throwErr(err, this.props.prefix);
            else this.App.debug(`Updating message with: ${JSON.stringify(data)}`, this.props.prefix)
        });
        else this.con().query(query, callback)
    }
    
    
    /**
     * This function update a message in database 
     * @param {Object} data data is the username associated to the message
     * @param {*} callback
     */
    updateByUserName(data, callback = undefined){
        const query = `UPDATE ${this.props.table} SET text="${datat.text}" WHERE userId=(
            SELECT id FROM ${this.App.UserOrm.props.table} WHERE username="${data.username}"
        )`;
        
        if (this.App.isNull(callback)) this.con().query(query,(err, res) => {
            if (err) this.App.throwErr(err, this.props.prefix);
            else this.App.debug(`Updating message with: ${JSON.stringify(data)}`, this.props.prefix)
        });
        else this.con().query(query, callback)
    }
    
    
    /**
     * This function update a message in database 
     * @param {Object} data data is the userId associated to the message
     * @param {*} callback
     */
    updateByUserId(data, callback = undefined){
        const query = `UPDATE ${this.props.table} SET text="${data.text}" WHERE userId="${data.userId}"`;
        
        if (this.App.isNull(callback)) this.con().query(query,(err, res) => {
            if (err) this.App.throwErr(err, this.props.prefix);
            else this.App.debug(`Updating message with: ${JSON.stringify(data)}`, this.props.prefix)
        });
        else this.con().query(query, callback)
    }
}