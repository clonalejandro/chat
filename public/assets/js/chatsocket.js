var socket;
var reconnect = true;
const tasks = new Array();


/** TASKS **/

/**
 * This task check if connection is ended for reconnect this
 * @return task {*}
 */
const connectionChecker = () => {
    return setInterval(() => {
        if (!socket.connected && !socket.connecting && reconnect){
            socket.connect();
            console.log("Trying to reconnect to the socket server")
        }
    }, 2000)
};


/** FUNCTIONS **/

/**
 * This function init the backend sockets
 */
function initIo(){
    const config = {'forceNew': true};
    const url = `${location.protocol}//${location.host}`;

    socket = io.connect(url, config);
    tasks.push({name: "connectionChecker", id: connectionChecker()});

    socket.on('connect', () => console.log("Sockets initialized"))
}


/**
 * This function check if data is null
 * @param element {*}
 * @return isNull {Boolean}
 */
function isNull(element){
    return element == undefined || element == null || element == ""
}


/**
 * This function register a listener when socket get messages
 * @param {*} callback 
 */
function socketOnGetMessage(callback){
    socket.on('get-message', callback)
}


/**
 * This function register a listener when socket refresh
 * @param {*} callback 
 */
function socketOnRefresh(callback){
    socket.on('refresh', callback)
}


/**
 * This funciton register a listen when status of user change
 * @param {*} callback 
 */
function socketOnStatus(callback){
    socket.on('status', callback)
}


/**
 * This function send data via sockets
 * @param {Object} data 
 */
function socketSendMessage(data){
    socket.emit('send-message', data)
}


/**
 * This function end the socket connection
 */
async function socketDisconnect(){
    reconnect = false;
    socket.disconnect();
}


/**
 * This function send data via sockets
 * @param {Object} data 
 */
function socketSendRefresh(data){
    socket.emit('refresh', data)
}