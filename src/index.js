const userLog = [];
const addGameDetails = (info) => {
    //make sure it doesn't get a user whose already on the page
    let newContainer = document.createElement("div");
    const classValues = ["row", "panel", "panel-default", "twitch-preview"];
    newContainer.classList.add(...classValues);

    newContainer.innerHTML = `<h2>${info.title}</h2><h3>USER: ${info.user_name}</h3><img src=${info.thumbnail_url}><p>VIEWER COUNT: ${info.viewer_count}</p>`+
     "<button class='remove'>Remove this</button>";

    document.querySelector("main").prepend(newContainer);
    newContainer.querySelector(".remove").addEventListener("click", function () {
        newContainer.parentNode.removeChild(newContainer);
    });
    userLog.push(info.user_name.toLowerCase());

};
//Note: to get the authorization first required a post request using my api client_id and client_secret(generated by Twitch)
//The post response returned the authorization token which is used below
//It would be possible to make the post request here as well, but it was done in postman, prior to this part
const twitchCall = (url = "") => {
    return $.ajax({
        url: "https://api.twitch.tv/helix/streams" + url,
        headers: {
            "Authorization": "Bearer",
            "Client-ID": ""
        }
    });
}
const getTopFive = () => {
    twitchCall().then(function (res) {
        let results = res.data.slice(0, 5);
        let displayDetails = results.map((result) => {
            result.thumbnail_url = result.thumbnail_url.replace(/{height}/, "100")
                .replace(/{width}/, "100");
            return result;

        });
        displayDetails.forEach(addGameDetails);

    }).catch(function (err) {
        console.log(err);
    });
}

const getUser = () => {
    //OgamingSC2
    let user = document.getElementById("search")
        .value.toLowerCase();
    let urlAddon = "?user_login=" + user;
    new Promise(function (resolve, reject) {
        if (userLog.indexOf(user) === -1) {
            resolve();
        } else {
            reject();
        }
    }).then(function () {
        return twitchCall(urlAddon);
    }).then(data => {
        let formattedData = data["data"][0];
        formattedData.thumbnail_url = formattedData.thumbnail_url.replace(/{height}/, "100")
            .replace(/{width}/, "100");
        addGameDetails(formattedData);
    }).catch(err => {
        console.log(err);
    });
    document.getElementById("search")
        .value = "";
}

getTopFive();
document.getElementById("user-search").addEventListener("click", getUser);
document.getElementById("refresh").addEventListener("click", () => {
    document.querySelector("main").innerHTML = "";
    getTopFive();
});
