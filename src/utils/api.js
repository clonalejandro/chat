/** IMPORTS **/

var ApiChat    = require('../api/apichat');
var ApiUser    = require('../api/apiuser');
var ApiMessage = require('../api/apimessage');
var ApiBan     = require('../api/apiban');
var ApiRank    = require('../api/apirank');


module.exports = class Api {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(App, server){
        this.ApiChat = new ApiChat(App, server);
        this.ApiUser = new ApiUser(App, server);
        this.ApiMessage = new ApiMessage(App, server);
        this.ApiBan = new ApiBan(App, server);
        this.ApiRank = new ApiRank(App, server);
        
        App.debug("The api has been started!")
    }
    
    
}