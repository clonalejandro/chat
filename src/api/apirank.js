module.exports = class ApiRank {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(App, server){
        this.App = App;
        this.server = server;
        this.orm = this.App.RankOrm;
        this.prefix = "API-RANK";

        this.register();
    }
    
    
    /** REST **/
    
    /**
     * This function register all api rank routes
     */
    register(){
        this.isAdminRoute();
        this.isModRoute();
        this.isUserRoute();
        this.getRankRoute();
        
        this.App.debug("Register all apirank routes", this.prefix)
    }


    /**
     * This function prepare the route for check if user isAdmin via api
     * requeriments for the request: (username)
     */
    isAdminRoute(){
        this.server.get('/api/is-admin', (req, res) => {
            try {
                const bind = {
                    username: (!req.query.username ? req.user.username : req.query.username)
                };

                this.isAdmin(bind, isAdmin => res.status(200).send(isAdmin))
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


    /**
     * This function prepare the route for check if user isMod via api
     * requeriments for the request: (username)
     */
    isModRoute(){
        this.server.get('/api/is-mod', (req, res) => {
            try {
                const bind = {
                    username: (!req.query.username ? req.user.username : req.query.username)
                };

                this.isMod(bind, isMod => res.status(200).send(isMod))
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


    /**
     * This function prepare the route for check if user isMod via api
     * requeriments for the request: (username)
     */
    isUserRoute(){
        this.server.get('/api/is-user', (req, res) => {
            try {
                const bind = {
                    username: (!req.query.username ? req.user.username : req.query.username)
                };

                this.isUser(bind, isUser => res.status(200).send(isUser))
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


    /**
     * This function prepare the route for get the user rank via api
     * requeriments for the request: (username)
     */
    getRankRoute(){
        this.server.get('/api/get-rank', (req, res) => {
            try {
                const bind = {
                    username: (!req.query.username ? req.user.username : req.query.username)
                };

                this.orm.getByUserName(bind, (err, rows) => {
                    if (err) this.App.throwErr(err, this.prefix, res);
                    else res.status(200).send(rows[0].name)
                })
            } 
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


    /**
     * This function check if user is admin
     * @param {Object} data of user is (id || username)
     * @param {*} callback (isAdmin boolean)
     */
    isAdmin(data, callback){
        function checkIsAdmin(err, rows){
            if (err){
                this.App.throwErr(err);
                return
            }
            callback(rows[0].id == 2)
        }
        
        if (!this.App.isNull(data.username)) this.orm.getByUserName({
            username: data.username
        }, checkIsAdmin);
        else if (!this.App.isNull(data.id)) this.orm.getByUserId({
            userId: data.id
        }, checkIsAdmin)
    }
    
    
    /**
     * This function check if user is admin
     * @param {Object} data of user is (id || username)
     * @param {*} callback (isMod boolean)
     */
    isMod(data, callback){
        function checkIsAdmin(err, rows){
            if (err){
                this.App.throwErr(err);
                return
            }
            callback(rows[0].id == 1)
        }
        
        if (!this.App.isNull(data.username)) this.orm.getByUserName({
            username: data.username
        }, checkIsAdmin);
        else if (!this.App.isNull(data.id)) this.orm.getByUserId({
            userId: data.id
        }, checkIsAdmin)
    }
    
    
    /**
     * This function check if user is admin
     * @param {Object} data of user is (id || username)
     * @param {*} callback (isUser boolean)
     */
    isUser(data, callback){
        function checkIsAdmin(err, rows){
            if (err){
                this.App.throwErr(err);
                return
            }
            callback(rows[0].id == 0)
        }
        
        if (!this.App.isNull(data.username)) this.orm.getByUserName({
            username: data.username
        }, checkIsAdmin);
        else if (!this.App.isNull(data.id)) this.orm.getByUserId({
            userId: data.id
        }, checkIsAdmin)
    }
    
    
}