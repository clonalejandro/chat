/** IMPORTS **/

var ApiChat    = require('../api/apichat');
var ApiUser    = require('../api/apiuser');
var ApiMessage = require('../api/apimessage');
var ApiRank    = require('../api/apirank');


module.exports = class Api {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(App, server){
        this.ApiChat = new ApiChat(App, server);
        this.ApiUser = new ApiUser(App, server);
        this.ApiMessage = new ApiMessage(App, server);
        this.ApiRank = new ApiRank(App, server);
        
<<<<<<< HEAD
        App.debug("The api has been started!");
    }
    
    
}
=======
        App.debug("The api has been started!")
    }
    
    
}
>>>>>>> 8356a5404267ef56df766ccba6c83eb88396764a
