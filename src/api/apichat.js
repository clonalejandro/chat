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
                this.App.throwErr(err);
                res.status(500).send(err.message)
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
                res.status(200).send('Ok!');
            }
            catch (err){
                this.App.throwErr(err);
                res.status(500).send(err.message)
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
                this.App.throwErr(err);
                res.status(500).send(err.message)
            }
        })
    }


}
