/** MAIN VARS **/

const webURI = `${window.location.protocol}//${window.location.host}`;


/** FUNCTIONS **/

/**
 * This function render the chats
 * @param {Object} bind 
 */
function renderChats(bind){
    const container = $("#main");

    container.append(`
        <div id="${bind.id}" class="chat">
            <div class="header">
                <p>${bind.name}</p>
            </div>
            <div class="body">
                <button class="btn btn-primary join"><i class="fa fa-sign-in"></i></button>
                <button class="btn btn-danger remove"><i class="fa fa-trash"></i></button>
            </div>
        </div>
    `);

    registerChatControlListener(bind)
}


/**
 * This function register chat control listeners
 * @param {Object} bind 
 */
function registerChatControlListener(bind){
    $(`#${bind.id} .join`).on('click', e => redirect(`${webURI}/chats/${bind.name}`));
    $("#modalDeleteChat .delete").on('click', e => deleteChatRequest(bind))
    $(`#${bind.id} .remove`).on('click',
        () => $("#modalDeleteChat").fadeIn(300, () => $("#modalDeleteChat").modal('show'))
    );
}


/**
 * This function removes a element from array
 * @param {Array} array 
 * @param {*} element 
 */
function deleteElementFromArray(array, element){
    array.map((e, index) => {
        if (e == element){
            delete myRooms[index];
            return
        }
    })
}


/** REQUESTS **/

function deleteChatRequest(bind){
    new Request(`${webURI}/api/delete-chat?id=${bind.id}`, "POST", e => {
        if (e.status == 200 || e.responseText == "Ok!"){ 
            $("#modalDeleteChat").modal('hide');//close the modal
            $(`#${bind.id}`).fadeOut(350, () => $(this).remove());//Remove this room from list
            
            deleteElementFromArray(myRooms, bind.name);//Remove the array from the autocomplete rooms array
            //TODO: Check if container is empty remove this
            $("#notifications").append(`
                <div data-timeout="5" class="alert alert-dimissible alert-info">
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                    <strong>Success!</strong><br> Deleting the chat room: '${bind.name}'
                </div>
            `)
        }
        else throwErr(e.responseText)
    }, `id=${bind.id}`)
}


/** METHODS **/

$(document).ready(() => {
    getChatsRequest(e => {
        const res = e.response;
        const json = JSON.parse(res);
        
        if (!json.length) $("#main").remove();
        else json.forEach(renderChats)
    })
})