/** IMPORTS **/

const fs   = require('fs');
const Math = require('./math');


/** FUNCTIONS **/ 

function formatDate(n){
    n = n.toString();
    return (n.length > 1 ? n : `0${n}`)
}

function createLogName(){
    const date = new Date();
    const d = {
        year: date.getFullYear(),
        month: formatDate(date.getMonth()),
        day: formatDate(date.getDate()),
        hour: formatDate(date.getHours()),
        min: formatDate(date.getMinutes()),
        sec: formatDate(date.getSeconds())
    };

    return `log${d.year}${d.month}${d.day}${d.hour}${d.min}${d.sec}.log`
}


module.exports = class Log {


    /** SMALL CONSTRUCTORS **/

    constructor(){
        this.name = createLogName();
        this.logDir = __dirname + "/../../logs/";
        
        this.createLogDir();
        this.create();
    }

    
    /**
     * This function creates a log
     */
    create(){
        fs.writeFile(this.logDir + this.name, '', err => {
            if (err) throw err;
            else console.log(`New log started wich name is ${this.name}`)
        })
    }
    
    
    /**
     * @param {String} text
     * This function writes in the log
     */
    write(text){
        fs.appendFile(this.logDir + this.name, text, err => {
            if (err) throw err
        })
    }
    
    
    /**
     * This function creates a logDir
     */
    createLogDir(dir = this.logDir){
        if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    }

    
    /**
     * This function rotate the log
     */
    logRotate(){
        const log = this.logDir + this.name;
        const size = Math.bytesToMegas(
            fs.statSync(log).size
        );
            
        if (size >= 1024){
            const newName = createLogName();
            const lastName = this.name;
                
            this.write(`\nRotating this log to: "${newName}"`);
                
            this.name = newName;
                
            this.create();
            this.write(`Log rotated from: ${lastName}`)
        }
    }

    
}
