class Request {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(url, type = "GET", callback, data = null){
        this.url = url;
        this.type = type;
        this.request = new XMLHttpRequest();

        this.request.open(type, url, true);
        
        if (data != null) this.request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        
		this.request.onload = e => callback(e.target);
		this.request.onerror = e => console.error(e);
			
		this.request.send(data);
    }
  
    
}