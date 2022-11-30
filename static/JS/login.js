let login_button = document.querySelector(".top_link_login");
let overlay = document.querySelector(".overlay");
let signIn = document.querySelector(".signIn");
let close_button = document.querySelectorAll(".login_icon_close");
signIn_close_button = close_button[0];
signUp_close_button = close_button[1];
let signIn_message = document.querySelector(".signIn_message");
let signUp_message = document.querySelector(".signUp_message");
let signUp = document.querySelector(".signUp");
let signIn_email = document.querySelector(".signIn_email");
let signIn_password = document.querySelector(".signIn_password");
let signUp_name = document.querySelector(".signUp_name");
let signUp_email = document.querySelector(".signUp_email");
let signUp_password = document.querySelector(".signUp_password");

login_button.addEventListener("click", ()=>{
    signIn.style.display = "block";
    signIn.classList.add("appear");
    overlay.style.display = "block";
});

signIn_close_button.addEventListener("click", ()=>{
    signIn.style.display = "none";
    overlay.style.display = "none";
    signIn_email.value = "";
    signIn_password.value = "";
});

signUp_close_button.addEventListener("click", ()=>{
    signUp.style.display = "none";
    overlay.style.display = "none";
    signUp_name.value = "";
    signUp_email.value = "";
    signUp_password.value = "";
});

signIn_message.addEventListener("click", ()=>{
    signIn.style.display = "none";
    signUp.style.display = "block";
    signIn.classList.remove("appear");
    signIn_email.value = "";
    signIn_password.value = "";
});

signUp_message.addEventListener("click", ()=>{
    signUp.style.display = "none";
    signIn.style.display = "block";
    signUp_name.value = "";
    signUp_email.value = "";
    signUp_password.value = "";
});

