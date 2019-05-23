/** MAIN VARS **/

var currentChatToDelete;
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
    $("#modalDeleteChat button.delete-chat").unbind().on('click', e => deleteChatRequest());

    $(`#${bind.id} .remove`).on('click', () => {
        currentChatToDelete = bind;
        $("#modalDeleteChat").fadeIn(300, () => $("#modalDeleteChat").modal('show'))
    });
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


/**
 * This function remove the chat container
 */
function removeChatContainer(){
    if (!chatContainerHasVisibleContent()){
        const container = $("#main");
        
        container.parent().append("<h4 style='color: white; font-weight: 300; text-align: center'>You don't have chats</h4>");
        container.remove();
    } 
}


/**
 * This function check if the chat container has a visible content
 * @return {Boolean} chatContainerHasVisibleContent
 */
function chatContainerHasVisibleContent(){
    const childrens = $("#main").children();
    var isVisible = false;

    $.each(childrens, (key, val) => {
        const children = $(val);

        if (children.is(":visible")){
            isVisible = true;
            return
        }
    });

    return isVisible
}


/** REQUESTS **/

function deleteChatRequest(){
    new Request(`${webURI}/api/delete-chat?id=${currentChatToDelete.id}`, "POST", e => {
        if (e.readyState == 4 && (e.status == 200 || e.responseText == "Ok!")){ 
            $("#modalDeleteChat").modal('hide');//close the modal
            $(`#${currentChatToDelete.id}`).fadeOut(350, () => {
                $(this).remove();
                removeChatContainer();
            });//Remove this room from list
            
            deleteElementFromArray(myRooms, currentChatToDelete.name);//Remove the array from the autocomplete rooms array
           
            $("#notifications").append(`
                <div data-timeout="5" class="alert alert-dimissible alert-info">
                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                    <strong>Success!</strong><br> Deleting the chat room: <i>${currentChatToDelete.name}</i>
                </div>
            `);

            alertTimeout()//For clear the notifications in time
        }
        else throwErr(e.responseText)
    }, `id=${currentChatToDelete.id}`)
}


/** METHODS **/

$(document).ready(() => {
    getChatsRequest(e => {
        const res = e.response;
        const json = JSON.parse(res);
        
        if (!json.length) removeChatContainer()
        else json.forEach(renderChats)
    })
})