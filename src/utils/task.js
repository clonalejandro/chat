module.exports = class TaskTimer {
	
	
	/** SMALL CONSTRUCTORS **/
	
	constructor(App, name, callback, time){
		this.prefix = "TASK";//02082017
		this.id = setInterval(callback, time);
		
		this.props = {
			name: name,
			callback: callback.toString()
		};

		App.tasks.push(this.props);
		App.debug(`New task created with data: ${JSON.stringify(this.props)}`, this.prefix);
	}
	
	
	/** REST **/
	
	delete(){
		clearInterval(this.id);
		
		tasks.map((e, index) => {
			if (e.name == this.props.name) 
				delete this.tasks[index];
		})
	}
}