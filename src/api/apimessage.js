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
				return n.length > 1 ? n : `0${n}`
			};

			return `${date.getFullYear()}-${dateFormat(date.getMonth())}-${dateFormat(date.getDate())} ${dateFormat(date.getHours())}:${dateFormat(date.getMinutes())}:${dateFormat(date.getSeconds())}`;
		};
		
		
		this.server.post('/api/create-message', (req, res) => {
			try {
				const bind = {
					text: req.body.text,
					chatId: req.body.chatId,
					userId: req.body.userId,
					date: generateDate(),
				};
				
				this.App.MessageOrm.create(bind);
				
				res.status(200).send('Ok!')
			}
			catch (err){
				this.App.throwErr(err);
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
				this.App.throwErr(err);
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
				this.App.throwErr(err);
				res.status(500).send(err.message)
			}
		})
	}
	
	
}