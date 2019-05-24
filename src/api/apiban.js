module.exports = class ApiBan {


    /** SMALL CONSTRUCTORS **/

    constructor(App, server){
        this.App = App;
        this.server = server;
        this.orm = this.App.BanOrm;
        this.prefix = "API-BAN";

        this.register();
    }


    /** REST **/

    /**
     * This function register all api ban routes
     */
    register(){
        this.userIsBan();
        this.getAll();
        this.ban();
        this.unban();

        this.App.debug(`Registering all apiban routes`, this.prefix)
    }


    /**
     * This function check if user is banned from this chat
     * @param {Object} data is the userId associated to the ban 
     * @param {*} callback 
     */
    isBan(data, callback){
        this.App.BanOrm.getByPk(data, (err, rows) => {
            if (err) this.App.throwErr(err, this.prefix)
            else callback(rows.length > 0)
        })
    }


    /**
     * This function prepare the route for check if user is banned
     * requeriments for the request: (userId)
     */
    userIsBan(){
        this.server.get('/api/user-is-ban', (req, res) => {
            try {
                const bind = {
                    userId: req.query.userId
                };

                this.isBan(bind, isBan => res.send(isBan))
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }

    
    /**
     * This function prepare the route for get all users banned
     */
    getAll(){
        this.server.get('/api/get-users-banned', (req, res) => {
            try {
                this.App.BanOrm.getAll((err, rows) => {
                    if (err) this.App.throwErr(err, this.prefix, res);
                    else res.send(rows)
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


    /**
     * This function prepare the route for ban a users
     * requeriments for the request: (userId) and be admin
     */
    ban(){
        this.server.get('/api/ban-user', (req, res) => {
            try {
                const bind = {
                    userId: req.query.userId
                };

                this.App.Api.ApiRank.isAdmin(req.user, isAdmin => {
                    if (isAdmin) this.App.BanOrm.create(bind, (err, rows) => {
                        if (err) this.App.throwErr(err, this.prefix, res);
                        else res.status(200).send("Ok!")
                    });
                    else res.status(401).send("Forbbiden: you don't have permissions to do this")
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


    /**
     * This function prepare the route for unban a users
     * requeriments for the request: (userId) and be admin
     */
    unban(){
        this.server.get('/api/unban-user', (req, res) => {
            try {
                const bind = {
                    userId: req.query.userId
                };

                this.App.Api.ApiRank.isAdmin(req.user, isAdmin => {
                    if (isAdmin) this.App.BanOrm.delete(bind, (err, rows) => {
                        if (err) this.App.throwErr(err, this.prefix, res);
                        else res.status(200).send("Ok!")
                    });
                    else res.status(401).send("Forbbiden: you don't have permissions to do this")
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


}