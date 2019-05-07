function responsive(){
	$("#wrapper").height(
		$(window).height()
	);
}


/** METHODS **/

$(document).ready(() => {
	responsive();
})