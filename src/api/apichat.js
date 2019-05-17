/** FUNCTIONS **/

function userIsJoined(rows, bind){
    var result;

    rows.forEach(row => {
        result = (row.userId == bind.userId);
        if (result) return;
    })

    return result
}


module.exports = class ApiChat {

    
    /** SMALL CONSTRUCTORS **/

    constructor(App, server){
        this.App = App;
        this.server = server;
        this.prefix = "API-CHAT";
        
        this.register();
    }

    
    /** REST **/
    
    /**
     * This function register all apichat routes
     */
    register(){
        this.createChat();
        this.join();
        this.updateChat();
        this.deleteChat();
        
        this.App.debug("Register all apichat routes", this.prefix);
    }
    
    
    /**
     * This function prepare the route for create chat in the api
     * requeriments for the request: (name, userId)
     */
    createChat(){
        this.server.get('/api/create-chat', (req, res) => {
            try {
                const bind = {
                    name: req.query.name,
                    userId: req.user.id
                };
                
                this.App.ChatOrm.create(bind);
                res.status(200).send('Ok!')
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


    /**
     * This function prepare the route for join chat in the api
     * requeriments for the request: (name, userId)
     */
    join(){
        this.server.get('/api/join-chat', (req, res) => {
            try {
                const bind = {
                    name: req.query.name,
                    userId: req.user.id
                };

                this.App.ChatOrm.getByChatName(bind, (err, rows) => {
                    if (err) return this.App.throwErr(err, this.prefix, res);
                    
                    if (!rows.length) return this.App.throwErr({message: "This chat not exists"}, this.prefix, res);
                    
                    if (userIsJoined(rows, bind)) return res.status(200).send("You already joined to this chat!")
                    
                    this.App.ChatOrm.create(bind, (err, rows) => {
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
     * This function prepare the route for delete chat in the api
     * requeriments for the request: (id)
     */
    deleteChat(){
        this.server.post('/api/delete-chat', (req, res) => {
            try {
                const bind = {
                    id: req.body.id
                }
                
                if (!this.App.isNull(bind.id)) this.App.ChatOrm.deleteById({ id: bind.id });
                res.status(200).send('Ok!')
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }
    
    
    /**
     * This function prepare the route for update chat in the api
     * requeriments for the request: (id, newname)
     */
    updateChat(){
        this.server.post('/api/update-chat', (req, res) => {
            try {
                const bind = {
                    id: req.body.id,
                    newname: req.body.newname 
                }
                
                if (!this.App.isNull(bind.id)) this.App.updateById({ 
                    id: bind.id,
                    newname: bind.newname
                });
                
                res.status(200).send('Ok!')
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        })
    }


}
