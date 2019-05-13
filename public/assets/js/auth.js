/** FUNCTIONS **/

function getHeight(){
    return $(window).height();
}


function responsive(){
    $("body").height(getHeight());
    window.addEventListener("resize", e => responsive())//When window resize, this execute this function
}


/** METHODS **/

$(document).ready(() => {
    responsive()
})