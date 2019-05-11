module.exports = class ApiRank {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(App, server){
        this.App = App;
        this.server = server;
        this.orm = this.App.RankOrm;
    }
    
    
    /** REST **/
    
    /**
     * This function check if user is admin
     * @param {Object} data of user is (id || username)
     * @param {*} callback
     */
    isAdmin(data, callback){
        function checkIsAdmin(err, rows){
            if (err){
                this.App.throwErr(err);
                return
            }
            if (rows[0].id != 3) return;
            
            callback();
        }
        
        if (!this.App.isNull(data.username)) this.orm.getByUserName({
            username: data.username
        }, checkIsAdmin);
        else if (!this.App.isNull(data.id)) this.orm.getByUserId({
            userId: data.id
        }, checkIsAdmin)
    }
    
    
    /**
     * This function check if user is admin
     * @param {Object} data of user is (id || username)
     * @param {*} callback
     */
    isMod(data, callback){
        function checkIsAdmin(err, rows){
            if (err){
                this.App.throwErr(err);
                return
            }
            if (rows[0].id != 2) return;
            
            callback();
        }
        
        if (!this.App.isNull(data.username)) this.orm.getByUserName({
            username: data.username
        }, checkIsAdmin);
        else if (!this.App.isNull(data.id)) this.orm.getByUserId({
            userId: data.id
        }, checkIsAdmin)
    }
    
    
    /**
     * This function check if user is admin
     * @param {Object} data of user is (id || username)
     * @param {*} callback
     */
    isUser(data, callback){
        function checkIsAdmin(err, rows){
            if (err){
                this.App.throwErr(err);
                return
            }
            if (rows[0].id != 1) return;
            
            callback();
        }
        
        if (!this.App.isNull(data.username)) this.orm.getByUserName({
            username: data.username
        }, checkIsAdmin);
        else if (!this.App.isNull(data.id)) this.orm.getByUserId({
            userId: data.id
        }, checkIsAdmin)
    }
    
    
}