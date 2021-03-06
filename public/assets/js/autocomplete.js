/** FUNCTIONS **/

String.prototype.startsWithIgnoreCase = function(chr){	
    return this.toUpperCase().startsWith(chr.toUpperCase())
}

String.prototype.equalsIgnoreCase = function(str){
    return this.toUpperCase() == str.toUpperCase()
}

String.prototype.isEmpty = function(){
    return this == ""
}


class AutoComplete {
    
    
    /** SMALL CONSTRUCTORS **/
    
    constructor(element, list = [], onclickCompleted = undefined){
        this.element = $(element)[0];
        this.list = list;
        this.onclickCompleted = onclickCompleted;
        
        this.start()
    }
    
    
    /**
     * This function start the autocomplete
     */
    start(){
        if (!this.list.length) 
            console.error(`Your list is empty`);
        else this.registerInputListeners()
    }
    
    
    /**
     * This function check if data isNull
     * @param {*} data
     * @return {Boolean} isNull
     */
    isNull(data){
        return data == undefined || data == null
    }
    
    
    /**
     * This function clear the autocomplete container
     */
    clearContainer(){
        const container = $(".autocompleter")[0];
        
        if (container)
            container.remove()
    }
    
    
    /**
     * This function create autocomplete with html
     * @param {Object} parent
     * @param {String} html
     */
    createAutocomplete(parent, html){
        this.clearContainer();
        
        $(parent).append(
            $(html).hide().fadeIn(500)
        )
    }
    
    
    /**
     * This function complete the input
     */
    completeWithData(){
        const currentVal = this.element.value;
        const parent = this.element.parentElement;
        const container = $(".autocompleter")[0];
        const targetList = new Array();

        var isEquals = false;

        
        if (currentVal.isEmpty()){
            this.clearContainer();
            return
        }
        
        this.list.forEach(e => {
            if (e.equalsIgnoreCase(currentVal)) isEquals = true;
            if (e.startsWithIgnoreCase(currentVal)) 
                targetList.push(e) 
        });
    
        if (isEquals && targetList.length <= 1) return this.clearContainer();
        
        if (!targetList.length) return this.clearContainer();

        var html = `<div class='autocompleter'>`;

        targetList.forEach(e => {
            const first = currentVal;
            const rest = e.substring(currentVal.length, e.length);
            
            html = html.concat(`<div class='element' id='${e}'><b>${first}</b>${rest}</div>`);
        });
        
        html = html.concat(`</div>`);
        
        this.createAutocomplete(parent, html);
        this.registerElementListener()
    }
    
    
    /**
     * This function register a listener when you click the element autorecomendated
     */
    registerElementListener(){
        const elements = document.querySelectorAll('.autocompleter > .element');
        
        elements.forEach(e => e.addEventListener('click', e => {
            const chatName = e.target.textContent;

            this.element.value = chatName;
            this.completeWithData();//Refresh autocomplete
            
            if (this.onclickCompleted != undefined) this.onclickCompleted();
        }))
    }
    
    
    /**
     * This function start the input event
     */
    registerInputListeners(){
        this.element.addEventListener('input', e => {
            this.completeWithData();
            return false
        })
    }
    
    
}