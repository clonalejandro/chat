var myRooms = new Array();


/** FUNCTIONS **/

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


function processCreateRoom(){
    const name = $("#modalCreateRoom input[name='roomName']").val();
    
    if (isNull(name)) return;
    
    //Close modal, navbar and clear the input val
    $("#modalCreateRoom").fadeOut(300, () => $("#modalCreateRoom").modal('hide'));
    $('.collapse').collapse('hide');
    $("#modalCreateRoom input[name='roomName']").val("");
    
    createRoomRequest(name, () => {
        const html = `
            <div data-timeout="5" class="alert alert-dimissible alert-info">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Success!</strong><br> Creating a new room called: '${name}'
            </div>
        `;
    
        $("#notifications").append(html);

        alertTimeout()
        setTimeout(() => window.location.href = `/chats/${name}`, 250)
    })
}


function processJoinRoom(){
    const name = $("#modalJoinRoom input[name='roomName']").val();
    
    if (isNull(name)) return;
    
    //Close modal, navbar and clear the input val
    $("#modalJoinRoom").fadeOut(300, () => $("#modalJoinRoom").modal("hide"));
    $('.collapse').collapse('hide');
    $("#modalJoinRoom input[name='roomName']").val("");
    
    setTimeout(() => joinChatRequest({name: name}, () => window.location.href = `${webURI}/chats/${name}`), 250)
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
    }, `name=${name}`)
}


function getChatsRequest(){
    new Request(`${webURI}/api/get-user-chats`, "GET", e => {
        const res = e.response;
        const json = JSON.parse(res);
        
        myRooms = new Array();//Clear the array
        json.forEach(e => myRooms.push(e.name));

        new AutoComplete("#modalJoinRoom input[name='roomName']", myRooms)
    })
}


function joinChatRequest(bind, callback){
    new Request(`${webURI}/api/join-chat?name=${bind.name}`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") callback()
        else throwErr(e.responseText)
    }, `name=${bind.name}`)
}


function deleteUserRequest(){
    new Request(`${webURI}/api/delete-user`, "GET", e => {
        if (e.status == 200) window.location.href = `${webURI}/logout`;
        else if (e.status == 500 || e.status == 401) throwErr(`
            <ul>
                <li style='text-align: left'><strong>Error status: </strong><i>${e.status}</i></li>
                <li style='text-align: left'><strong>Error code: </strong><i>${e.statusText}</i></li>
                <li style='text-align: left'><strong>Error text: </strong><i>${e.responseText}</i></li>
                <li style='text-align: left'><strong>URL: </strong><i>${e.responseURL}</i></li>
            </ul>
        `)
    })
}


/** METHODS **/

$(document).ready(() => {
    getChatsRequest()
});


/** EVENTS **/

$("#createRoom").on('click', 
    () => $("#modalCreateRoom").fadeIn(300, () => $("#modalCreateRoom").modal('show'))
);

$("#joinRoom").on('click', 
    () => $("#modalJoinRoom").fadeIn(300, () => $("#modalJoinRoom").modal('show'))
);

$("#deleteProfile").on('click', 
    () => $("#modalDeleteProfile").fadeIn(300, () => $("#modalDeleteProfile").modal('show'))
);

$("#logout").on('click', 
    () => setTimeout(() => window.location.href = `${webURI}/logout`, 250)
);

$("#settings").on('click',
    () => setTimeout(() => window.location.href = `${webURI}/profile`, 250)
);

$("#modalCreateRoom form").on('submit', e => e.preventDefault());
$("#modalCreateRoom button[type='submit']").on('click', () => processCreateRoom());

$("#modalJoinRoom form").on('submit', e => e.preventDefault());
$("#modalJoinRoom button[type='submit']").on('click', () => processJoinRoom());

$("#modalDeleteProfile .delete").on('click', deleteUserRequest);

$("img").on('dragstart', e => e.preventDefault());