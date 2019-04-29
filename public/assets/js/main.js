var socket;
var author = getAuthor();
var waiting = false;
const tasks = new Array();


/** TASKS **/

/**
 * This task check if connection is ended for reconnect this
 * @return task {*}
 */
const connectionChecker = () => {
	return setInterval(() => {
		if (!socket.connected && !socket.connecting){
			socket.connect();
			console.log("Trying to reconnect to the socket server")
		}
	}, 2000)
};


/**
 * This task create a delay for resubmit the chat form
 */
const submitDelay = () => {
	setTimeout(() => {
		waiting = false	
	}, 2500)
};


/** FUNCTIONS **/

/**
 * This function init the backend sockets
 */
(function initIo(){
	const config = {'forceNew': true};
	socket = io.connect(location.href, config);
	tasks.push({name: "connectionChecker", id: connectionChecker()})
})();


/**
 * This function is like a jquery function
 * @param query {String}
 * @return DOMObject {*}
 */
function $(query){
	return document.querySelectorAll(query)
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
 * This function clear the textarea for write in the chat
 */
function clearInput(){
	setTimeout(() => {
		$("[name=msg]")[0].value = ""
	}, 100)
}


/**
 * This function clear the chat
 */
function clearChat(){
	$("#messages")[0].innerHTML = ""
}


/**
 * This function render the messages getted by backend socket
 * @param res {*} 
 */
function renderMessages(res){
	const html = res.map((data, index) => {
		return (`<div>
			<strong>${data.author}: </strong>
			<em>${data.msg} </em>
		</div>`)
	}).join(" ");
	
	$("#messages")[0].innerHTML = html
}


/**
 * This function change the author
 * @return author {String}
 */
function changeAuthor(){
	localStorage.removeItem("author");
	author = getAuthor();
	return author
}


/**
 * This function create author name and return this
 * @return author {String}
 */
function getAuthor(){
	let author = localStorage.getItem("author");
	
	if (isNull(author)){
		const date = new Date();
		const d = {
			year: date.getFullYear(),
			month: date.getMonth(),
			day: date.getDate(),
			hour: date.getHours(),
			min: date.getMinutes(),
			sec: date.getSeconds()
		};
		const salt = d.year + d.month + d.hour + d.day + d.hour + d.min + d.sec;
		
		author = prompt("Username: ") + salt;
		
		if (isNull(author) || author == salt) return getAuthor(); //For prevent author is null
		
		localStorage.setItem("author", author);
	}
	
	return author
}


/** REST **/ 

socket.on('get-message', data => {
	console.log(data);
	renderMessages(data)
});


socket.on('connect', () => {
    console.log("Sockets initialized")
});

 
$("#submiter")[0].addEventListener('click', e => { 
	const message = {
		author: author,
		msg: $("[name=msg]")[0].value
	};
	
	if (waiting){
		alert("Wait two seconds for send the next message");
		return;
	}
	
	if (isNull(message.msg)) return;//For prevent the message is empty

	socket.emit('send-message', message);
	clearInput();

	waiting = true;
	submitDelay()
})
