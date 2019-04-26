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
		deleteUser();
		updateUser();
	}
	
	
	/**
	 * This function prepare the route for delete chat in the api
	 * requeriments for the request: (id || nameUser)
	 */
	deleteUser(){
		this.server.post('/api/delete-user', (req, res) => {
			try {
				const bind = {
					id: req.body.id,
					name: req.body.name
				};
				
				if (!this.App.isNull(bind.id)) this.App.UserOrm.deleteById({
					id: bind.id
				});
				else this.App.UserOrm.deleteByName({
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
	 * This function prepare the route for update user in the api
	 * requeriments for the request: (id || nameUser) and new nameUser
	 */
	updateUser(){
		this.server.post('/api/update-user', (req, res) => {
			try {
				const bind = {
					id: req.body.id,
					name: req.body.name,
					newname: req.body.newname
				};
				
				if (!this.App.isNull(bind.id)) this.App.UserOrm.updateById({
					id: bind.id,
					newname: bind.newname
				});
				else this.App.UserOrm.updateByName({
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