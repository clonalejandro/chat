/** IMPORTS **/

const routes   = require('../../assets/data/routes.json');
const config   = require('../../assets/data/config.json');


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
        this.renderProfile();
        this.renderChatPanel();
        this.renderAdminPanel();
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
                    const tempConfig = getSecureConfig();
                    if (!this.debugView(req, res, tempConfig))
                        res.render(view, tempConfig)
                }
                catch (err){
                    this.App.throwErr(err, this.prefix, res)
                }
            });
            this.App.debug(`The server is registering route: "${url}" aiming to: ${view}`, this.prefix)
        })
    }
    
    
    /**
     * This function render the chat rooms
     */
    renderChat(){
        this.server.get('/chats/:room', this.isAuthenticated, (req, res) => {
            try {
                const room = req.params.room;
                const tempConfig = getSecureConfig();

                tempConfig.room = room;
                tempConfig.user = req.user;
                tempConfig.user.id = this.App.serializeSalt(tempConfig.user.id); 
                
                this.App.Api.ApiRank.isAdmin(req.user, isAdmin => {
                    tempConfig.isAdmin = isAdmin;
                    if (!this.debugView(req, res, tempConfig))
                        res.render('chat', tempConfig)
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        });
        
        this.App.debug(`The server is registering route: "/chats/:room" aiming to: chat`, this.prefix)
    }
    
    
    /**
     * This function render the chat panel
     */
    renderChatPanel(){
        this.server.get('/chatpanel', this.isAuthenticated, (req, res) => {
            try {
                const tempConfig = getSecureConfig();

                tempConfig.user = req.user;
                tempConfig.user.id = this.App.serializeSalt(tempConfig.user.id);

                this.isBan(req, res, () => this.App.Api.ApiRank.isAdmin(req.user, isAdmin => {
                    tempConfig.isAdmin = isAdmin;
                    if (!this.debugView(req, res, tempConfig))
                        res.render('chatpanel', tempConfig)
                }))
            } 
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        });

        this.App.debug(`The server is registering route: "/chatpanel" aiming to: chatpanel`, this.prefix)
    }


    /**
     * This function renders the Admin Panel Page
     */
    renderAdminPanel(){
        this.server.get('/adminpanel', this.isAuthenticated, (req, res) => {
            try {
                const tempConfig = getSecureConfig();

                tempConfig.user = req.user;
                tempConfig.user.id = this.App.serializeSalt(tempConfig.user.id);

                this.App.Api.ApiRank.isAdmin(req.user, isAdmin => {
                    if (isAdmin)
                        if (!this.debugView(req, res, tempConfig))
                            res.render('adminpanel', tempConfig)
                    else res.status(401).send('Forbbiden: you need more rank to see this page!');
                })
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        });

        this.App.debug(`The server is registering route: "/adminpanel" aiming to: adminpanel`, this.prefix)
    }


    /**
     * This function render the profile page
     */
    renderProfile(){
        this.server.get('/profile', this.isAuthenticated, (req, res) => {
            try {
                const tempConfig = getSecureConfig();

                tempConfig.user = req.user;
                tempConfig.user.id = this.App.serializeSalt(tempConfig.user.id);

                this.isBan(req, res, () => this.App.Api.ApiRank.isAdmin(req.user, isAdmin => {
                    tempConfig.isAdmin = isAdmin;
                    if (!this.debugView(req, res, tempConfig))
                        res.render('profile', tempConfig)
                }))
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        });

        this.App.debug(`The server is registering route: "/profile" aiming to: profile`, this.prefix)
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
                    if (!this.debugView(req, res, tempConfig))
                        res.render('signup', tempConfig)
                }
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
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
                if (!this.debugView(req, res, tempConfig))
                    res.render('login', tempConfig)
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        });
        
        this.server.post('/login', this.passport.authenticate('login', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));
        
        this.App.debug(`The server is registering route: "/login" aiming to: login`, this.prefix)
    }
    
    
    /**
     * This function render the signout for destroy sessions
     */
    renderLogout(){
        this.server.get('/logout', (req, res) => {
            try {
                this.App.removeOnlineUser(req);

                req.logout();
                res.redirect('/login');
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
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

                this.App.addOnlineUser(req);
                
                this.isBan(req, res, () => this.App.Api.ApiRank.isAdmin(req.user, isAdmin => {
                    tempConfig.isAdmin = isAdmin;
                    if (!this.debugView(req, res, tempConfig))
                        res.render('panel', tempConfig)
                }))
            }
            catch (err){
                this.App.throwErr(err, this.prefix, res)
            }
        });
        
        this.App.debug(`The server is registering route: "/panel" aiming to: panel`, this.prefix);
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
     * This function check if user is banned
     * @param {*} req 
     * @param {*} res 
     * @param {*} callback 
     */
    isBan(req, res, callback){
        this.App.Api.ApiBan.isBan({userId: req.user.id}, isBan => {
            if (isBan) res.redirect('/logout');
            else callback()
        })
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


    /**
     * This function debug the view
     * @param {*} req 
     * @param {*} res 
     * @param {Object} tempConfig 
     * @return {Boolean} debugViewIsRendered
     */
    debugView(req, res, tempConfig){
        const viewType = req.query.view;
        
        if (!config.debug || this.App.isNull(viewType)) return;

        switch (viewType){
            case "json":
                res.send(tempConfig);
                return true
            default:
                return false
        }
    }
}
