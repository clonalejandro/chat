/** IMPORTS **/

const fs   = require("fs");


/** FUNCTIONS **/ 

function createLogName(){
	const date = new Date();
	const d = {
		year: date.getFullYear(),
		month: date.getMonth(),
		day: date.getDate(),
		hour: date.getHours(),
		min: date.getMinutes(),
		sec: date.getSeconds() 
	};

	return `log${d.year}-${d.month}-${d.day}_${d.hour}:${d.min}:${d.sec}`
}


function createLogDir(dir){
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
}


module.exports = class Log {


	/** SMALL CONSTRUCTORS **/

	constructor(logDir){
		this.name = createLogName();
		this.logDir = __dirname + "/../../logs/";
		
		createLogDir(this.logDir);
		this.create();
	}

	
	/**
     * This function creates a log
     */
	create(){
		fs.writeFile(this.logDir + this.name, '', err => {
			if (err) throw err;
			else console.log("Log started!")
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


}
