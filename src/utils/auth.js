/** IMPORTS **/

const bCrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;


module.exports = class Auth {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(App, passport){
        this.App = App;
        this.passport = passport;
        this.prefix = "AUTH";
        
        this.configureLogin();
<<<<<<< HEAD
        this.configureRegister();
=======
        this.configureRegister()
>>>>>>> 8356a5404267ef56df766ccba6c83eb88396764a
    }
    
    
    /** REST **/
    
    /**
     * This function configure the login strategy
     */
    configureLogin(){
        const contextPrefix = "LOGIN";
        const prefix = `${this.prefix}-${contextPrefix}`;
        const localStrategy = new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback : true
        },
        (req, username, password, done) => this.App.UserOrm.getByUserName({username: username}, (err, rows) => {
            if (err){
                this.App.throwErr(err, this.prefix);
                return done(err)
            }

            if (!rows.length){
                this.App.debug(`User not found: ${req}`, prefix);
                return done(null, false, req.flash('msg', 'User not found!'))
            }			
            
            if (!this.isValidPassword(rows[0], password)){
                this.App.debug(`Wrong password: ${req}`, prefix);
                return done(null, false, req.flash('msg', 'Oops! Wrong password.'))
            }
            
            return done(null, rows[0])
        }));
        
        this.passport.use('login', localStrategy)
    }
    
    
    /**
     * This function configure the register strategy
     */
    configureRegister(){
        const contextPrefix = "REGISTER";
        const prefix = `${this.prefix}-${contextPrefix}`;
        const localStrategy = new LocalStrategy({passReqToCallback: true}, (req, username, password, done) => {
            const findOrCreateUser = () => this.App.UserOrm.getByUserName({username: username}, (err, rows) => {
                if (err){
                    this.App.throwErr(err, this.prefix);
                    return done(err)
                }
                
                if (rows.length){
                    this.App.debug(`The username is alredy taken: ${req}`, prefix);
                    return done(null, false, req.flash('msg', 'That username is already taken.'))
                }
                
                const data = {
                    username: username, 
                    password: this.createHash(password),
                    rank: 0
                };
                
                this.App.UserOrm.create(data, (err, res) => {
                    if (err) this.App.throwErr(err, this.prefix);
<<<<<<< HEAD
                    return done(null, data);
=======
                    return done(null, data)
>>>>>>> 8356a5404267ef56df766ccba6c83eb88396764a
                })
            })
            
            process.nextTick(findOrCreateUser)
        })
        
        this.passport.use('signup', localStrategy)
    }
    
    
    /**
     * This function encrypt the password passed by parameter
     * @param {String} password 
     * @return {String} passwordHashed
     */
    createHash(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null)
    }
    
    
    /**
     * This function check if user & password is correct
     * @param {String} rows 
     * @param {String} password 
     * @return {Boolean} isValid
     */
    isValidPassword(rows, password){
        return bCrypt.compareSync(password, rows.password)
    }
}
