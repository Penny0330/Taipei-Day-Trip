let login_button = document.querySelector(".top_link_login");
let overlay = document.querySelector(".overlay");
let signIn = document.querySelector(".signIn");
let close_button = document.querySelectorAll(".login_icon_close");
signIn_close_button = close_button[0];
signUp_close_button = close_button[1];
let signIn_message = document.querySelector(".signIn_message");
let signUp = document.querySelector(".signUp");
let signUp_message = document.querySelector(".signUp_message")

login_button.addEventListener("click", ()=>{
    signIn.style.display = "block";
    overlay.style.display = "block";
});

signIn_close_button.addEventListener("click", ()=>{
    signIn.style.display = "none";
    overlay.style.display = "none";
});

signIn_message.addEventListener("click", ()=>{
    signIn.style.display = "none";
    signUp.style.display = "block";
});

signUp_message.addEventListener("click", ()=>{
    signUp.style.display = "none";
    signIn.style.display = "block";
});

signUp_close_button.addEventListener("click", ()=>{
    signUp.style.display = "none";
    overlay.style.display = "none";
});