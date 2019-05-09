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
		this.getUserChats();
		this.deleteUser();
		this.updateUser();
		
		this.App.debug("Register all apiuser routes", this.prefix);
	}
	
	
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
				this.App.throwErr(err);
				res.status(500).send(err.message)
			}
		})
	}
	
	
	/**
	 * This function prepare the route for delete chat in the api
	 * requeriments for the request: (id)
	 */
	deleteUser(){
		this.server.post('/api/delete-user', (req, res) => {
			try {
				const bind = {
					id: req.body.id
				};
				
				this.App.UserOrm.deleteById({ id: bind.id });
				
				res.status(200).send('Ok!')
			}
			catch (err){
				this.App.throwErr(err);
				res.status(500).send(err.message)
			}
		})
	}
	
	
	/**
	 * This function prepare the route for update user in the api
	 * requeriments for the request: (id , newusername)
	 */
	updateUser(){
		this.server.post('/api/update-user', (req, res) => {
			try {
				const bind = {
					id: req.body.id,
					newusername: req.body.newusername
				};
				
				if (!this.App.isNull(bind.id)) this.App.UserOrm.updateById({
					id: bind.id,
					newname: bind.newusername
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