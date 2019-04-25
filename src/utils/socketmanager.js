module.exports = class SocketManager {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(App){
		this.App = App;
		this.io = App.io;
		this.prefix = "SOCKET";

		this.messageBuffer = [];
	}

	
	/** REST **/
	
	/**
     * This function register all listeners for the sockets server
     */
	registerListeners(){
		this.io.on('connection', socket => {
			this.App.debug("Client connected", this.prefix);

			if (this.messageBuffer.length > 0) this.send(socket, 'get-message', this.messageBuffer);
			
			this.registerSocketListener(socket, 'send-message', data => {
				this.messageBuffer.push(data);
				this.send(this.io.sockets, 'get-message', this.messageBuffer);
			})
		})
	}

	
	/**
     * This function register a listener for a socket
     * @param socket {*}
     * @param subject {String}
     * @param callback {*}
     */
	registerSocketListener(socket, subject, callback){
		socket.on(subject, callback);
	}


	/**
     * This function send data by sockets
	 * @param socket {Object}
     * @param subject {String}
	 * @param message {String}
	 */
	send(socket, subject, message){
		this.App.debug(message, `${this.prefix} ${subject.toUpperCase()}`);
		socket.emit(subject, message)
	}

	
}
