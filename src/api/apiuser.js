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
        
        this.App.debug("Register all apiuser routes", this.prefix);
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
     * requeriments for the request: (id , newusername)
     */
    updateUser(){
        this.server.get('/api/update-user', (req, res) => {
            try {
                const bind = {
                    id: req.user.id,
                    newusername: req.query.newusername
                };
                
                this.App.UserOrm.updateById({
                    id: bind.id,
                    newname: bind.newusername
                });

                res.status(200).send('Ok!')
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }
    
    
}