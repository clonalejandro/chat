/** MAIN VARS **/

const webURI = `${window.location.protocol}//${window.location.host}`;


/** FUNCTIONS **/

function responsive(){
	$("#wrapper").height(
		$(window).height()
	);
	
	window.addEventListener("resize", e => responsive())//When window resize, this execute this function
}


function alertTimeout(){
	const notification = $("#notifications > .alert");
	const timeout = notification.data("timeout");
	
	if (timeout == undefined || timeout == null) return;
	return setTimeout(() => notification.fadeOut(300, () => $(this).remove()), timeout * 1000)
}


function isNull(data){
	return data == undefined || data == "" || data == null
}


function throwErr(message){
	const html = `
		<div class="alert alert-dimissible alert-danger">
			<button type="button" class="close" data-dismiss="alert">&times;</button>
			<big><strong>Oops!</strong> An error has ocurred! <i class='fa fa-exclamation-triangle'></i></big><br>
			${message}
		</div>
	`;
	
	$("#notifications").append(html);
}


/** REQUEST **/

function createRoomRequest(name, callback){
	new Request(`${webURI}/api/create-chat?name=${name}`, "GET", e => {
		if (e.status == 200) callback();
		else if (e.status == 500 || e.status == 401) throwErr(`
			<ul>
				<li style='text-align: left'><strong>Error status: </strong><i>${e.status}</i></li>
				<li style='text-align: left'><strong>Error code: </strong><i>${e.statusText}</i></li>
				<li style='text-align: left'><strong>Error text: </strong><i>${e.responseText}</i></li>
				<li style='text-align: left'><strong>URL: </strong><i>${e.responseURL}</i></li>
			</ul>
		`);
	}, "name=${name}");
}


/** METHODS **/

$(document).ready(() => {
	responsive()
});


/** EVENTS **/

$("#createRoom").on('click', () => {
	$("#modalCreateRoom").fadeIn(300, () => $("#modalCreateRoom").modal('show'))
});


$("#modalCreateRoom .btn-success").on('click', () => {
	const name = $("input[name='roomName']").val();
	
	if (isNull(name)) return;
	
	//Close modal and navbar
	$("#modalCreateRoom").fadeOut(300, () => $("#modalCreateRoom").modal('hide'));
	$('.collapse').collapse('hide');
	
	createRoomRequest(name, () => {
		const html = `
			<div data-timeout="5" class="alert alert-dimissible alert-info">
				<button type="button" class="close" data-dismiss="alert">&times;</button>
				<strong>Success!</strong><br> Creating a new room called: '${name}'
			</div>
		`;
	
		$("#notifications").append(html);
		alertTimeout()
	})
});