const loginBtn =
document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

    const username =
    document.getElementById("username").value;

    const password =
    document.getElementById("password").value;

    if(
        username === "admin" &&
        password === "admin123"
    ){

        localStorage.setItem(
            "isLoggedIn",
            "true"
        );

        window.location.href =
        "index.html";

    }else{

        document.getElementById("error")
        .textContent =
        "Invalid Username or Password";
    }

});