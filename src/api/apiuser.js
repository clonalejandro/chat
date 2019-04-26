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
		this.deleteUser();
		this.updateUser();
		
		this.App.debug("Register all apiuser routes", this.prefix);
	}
	
	
	/**
	 * This function prepare the route for delete chat in the api
	 * requeriments for the request: (id || username)
	 */
	deleteUser(){
		this.server.post('/api/delete-user', (req, res) => {
			try {
				const bind = {
					id: req.body.id,
					username: req.body.username
				};
				
				if (!this.App.isNull(bind.id)) this.App.UserOrm.deleteById({
					id: bind.id
				});
				else this.App.UserOrm.deleteByName({
					username: bind.username
				})
			}
			catch (err){
				this.App.throwErr(err);
				res.status(500).send(err)
			}
		})
	}
	
	
	/**
	 * This function prepare the route for update user in the api
	 * requeriments for the request: ((id || username), newusername)
	 */
	updateUser(){
		this.server.post('/api/update-user', (req, res) => {
			try {
				const bind = {
					id: req.body.id,
					username: req.body.username,
					newusername: req.body.newusername
				};
				
				if (!this.App.isNull(bind.id)) this.App.UserOrm.updateById({
					id: bind.id,
					newname: bind.newusername
				});
				else this.App.UserOrm.updateByName({
					username: bind.username,
					newusername: bind.newusername
				})
			}
			catch (err){
				this.App.throwErr(err);
				res.status(500).send(err)
			}
		})
	}
	
	
}