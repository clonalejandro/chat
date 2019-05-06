new Request("http://192.168.0.46:3000/api/create-chat?name=Home&userId=1", "POST", e => {
	console.log(e);
}, "name=Home&userId=1");


const url = "http://192.168.0.46:3000/api/create-chat?name=Home&userId=1";
    const req = new XMLHttpRequest();

    req.open("post", url, true);
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.onreadystatechange = (event) => {
        if (req.readyState === 4)
            if (req.status === 200) {
                console.log(JSON.parse(req.responseText));

            } 
            else console.error(req.statusText);
    };
    req.send("name=Home&userId=1");