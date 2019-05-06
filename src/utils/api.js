/** IMPORTS **/

var ApiChat    = require('../api/apichat');
var ApiUser    = require('../api/apiuser');
var ApiMessage = require('../api/apimessage');

module.exports = class Api {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(App, server){
		this.ApiChat = new ApiChat(App, server);
		this.ApiUser = new ApiUser(App, server);
		this.ApiMessage = new ApiMessage(App, server);
		
		App.debug("The api has been started!");
	}
	
	
}