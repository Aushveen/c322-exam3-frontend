const mode = 1;

const host_local = "http://localhost:8080";
const host_remote = "https://test3-latest-7if8.onrender.com";

function getHost() {
    return (mode == 0) ? host_local : host_remote;
}

function isLoggedIn() {
    return localStorage.getItem("token") !== null;
}

function getTheToken() {
    return localStorage.getItem("token");
}

function saveTheToken(token) {
    localStorage.setItem("token", token);
    updateTheNavigationBar();
}

function removeTheToken() {
    localStorage.removeItem("token");
    updateTheNavigationBar();
}

function getHeaders() {
    let headers = {
        "Content-Type": "application/json"
    };
    if (isLoggedIn()) {
        headers["Authorization"] = `Bearer ${getTheToken()}`;
    }
    return headers;
}

let configuration = {
    isLoggedIn: () => isLoggedIn(),
    host: () => getHost(),
    token: () => getTheToken()
};

updateTheNavigationBar();

async function updateTheNavigationBar() {
    const navigation = document.getElementsByClassName("topnav")[0];
    let loginTag = navigation.children[navigation.children.length - 1];
    if (configuration.isLoggedIn()) {
        loginTag.innerHTML =
            `<li class="right"><a href="#" onclick="logout()">Logout</a></li>`;
    } else {
        loginTag.innerHTML = `<li class="right"><a href="login.html">Login</a></li>`;
    }
}

async function signup() {
    let email = document.getElementById("email").value;
    let username = document.getElementById("user").value;
    let password = document.getElementById("password").value;
    let customer = { email: email, username: username, password: password };
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
    };
    try {
        let response = await fetch(getHost() + "/register", request);
        if (response.status == 200) {
            alert("The registration was successful!");
            location.href = "login.html";
        } else {
            console.log(`response status:${response.status}`);
            alert("Something went wrong!");
        }
    } catch (error) {
        console.log(error);
        alert("Something went wrong!");
    }
}

async function login() {
    let username = document.getElementById("user").value;
    let password = document.getElementById("pass").value;
    let email = document.getElementById("email").value;
    let customer = { username: username, password: password, email: email };
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(customer)
    };
    try {
        let response = await fetch(getHost() + "/signin", request);
        if (response.status == 200) {
            alert("The login was successful!");
            const token = await response.text();
            saveTheToken(token);
            location.href = "index.html";
        } else {
            console.log(`response status:${response.status}`);
            removeTheToken();
            alert("Something went wrong!");
        }
    } catch (error) {
        console.log(error);
        removeTheToken();
        alert("Something went wrong!");
    }
}

async function logout() {
    removeTheToken();
}