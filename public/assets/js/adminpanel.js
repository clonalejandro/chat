/** MAIN VARS **/

var currentUser;
var autoCompleteUsers;
var users = new Array();
const ranks = [{ id: 0, name: "USER" }, { id: 1, name: "MODERATOR" }, { id: 2, name: "ADMINISTRATOR" }];
const webURI = `${window.location.protocol}//${window.location.host}`;


/** OBJECTS **/

const Controlls = {
    container: $(".controlls"),
    hidden: false,
    show: () => {
        Controlls.hidden = false;
        Controlls.container.removeClass("hide");
        Controlls.container.removeClass("hidden")
    },
    hide: () => {
        Controlls.hidden = true;
        Controlls.container.addClass("hidden");
        setTimeout(() => Controlls.container.addClass("hide"), 250)
    }
};

const BackButton = {
    button: $("#back"),
    hidden: true,
    show: () => {
        BackButton.hidden = false;
        BackButton.button.removeClass("hide");
        BackButton.button.removeClass("hidden")
    },
    hide: () => {
        BackButton.hidden = true;
        BackButton.button.addClass("hidden");
        setTimeout(() => BackButton.button.addClass("hide"), 250)
    }
};

const UsersContainer = {
    container: $("#users"),
    hidden: true,
    clear: () => UsersContainer.container.html(""),
    show: () => {
        UsersContainer.hidden = false;
        UsersContainer.container.removeClass("hide");
        UsersContainer.container.removeClass("hidden")
    },
    hide: () => {
        UsersContainer.hidden = true;
        UsersContainer.container.addClass("hidden");
        setTimeout(() => UsersContainer.container.addClass("hide"), 250)
    }
};

const RankContainer = {
    container: $("#ranks"),
    hidden: true,
    clear: () => RankContainer.container.html(""),
    show: () => {
        RankContainer.hidden = false;
        RankContainer.container.removeClass("hide");
        RankContainer.container.removeClass("hidden")
    },
    hide: () => {
        RankContainer.hidden = true;
        RankContainer.container.addClass("hidden");
        setTimeout(() => RankContainer.container.addClass("hide"), 250)
    }
};

const UnbanUsersContainer = {
    container: $("#unbanUsers"),
    hidden: true,
    clear: () => UnbanUsersContainer.container.html(""),
    show: () => {
        UnbanUsersContainer.hidden = false;
        UnbanUsersContainer.container.removeClass("hide");
        UnbanUsersContainer.container.removeClass("hidden");
    },
    hide: () => {
        UnbanUsersContainer.hidden = true;
        UnbanUsersContainer.container.addClass("hidden");
        setTimeout(() => UnbanUsersContainer.container.addClass("hide"), 250)
    }
};


/** FUNCTIONS **/

/**
 * This function build a badge html per rankId
 * @param {Object} bind 
 * @return {String} htmlBadge
 */
function buildBadgeByRank(bind){
    switch (bind.rankId){
        case 0:
            return "<span class='badge badge-secondary'>User</span>"
        case 1:
            return "<span class='badge badge-info'>Mod</span>"
        case 2:
            return "<span class='badge badge-danger'>Admin</span>"
    }
}


/**
 * This function resolve a rank from name
 * @param {String} rankName 
 * @param {Object} rank
 */
function resolveRank(rankName){
    var result;

    ranks.forEach(rank => {
        if (rank.name == rankName){
            result = rank;
            return
        }
    })

    return result
}


/**
 * This function changes the rank of the user
 */
function changeRank(){
    const bind = {
        username: $("input[name='r_username']").val(),
        rankId: resolveRank(
            $("#ranks select").val().toUpperCase()
        ).id
    };
    
    updateRankRequest(bind, () => {
        $("#notifications").append(`
            <div data-timeout="5" class="alert alert-dimissible alert-info">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Success!</strong><br> Updating the rank of this user: <i>${bind.username}</i>
            </div>
        `);

        getAllUsersRequest(users => {
            UsersContainer.clear();
            users.forEach(renderUsers)
        });//Update the rank in the all users list
    
        getAllUsersBannedRequest(users => {
            UnbanUsersContainer.clear();
            users.forEach(renderUnbanUsers)
        });//Update the rank in the all users banned list

        alertTimeout();//For clear the notifications in time

        $("#ranks form")[0].reset()//Reset the form
    })
}


/**
 * This function render the users in the html
 * @param {Object} bind 
 */
function renderUsers(bind){
    const container = $("#users");

    container.append(`
        <div id="${bind.id}" class="user ban">
            <div class="header">
                <img src="https://i.imgur.com/ElM6QDb.png" alt="user"/>
                <p>
                    ${bind.username} 
                    ${buildBadgeByRank(bind)}
                    <span class="${bind.status}"></span> 
                </p>
            </div>
            <div class="body">
                <button class="btn btn-warning btn-sm ban"><i class="fa fa-ban"></i></button>
                <button class="btn btn-danger btn-sm remove"><i class="fa fa-trash"></i></button>
            </div>
        </div>
    `);

    registerUserControlListener(bind);
}


/**
 * This function render the users banned in the html
 * @param {Object} bind 
 */
function renderUnbanUsers(bind){
    const container = $("#unbanUsers");

    container.append(`
        <div id="${bind.id}" class="user unban">
            <div class="header">
                <img src="https://i.imgur.com/ElM6QDb.png" alt="user"/>
                <p>
                    ${bind.username} 
                    ${buildBadgeByRank(bind)}
                    <span class="${bind.status}"></span> 
                </p>
            </div>
            <div class="body">
                <button class="btn btn-primary btn-sm unban"><i class="fa fa-check"></i></button>
            </div>
        </div>
    `);

    registerUnbanUserListener(bind);
}


/**
 * This function register user control listeners
 * @param {Object} bind 
 */
function registerUserControlListener(bind){
    $(`#${bind.id}.ban .ban`).on('click', () => {
        const modal = $("#modalBanUser");
        const modalBody = $("#modalBanUser .modal-body");

        currentUser = bind;

        modalBody.html(modalBody.html().replace("%username%", bind.username));
        modal.fadeIn(300, () => modal.modal('show'))
    });

    $(`#${bind.id}.ban .remove`).on('click', () => {
        const modal = $("#modalDeleteUser");
        const modalBody = $("#modalDeleteUser .modal-body");

        currentUser = bind;

        modalBody.html(modalBody.html().replace("%username%", bind.username));
        modal.fadeIn(300, () => modal.modal('show'))
    });

    $("#modalDeleteUser button.delete").unbind().on('click', () => deleteUserRequest(() => {
        $("#modalDeleteUser").modal('hide');
        $(`#${currentUser.id}.ban`).fadeOut(300, () => $(this).remove());

        $("#notifications").append(`
            <div data-timeout="5" class="alert alert-dimissible alert-info">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Success!</strong><br> Deleting this user: <i>${currentUser.username}</i>
            </div>
        `);

        alertTimeout()//For clear the notifications in time
    }));

    $("#modalBanUser button.ban").unbind().on('click', () => banUserRequest(() => {
        $("#modalBanUser").modal('hide');
        $(`#${currentUser.id}.ban`).fadeOut(300, () => $(this).remove());

        $("#notifications").append(`
            <div data-timeout="5" class="alert alert-dimissible alert-info">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Success!</strong><br> Banning this user: <i>${currentUser.username}</i>
            </div>
        `);
    
        getAllUsersBannedRequest(users => {
            UnbanUsersContainer.clear();
            users.forEach(renderUnbanUsers)
        });//Rebuild the users banned list

        alertTimeout()//For clear the notifications in time
    }))
}


/**
 * This function register unban control listeners
 * @param {Object} bind 
 */
function registerUnbanUserListener(bind){
    $(`#${bind.id}.unban .unban`).on('click', () => {
        const modal = $("#modalUnbanUser");
        const modalBody = $("#modalUnbanUser .modal-body");

        currentUser = bind;

        modalBody.html(modalBody.html().replace("%username%", bind.username));
        modal.fadeIn(300, () => modal.modal('show'))
    });
    
    $("#modalUnbanUser button.unban").unbind().on('click', () => unbanUserRequest(() => {
        $("#modalUnbanUser").modal('hide');
        $(`#${currentUser.id}.unban`).fadeOut(300, () => $(this).remove());

        $("#notifications").append(`
            <div data-timeout="5" class="alert alert-dimissible alert-info">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Success!</strong><br> Unban this user: <i>${currentUser.username}</i>
            </div>
        `);

        getAllUsersRequest(users => {
            UsersContainer.clear();
            users.forEach(renderUsers)
        });//Rebuild the normal users list

        alertTimeout()//For clear the notifications in time
    }));
}


/** REQUESTS **/

function getAllUsersRequest(callback){
    new Request(`${webURI}/api/get-all-users-without-ban`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") {
            const json = JSON.parse(e.response);
            users = new Array();

            json.map((user, i) => {
                users.push(user.username)
                getUserStatus(user, status => json[i].status = status)//Build the user status
            });
            
            setTimeout(() => callback(json), 250)

            //Prepare the users array for the autocomplete
            autoCompleteUsers = (isNull(autoCompleteUsers) 
                ? new AutoComplete("#ranks input[name='r_username']", users, () => autoCompleteUsers.clearContainer()) 
                : autoCompleteUsers
            );
            
        }
        else throwErr(e.responseText)
    })
}


async function getUserStatus(user, callback){
    return await new Request(`${webURI}/api/user-is-online?username=${user.username}`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") callback(e.responseText);
        else throwErr(e.responseText)
    }, `username=${user.username}`)
}


function getAllUsersBannedRequest(callback){
    new Request(`${webURI}/api/get-users-banned`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") {
            const json = JSON.parse(e.response);

            json.map((user, i) => {
                getUserStatus(user, status => json[i].status = status)//Build the user status
            });

            setTimeout(() => callback(json), 250)
        }
        else throwErr(e.responseText)
    })
}


function updateRankRequest(bind, callback){
    new Request(`${webURI}/api/update-rank-user?username=${bind.username}&rankId=${bind.rankId}`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") callback();
        else throwErr(e.responseText)
    }, `username=${bind.username}&rankId=${bind.rankId}`)
}


function deleteUserRequest(callback){
    new Request(`${webURI}/api/delete-user?id=${currentUser.id}`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") callback();
        else throwErr(e.responseText)
    }, `id=${currentUser.id}`)
}


function banUserRequest(callback){
    new Request(`${webURI}/api/ban-user?userId=${currentUser.id}`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") callback();
        else throwErr(e.responseText)
    }, `userId=${currentUser.id}`)
}


function unbanUserRequest(callback){
    new Request(`${webURI}/api/unban-user?userId=${currentUser.id}`, "GET", e => {
        if (e.status == 200 || e.responseText == "Ok!") callback();
        else throwErr(e.responseText)
    }, `userId=${currentUser.id}`)
}


/** METHODS **/

$(document).ready(() => {
    getAllUsersRequest(users => {
        UsersContainer.clear();
        users.forEach(renderUsers)
    });

    getAllUsersBannedRequest(users => {
        UnbanUsersContainer.clear();
        users.forEach(renderUnbanUsers)
    });
});

$("#banControll").on('click', () => {
    Controlls.hide();
    BackButton.show();
    UsersContainer.show();
});

$("#rankControll").on('click', () => {
    Controlls.hide();
    BackButton.show();
    RankContainer.show();
});

$("#unbanControll").on('click', () => {
    Controlls.hide();
    BackButton.show();
    UnbanUsersContainer.show();
});

$("#back").on('click', () => {
    BackButton.hide();
    
    if (!UsersContainer.hidden) UsersContainer.hide();
    else if (!UnbanUsersContainer.hidden) UnbanUsersContainer.hide();
    else RankContainer.hide();

    Controlls.show();
});

$("#ranks form").on('submit', e => e.preventDefault());