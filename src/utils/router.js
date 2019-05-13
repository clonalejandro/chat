/** IMPORTS **/

const routes = require('../../assets/data/routes.json');
const config = require('../../assets/data/config.json');


/** FUNCTIONS **/

function getSecureConfig(){
    const tempConfig = {
        apiKey: config.apiKey,
        logo: config.logo,
        webName: config.webName,
        description: config.description,
        tagsString: config.tagsString,
        email: config.email,
        webURI: config.webURI
    }
    
    return tempConfig
}


module.exports = class Router {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(App, server, passport){
        this.App = App;
        this.server = server;
        this.passport = passport;
        this.prefix = "ROUTER";
    }
    
    
    /** REST **/
    
    /**
     * This function render all routes
     */
    render(){
        this.renderMainRoutes();
        this.renderChat();
        this.renderRegister();
        this.renderLogin();
        this.renderPanel();
        this.renderLogout();
    }
    
    
    /**
     * This function render pages with routes file
     */
    renderMainRoutes(){
        Object.keys(routes).forEach(url => {
            const view = routes[url];
            
            this.server.get(url, (req, res) => {
                try {
                    res.render(view, getSecureConfig());
                }
                catch (err){
                    this.App.throwAlert(err);
                    res.status(500).send(err)
                }
            });
            this.App.debug(`The server is registering route: "${url}" aiming to: ${view}`, this.prefix)
        })
    }
    
    
    renderChat(){
        this.server.get('/chats/:room', this.isAuthenticated, (req, res) => {
            try {
                const room = req.params.room;
                const tempConfig = getSecureConfig();

                tempConfig.room = room;
                tempConfig.user = req.user;

                res.render('chat', tempConfig)
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err.message)
            }
        });
        
        this.App.debug(`The server is registering route: "/chats/:room" aiming to: chat`, this.prefix);
    }
    
    
    /**
     * This function render the register pasarel
     */
    renderRegister(){
        this.server.get('/signup', this.preventRelogin, (req, res) => {
            try {
                if (req.isAuthenticated()) res.redirect('/logout');
                else {
                    const tempConfig = getSecureConfig();
                    const msg = req.flash('msg');
                
                    tempConfig.msg = (!msg.length || this.App.isNull(msg)) ? undefined : msg;
                
                    res.render('signup', tempConfig)
                }
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err.message)
            }
        });
        
        this.server.post('/signup', this.passport.authenticate('signup', {
            successRedirect: '/',
            failureRedirect: '/signup',
            failureFlash: true
        }));
        
        this.App.debug(`The server is registering route: "/signup" aiming to: signup`, this.prefix);
    }
    

    /**
     * This function render the login pasarel
     */
    renderLogin(){
        this.server.get('/login', this.preventRelogin, (req, res) => {
            try {
                const tempConfig = getSecureConfig();
                const msg = req.flash('msg');
                
                tempConfig.msg = (!msg.length || this.App.isNull(msg)) ? undefined : msg;
                
                res.render('login', tempConfig)
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err.message)
            }
        });
        
        this.server.post('/login', this.passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));
        
        this.App.debug(`The server is registering route: "/login" aiming to: login`)
    }
    
    
    /**
     * This function render the signout for destroy sessions
     */
    renderLogout(){
        this.server.get('/logout', (req, res) => {
            try {
                req.logout();
                res.redirect('/login');
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err.message)
            }
        })
    }
    

    /**
     * This function render the panel route and the panel view
     */
    renderPanel(){
        this.server.get('/',  this.isAuthenticated, (req, res) => {
            try {
                const tempConfig = getSecureConfig();

                tempConfig.username = req.user.username;
                
                res.render('panel', tempConfig)
            }
            catch (err){
                this.App.throwAlert(err);
                res.status(500).send(err.message)
            }
        });
        
        this.App.debug(`The server is registering route: "/panel" aiming to: panel`);
    }
    
    
    /**
     * This function protect panel checking if you are logged in
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    isAuthenticated(req, res, next){
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }


    /**
     * This function prevent relogin checking if you are logged in
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    preventRelogin(req, res, next){
        if (req.isAuthenticated()) res.redirect('/logout');
        else next();
    }
}