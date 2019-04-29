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
		this.deleteMessage();
		this.updateMessage();
		
		this.App.debug("Register all apimessage routes", this.prefix)
	}
	
	
	/**
     * This function prepare the route for create message in the api
	 * requeriments for the request: (text, chat, userId, date)
     */
	createMessage(){
		const generateDate = () => {
			const date = new Date();
			const dateFormat = n => {
				n = n.toString();
				return n.length < 2 ? `0${n}` : n;
			};

			return `${date.getFullYear()}-${dateFormat(date.getMonth())}-${dateFormat(date.getDate())} ${dateFormat(date.getHours())}:${dateFormat(date.getMinutes())}:${dateFormat(date.getSeconds())}`;
		};
		
		
		this.server.post('/api/create-message', (req, res) => {
			try {
				const bind = {
					text: req.body.text,
					chat: req.body.chat,
					userId: req.body.userId,
					date: generateDate(),
				};
				
				this.App.MessageOrm.create(bind)
			}
			catch (err){
				this.App.throwErr(err);
				res.status(500).send(err)
			}
		})
	}
	
	
	/**
     * This function prepare the route for delete message in the api
	 * requeriments for the request: (id || username || userId)
     */
	deleteMessage(){
		this.server.post('/api/delete-message', (req, res) => {
			try {
				const bind = {
					id: req.body.id,
					username: req.body.username,
					userId: req.body.userId
				};
				
				if (!this.App.isNull(bind.id)) this.App.MessageOrm.deleteById({
					id: bind.id
				});
				else if (!this.App.isNull(bind.username)) this.App.MessageOrm.deleteByUserName({
					username: bind.username
				});
				else this.App.MessageOrm.deleteByUserId({
					userId: bind.userId
				})
			}
			catch (err){
				this.App.throwErr(err);
				res.status(500).send(err)
			}
		})
	}
	
	
	/**
     * This function prepare the route for update message in the api
	 * requeriments for the request: ((id || username || userId), text)
     */
	updateMessage(){
		this.server.post('/api/update-message', (req, res) => {
			try {
				const bind = {
					id: req.body.id,
					text: req.body.text,
					username: req.body.username,
					userId: req.body.userId
				}
				
				if (!this.App.isNull(bind.id)) this.App.MessageOrm.updateById({
					id: bind.id,
					text: bind.text
				});
				else if (!this.App.isNull(bind.username)) this.App.MessageOrm.updateByUserName({
					username: bind.username,
					text: bind.text
				});
				else this.App.MessageOrm.updateByUserId({
					userId: bind.userId,
					text: bind.text
				})
			}
			catch (err){
				this.App.throwErr(err);
				res.status(500).send(err)
			}
		})
	}
	
	
}