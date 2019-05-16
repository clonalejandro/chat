module.exports = class ApiMessage {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(App, server){
        this.App = App;
        this.server = server;
        this.prefix = "API-MESSAGE";
        
        this.register();
    }
    
    
    /** REST **/
    
    /**
     * This function register all apimessages routes
     */
    register(){
        this.createMessage();
        this.getMessages();
        this.deleteMessage();
        this.updateMessage();
        
        this.App.debug("Register all apimessage routes", this.prefix)
    }
    
    
    /**
     * This function prepare the route for create message in the api
     * requeriments for the request: (text, chatName)
     */
    createMessage(){
        const generateDate = () => {
            const date = new Date();
            const dateFormat = n => {
                n = n.toString();
                return n.length > 1 ? n : `0${n}`
            };

            return `${date.getFullYear()}-${dateFormat(date.getMonth())}-${dateFormat(date.getDate())} ${dateFormat(date.getHours())}:${dateFormat(date.getMinutes())}:${dateFormat(date.getSeconds())}`;
        };
        
        this.server.get('/api/create-message', (req, res) => {
            try {
                const bind = {
                    text: req.query.text,
                    chatName: req.query.chatName,
                    userId: req.user.id,
                    date: (this.App.isNull(req.query.date) ? generateDate() : req.query.date)
                };
                
                this.App.MessageOrm.create(bind);
                
                res.status(200).send('Ok!')
            }
            catch (err){
                this.App.throwErr(err, this.prefix);
                res.status(500).send(err.message)
            }
        })
    }
    
    
     /**
     * This function prepare the route for get messages in the api
     * requeriments for the request: (chatName)
     */
    getMessages(){
        this.server.get('/api/get-messages', (req, res) => {
            try {
                const bind = {
                    chatName: req.query.chatName,
                }

                this.App.MessageOrm.getByChatName(bind, (err, rows) => {
                    if (err) this.App.throwErr(err, this.prefix, res);
                    res.status(200).send(rows)
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix);
                res.status(500).send(err.message)
            }
        })
    }


    /**
     * This function prepare the route for delete message in the api
     * requeriments for the request: (id)
     */
    deleteMessage(){
        this.server.post('/api/delete-message', (req, res) => {
            try {
                const bind = {
                    id: req.body.id
                };
                
                if (!this.App.isNull(bind.id)) 
                    this.App.MessageOrm.deleteById({ id: bind.id });
                
                res.status(200).send('Ok!')
            }
            catch (err){
                this.App.throwErr(err, this.prefix);
                res.status(500).send(err.message)
            }
        })
    }
    
    
    /**
     * This function prepare the route for update message in the api
     * requeriments for the request: (id, text)
     */
    updateMessage(){
        this.server.post('/api/update-message', (req, res) => {
            try {
                const bind = {
                    id: req.body.id,
                    text: req.body.text
                }
                
                if (!this.App.isNull(bind.id)) this.App.MessageOrm.updateById({
                    id: bind.id,
                    text: bind.text
                });
                
                res.status(200).send('Ok!')
            }
            catch (err){
                this.App.throwErr(err, this.prefix);
                res.status(500).send(err.message)
            }
        })
    }
    
    
}