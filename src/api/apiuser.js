/** IMPORTS **/

const bCrypt = require("bcrypt-nodejs");


module.exports = class ApiUser {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(App, server){
        this.App = App;
        this.server = server;
        this.prefix = "API-USERS";
        
        this.register();
    }
    
    
    /** REST **/
    
    /**
     * This function register all apiuser routes
     */
    register(){
        this.getUserName();
        this.getUserChats();
        this.deleteUser();
        this.updateUser();
        this.updatePassword();
        
        this.App.debug("Register all apiuser routes", this.prefix)
    }
    
    
    /**
     * This function get username from user
     * requeriments for request: (id)
     */
    getUserName(){
        this.server.get('/api/get-username', (req, res) => {
            try {
                const bind = {
                    id: this.App.deserializeSalt(req.query.id)
                };

                this.App.UserOrm.getByPk(bind, (err, rows) => {
                    if (err) return this.App.throwErr(err, this.prefix, res);
                    if (!rows.length) return this.App.throwErr({message: "User not found!"}, this.prefix, res);
                    else res.send(rows[0].username)
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix);
                res.status(500).send(err.message)
            }
        })
    }


    /**
     * This function get chats from user
     * requeriments for the request: (id)
     */
    getUserChats(){
        this.server.get('/api/get-user-chats', (req, res) => {
            try {
                const bind = {
                    userId: req.user.id
                };
                
                this.App.ChatOrm.getByUserId(bind, (err, rows) => {
                    if (err) throw err;
                    else res.send(rows)
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix);
                res.status(500).send(err.message)
            }
        })
    }
    
    
    /**
     * This function prepare the route for delete chat in the api
     * requeriments for the request: (id)
     */
    deleteUser(){
        this.server.get('/api/delete-user', (req, res) => {
            try {
                const bind = {
                    id: req.user.id
                };
                
                res.redirect('/logout');

                setTimeout(() => this.App.UserOrm.deleteById({ id: bind.id }), 250)
            }
            catch (err){
                this.App.throwErr(err, this.prefix);
                res.status(500).send(err.message)
            }
        })
    }
    
    
    /**
     * This function prepare the route for update user in the api
     * requeriments for the request: (id, password, newusername)
     */
    updateUser(){
        this.server.get('/api/update-user', (req, res) => {
            try {
                const bind = {
                    id: req.user.id,
                    password: req.query.password,
                    newusername: req.query.newusername
                };
 
                this.App.UserOrm.getByPk(bind, (err, rows) => {
                    if (err) this.App.throwErr(err, this.prefix, res);
                    else if (!this.isValidPassword(rows[0], bind.password)) this.App.throwErr({message: "Wrong password!"}, this.prefix, res);
                    else this.App.UserOrm.getByUserName({username: bind.newusername}, (err, rows) => {
                        if (err) this.App.throwErr(err, this.prefix, res);
                        else if (rows.length) this.App.throwErr({message: "This username is already in use"}, this.prefix, res);
                        else {
                            res.redirect('/');
                            setTimeout(() => this.App.UserOrm.updateById(bind, (err, rows) => {
                                if (err) this.App.throwErr(err, this.prefix, res)
                            }), 250)
                        }
                    })
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }
    
    
    /**
     * This function update the password via api
     * requirements for the request (id, newpassword, currentpassword)
     */
    updatePassword(){
        this.server.get('/api/update-password', (req, res) => {
            try {
                const bind = {
                    id: req.user.id,
                    newpassword: this.createHash(req.query.newpassword),
                    currentpassword: req.query.currentpassword
                };

                this.App.UserOrm.getByPk(bind, (err, rows) => {
                    if (err) this.App.throwErr(err, this.prefix, res);
                    else if (!this.isValidPassword(rows[0], bind.currentpassword)) this.App.throwErr({message: "Wrong password!"}, this.prefix, res);
                    else this.App.UserOrm.updatePassword(bind, (err, rows) => {
                        if (err) this.App.throwErr(err, this.prefix, res);
                        else res.status(200).send("Ok!")
                    })
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


    /**
     * This function encrypt the password passed by parameter
     * @param {String} password 
     * @return {String} passwordHashed
     */
    createHash(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
    }


    /**
     * This function check if user & password is correct
     * @param {String} row 
     * @param {String} password 
     * @return {Boolean} isValid
     */
    isValidPassword(row, password){
        return bCrypt.compareSync(password, row.password)
    }
}