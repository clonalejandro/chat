/** MAIN VARS **/

const webURI = `${window.location.protocol}//${window.location.host}`;

String.prototype.replaceAll = function(charToReplace, newChar){
    let str = this;
    while (str.includes(charToReplace)) str = str.replace(charToReplace, newChar);
    return str
};


/** FUNCTIONS **/

/**
 * This function returns the document height
 * @return {Number} document height
 */
function getHeight(){
    return $(document).height()
}


/**
 * This function manage the page responsive
 */
function responsive(){
    $("#wrapper").height(getHeight());
    window.addEventListener("resize", e => responsive())//When window resize, this execute this function
}


/**
 * This function updates the profile
 */
function updateProfile(){
    const newusername = $("input[name='username']");
    const password = $("input[name='password']");

    const data = {
        newusername: newusername.val(),
        password: password.val()
    };

    updateProfileRequest(data)
}


/**
 * This function updates the password
 */
function updatePassword(){
    const currentpassword = $("input[name='currentpassword']");
    const newpassword = $("input[name='newpassword']");

    if (currentpassword == newpassword) return throwErr("The new password and the current password is equals!");

    const data = {
        currentpassword: currentpassword.val(),
        newpassword: newpassword.val()
    };

    updatePasswordRequest(data)
}


/** REQUESTS **/

function updateProfileRequest(bind){
    new Request(`${webURI}/api/update-user?password=${bind.password}&newusername=${bind.newusername}`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") window.location.href = `${webURI}/logout`;
        else throwErr(e.responseText)
    }, `password=${bind.password}&newusername=${bind.newusername}`)
}


function updatePasswordRequest(bind){
    new Request(`${webURI}/api/update-password?currentpassword=${bind.currentpassword}&newpassword=${bind.newpassword}`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") window.location.href = `${webURI}`;
        else throwErr(e.responseText)
    }, `currentpassword=${bind.currentpassword}&newpassword=${bind.newpassword}`)
}


/** METHODS **/

$(document).ready(() => responsive())


/** EVENTS **/

$("input[name='password']").on('focus', e => {
    const parent = $(e.target).parent();
    const css = JSON.stringify({
        "-webkit-box-shadow": "inset 0 -2px 0 #2196F3!important;",
        "box-shadow": "inset 0 -2px 0 #2196F3!important"
    })
    .replaceAll("\"", "")
    .replaceAll("{", "")
    .replaceAll("}", "");

    parent.attr("style", css)
});

$("input[name='currentpassword']").on('focus', e => {
    const parent = $(e.target).parent();
    const css = JSON.stringify({
        "-webkit-box-shadow": "inset 0 -2px 0 #e91e63!important;",
        "box-shadow": "inset 0 -2px 0 #e91e63!important"
    })
    .replaceAll("\"", "")
    .replaceAll("{", "")
    .replaceAll("}", "");

    parent.attr("style", css)
});

$("input[name='newpassword']").on('focus', e => {
    const parent = $(e.target).parent();
    const css = JSON.stringify({
        "-webkit-box-shadow": "inset 0 -2px 0 #e91e63!important;",
        "box-shadow": "inset 0 -2px 0 #e91e63!important"
    })
    .replaceAll("\"", "")
    .replaceAll("{", "")
    .replaceAll("}", "");

    parent.attr("style", css)
});

$("a.input-group-text").on('click', e => {
    const target = $(e.target);
    const inputPassword = target.parent().parent().find("input");

    if (target.hasClass("fa-eye")){
        target.removeClass("fa-eye");
        target.addClass("fa-eye-slash");

        inputPassword.attr("type", "password")
    }
    else if (target.hasClass("fa-eye-slash")){
        target.removeClass("fa-eye-slash");
        target.addClass("fa-eye");

        inputPassword.attr("type", "text")
    }
});

$('.collapse').on('shown.bs.collapse', () => responsive());
$(".dropdown").on('show.bs.dropdown	', () => responsive());

$("form").on('submit', e => e.preventDefault());

$("input[name='password']").focusout(() => $("#pwd").attr("style", ""));
$("input[name='currentpassword']").focusout(e => $(e.target).parent().attr("style", ""));
$("input[name='newpassword']").focusout(e => $(e.target).parent().attr("style", ""));

$("a#changePassword").on('click', 
    () => $("#modalChangePassword").fadeIn(300, () => $("#modalChangePassword").modal('show'))
);
$("#modalChangePassword button[type='submit']").on('click', () => updatePassword())