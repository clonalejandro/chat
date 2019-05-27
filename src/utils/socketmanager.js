module.exports = class SocketManager {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(App){
        this.App = App;
        this.io = App.io;
        this.prefix = "SOCKET";
    }

    
    /** REST **/
    
    /**
     * This function register all listeners for the sockets server
     */
    registerListeners(){
        this.io.on('connection', socket => {
            this.App.debug("Client connected", this.prefix);

            this.registerSocketListener(socket, 'send-message', data => {
                this.App.MessageOrm.getByChatName({chatName: data.room}, (err, rows) => {
                    if (err) return this.App.throwErr(err, this.prefix);
                    if (rows) rows.forEach(row => row.userId = this.App.serializeSalt(row.userId));//Serialize userId
                    this.send(this.io.sockets, 'get-message', rows)
                })
            });

            this.registerSocketListener(socket, 'refresh', data => {
                this.App.MessageOrm.getByChatName({chatName: data.room}, (err, rows) => {
                    if (err) return this.App.throwErr(err, this.prefix);
                    if (rows) rows.forEach(row => row.userId = this.App.serializeSalt(row.userId));//Serialize userId
                    this.send(this.io.sockets, 'refresh', rows)
                })
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
