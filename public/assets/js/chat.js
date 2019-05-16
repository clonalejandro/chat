/** VARS **/

const webURI = `${window.location.protocol}//${window.location.host}`;


/** FUNCTIONS **/

/**
 * This function returns the main window height
 * @return {Number}
 */
function getHeight(){
    return $(document).height()
}


/**
 * This function set the height to a #wrapper div 
 * @param {Number} height 
 */
function responsive(height = getHeight()){
    $("#wrapper").height(height);

    $("#navbar").on("show.bs.collapse", e => responsive());//When navbar open this height increments the navbar expand
    $("#navbar").on("hide.bs.collapse", e => responsive());//When navbar open this height increments the navbar expand

    window.addEventListener("resize", e => responsive())//When window resize, this execute this function
}


/**
 * This function scroll To the last message 
 */
function gotoToLastItem(){
    const target = $(".msg_history")[0];
    if (target) target.scrollTop = target.scrollHeight
}


/**
 * This function render all messages and applys conditions for render
 * @param {Object} props 
 */
function renderMessage(props){
    if (props.userId == user.id) renderOutgoingMessage(props)
    else renderIncomingMessage(props)
}


/**
 * This function clear the messages
 */
function clearMessageContainer(){
    const container = $(".msg_history");
    if (container) container.html("")
}


/**
 * This function render a message sended by you
 * @param {Object} props 
 */
function renderOutgoingMessage(props){
    const container = $(".msg_history");

    container.append(`
        <div id="${props.id}" class="outgoing_msg">
            <div class="sent_msg">
                <p>
                    ${props.text}
                    <i id="${props.id}-btn" class="fa fa-trash"></i>    
                </p>
                <span class="time_date">${props.timeIn}</span>
            </div>
        </div>
    `);

    deleteMessageListener(props);

    return responsive()
}


/**
 * This function render a message sended by other user
 * @param {Object} props
 */
function renderIncomingMessage(props){
    const container = $(".msg_history");

    container.append(`
        <div id="${props.userId}" class="incoming_msg">
            <div class="received_msg">
                <div class="received_withd_msg">
                    <b color="white">${props.user}</b>
                    <p>${props.text}</p>
                    <span class="time_date">${props.timeIn}</span>
                </div>
            </div>
        </div>
    `);

    getUserNameFromCache(props);

    return responsive()
}


/**
 * This function format a date with seconds and with format separated by -
 * @param {Date} date 
 */
function formatOutTime(date){
    const numberFormat = n => {
        n = n.toString();
        return n.length > 1 ? n : `0${n}`  
    };

    const d = {
        y: date.getFullYear(),
        M: numberFormat(date.getMonth()),
        d: numberFormat(date.getDate()),
        h: numberFormat(date.getHours()),
        m: numberFormat(date.getMinutes()),
        s: numberFormat(date.getSeconds())
    };

    return `${d.y}-${d.M}-${d.d} ${d.h}:${d.m}:${d.s}`
}


/**
 * This function format a date without seconds and with format separated by /
 * @param {Date} date 
 */
function formatInTime(date){
    const numberFormat = n => {
        n = n.toString();
        return n.length > 1 ? n : `0${n}`  
    };

    const currentDate = new Date();
    const d = {
        y: date.getFullYear(),
        M: numberFormat(date.getMonth()),
        d: numberFormat(date.getDate()),
        h: numberFormat(date.getHours()),
        m: numberFormat(date.getMinutes()),
        s: numberFormat(date.getSeconds())
    };

    if (d.d == currentDate.getDate() && d.M == currentDate.getMonth() && d.y == currentDate.getFullYear())
         return `Today at ${d.h}:${d.m}`;
    
    return `${d.d}/${d.M}/${d.y} ${d.h}:${d.m}`;
}


/**
 * This function be executed when you want to send a message
 */
function sendMessage(){
    const msgBox = $(".write_msg");
    const date = new Date();
    const data = {
        room: room,
        user: user,
        text: msgBox.val(),
        timeOut: formatOutTime(date),//time without seconds and other format
        timeIn: formatInTime(date)
    };

    createMessageRequest(data, () => socketSendMessage(data));

    msgBox.val("")//Rest the input field
}


/**
 * This function processData from socket or from requests
 * @param {Object} data 
 */
function processSocketData(data){
    clearMessageContainer();

    data.forEach(row => renderMessage({
        id: row.id,
        userId: row.userId,
        text: row.text,
        timeOut: formatOutTime(new Date(row.date)),
        timeIn: formatInTime(new Date(row.date))
    }));

    gotoToLastItem()
}


/**
 * This function register a listener when you click the trash button
 * @param {Object} bind 
 */
function deleteMessageListener(bind){
    $(`#${bind.id}-btn`).on('click', e =>  deleteMessageRequest(bind, () => 
        $(`#${bind.id}`).fadeOut(350, () => {
            socketSendRefresh({room: room});
            $(this).remove()
        })
    ))
}


/**
 * This function get Username from localStorage
 * @param {Object} bind userId
 */
function getUserNameFromCache(bind){
    let username = localStorage.getItem(bind.userId);

    if (isNull(username)) resolveUserNameRequest(bind, e => {
        username = e.responseText;
        
        localStorage.setItem(bind.userId, username)
        $(`#${bind.userId}.incoming_msg b`).text(username)
    })
    else $(`#${bind.userId}.incoming_msg b`).text(username)    
}


/** REQUESTS **/

function createMessageRequest(bind, callback){
    new Request(`${webURI}/api/create-message?chatName=${room}&text=${bind.text}&time=${bind.timeOut}`, "GET", e => {
        if (e.responseText == "Ok!" || e.status == 200) callback()
        else throwErr(e.responseText)
    }, `chatName=${room}&text=${bind.text}&time=${bind.time}`)
}


function deleteMessageRequest(bind, callback){
    new Request(`${webURI}/api/delete-message?id=${bind.id}`, "POST", e => {
        if (e.responseText == "Ok!" || e.status == 200) callback()
        else throwErr(e.responseText)
    }, `id=${bind.id}`)
}


function getMessagesFromThisChatRequest(){
    new Request(`${webURI}/api/get-messages?chatName=${room}`, "GET", e => {
        if (e.status == 200){
            const json = JSON.parse(e.responseText);

            processSocketData(json);

            socketOnRefresh(data => processSocketData(data));
            socketOnGetMessage(data => processSocketData(data))
        }
        else throwErr(e.responseText)
    }, `chatName=${room}`)
}


function resolveUserNameRequest(bind, callback){
    new Request(`${webURI}/api/get-username?id=${bind.userId}`, "GET", e => {
        if (e.status == 200) callback(e);
        else throwErr(e.responseText)
    }, `id=${bind.userId}`)
}


/** METHODS **/

$(document).ready(() => {
    responsive();
    initIo();
    
    getMessagesFromThisChatRequest()
});


/** METHODS **/

$(".type_msg form").on('submit', e => e.preventDefault());