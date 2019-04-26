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
	 * requeriments for the request: (nameChat, userId)
     */
	createChat(){
		this.server.post('/api/create-chat', (req, res) => {
			try {
				const bind = {
					name: req.body.name,
					userId: req.body.userId
				};
				
				this.App.ChatOrm.create(bind)
			}
			catch (err){
				this.App.throwErr(err);
				res.status(500).send(err)
			}
		})
	}

	
	/**
	 * This function prepare the route for delete chat in the api
	 * requeriments for the request: (id || nameChat)
	 */
	deleteChat(){
		this.server.post('/api/delete-chat', (req, res) => {
			try {
				const bind = {
					id: req.body.id,
					name: req.body.name
				}
				
				if (!this.App.isNull(bind.id)) this.App.ChatOrm.deleteById({
					id: bind.id 
				});
				else this.App.ChatOrm.deleteByName({
					name: bind.name 
				})
			}
			catch (err){
				this.App.throwErr(err);
				res.status(500).send(err)
			}
		})
	}
	
	
	/**
	 * This function prepare the route for update chat in the api
	 * requeriments for the request: (id || nameChat) and new nameChat
	 */
	updateChat(){
		this.server.post('/api/update-chat', (req, res) => {
			try {
				const bind = {
					id: req.body.id,
					name: req.body.name,
					newname: req.body.newname 
				}
				
				if (!this.App.isNull(bind.id)) this.App.updateById({ 
					id: bind.id,
					newname: bind.newname
				});
				else this.App.updateByName({ 
					name: bind.name,
					newname: bind.newname
				})
			}
			catch (err){
				this.App.throwErr(err);
				res.status(500).send(err)
			}
		})
	}
	
	
}
