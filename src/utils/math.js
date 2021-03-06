module.exports = class CMath {

    
    /** REST **/
    
    /**
     * This function converts hours in to miliseconds
     * @param {Number} hours
     * @return {Number} hours in miliseconds
     */
    static hoursToMilis(hours){
        return hours * 60 * 60 * 1000
    }
    
    
    /**
     * This function converts minutes in to miliseconds
     * @param {Number} minutes
     * @return {Number} minutes in miliseconds
     */
    static minutesToMilis(minutes){
        return minutes * 60 * 1000
    }
    
    
    /**
     * This function converts bytes in to megabytes
     * @param {Number} bytes
     * @return {Number} bytes in megabytes
     */
    static bytesToMegas(bytes){
        return bytes / 1000000 
    }
    
    
    /**
     * This function returns a random number
     * @param {Number} min 
     * @param {Number} max 
     */
    static rand(min = 0, max = 1){
        return Math.floor((Math.random() * max) + min)
    }
}