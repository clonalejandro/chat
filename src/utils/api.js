/** IMPORTS **/

var ApiChat = require("../api/apichat");


module.exports = class Api {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(App, server){
		this.ApiChat = new ApiChat(App, server);
	}
	
	
}