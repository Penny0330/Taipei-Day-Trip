// ----- side_navbar -----
const side_navbar = document.querySelector(".side_navbar");
const side_link = document.querySelector(".side_link");
const side_name = document.querySelector(".side_name");
const side_link_booking = document.querySelector(".side_link_booking");
const side_link_login = document.querySelector(".side_link_login");
const side_link_logout = document.querySelector(".side_link_logout");
const side_logo = document.querySelector(".side_logo");

side_logo.addEventListener("click", ()=>{
    side_link.classList.toggle("side_link_open");
});

// ----- check status -----
const top_link_logout = document.querySelector(".top_link_logout");
const top_link_login = document.querySelector(".top_link_login");
let top_name = document.querySelector(".top_name");

let isLogin = false;

window.onload = function(){
    fetch("/api/user/auth",{
        method: "GET",
        headers:{"Content-Type":"application/json"}
    }).then((res)=>{
        return res.json();
    }).then((res)=>{

        if(res.data){
            topLinkChange(res);

            isLogin = true;
        }else{
            isLogin = false;
            return
        }
    })
};

function topLinkChange(res){
    top_link_login.style.display = "none";
    top_link_logout.style.display = "block";
    top_name.innerHTML = `${res.data.name}，您好`;
    
    side_link_login.style.display = "none";
    side_link_logout.innerHTML = "登出系統";
    side_name.innerHTML = `${res.data.name}，您好`;
}



// ----- open signIn box -----
const login_button = document.querySelector(".top_link_login");
const signIn = document.querySelector(".signIn");
const overlay = document.querySelector(".overlay");

login_button.addEventListener("click", ()=>{
    signIn.style.display = "block";
    signIn.classList.add("appear");
    overlay.style.display = "block";
});

side_link_login.addEventListener("click", ()=>{
    signIn.style.display = "block";
    signIn.classList.add("appear");
    overlay.style.display = "block";
});

// ----- close button -----
const close_button = document.querySelectorAll(".login_icon_close");
const signIn_close_button = close_button[0];
const signUp_close_button = close_button[1];

const signUp = document.querySelector(".signUp");

const signIn_email = document.querySelector(".signIn_email");
const signIn_password = document.querySelector(".signIn_password");
const signUp_name = document.querySelector(".signUp_name");
const signUp_email = document.querySelector(".signUp_email");
const signUp_password = document.querySelector(".signUp_password");

const signIn_response_message = document.querySelector(".signIn_response_message");
const signUp_response_message = document.querySelector(".signUp_response_message");


signIn_close_button.addEventListener("click", ()=>{
    signIn.style.display = "none";
    overlay.style.display = "none";
});

signUp_close_button.addEventListener("click", ()=>{
    signUp.style.display = "none";
    overlay.style.display = "none";
});

// ----- signIn / signUp change -----
const signIn_change_message = document.querySelector(".signIn_change_message");
const signUp_change_message = document.querySelector(".signUp_change_message");

signIn_change_message.addEventListener("click", ()=>{
    signIn.style.display = "none";
    signUp.style.display = "block";
    signIn.classList.remove("appear");
});

signUp_change_message.addEventListener("click", ()=>{
    signUp.style.display = "none";
    signIn.style.display = "block";
});


// ----- password eyes -----
const eye_signIn = document.getElementById("eye_signIn");

eye_signIn.addEventListener("click", (e)=>{
    let eye = e.target;
    if(eye.classList.contains("fa-eye")){
        eye.classList.remove("fa-eye");
        eye.classList.add("fa-eye-slash");
        signIn_password.setAttribute("type", "text");
    }else{
        eye.classList.add("fa-eye");
        eye.classList.remove("fa-eye-slash");
        signIn_password.setAttribute("type", "password");
    }
});

const eye_signUp = document.getElementById("eye_signUp");

eye_signUp.addEventListener("click", (e)=>{
    let eye = e.target;
    if(eye.classList.contains("fa-eye")){
        eye.classList.remove("fa-eye");
        eye.classList.add("fa-eye-slash");
        signUp_password.setAttribute("type", "text");
    }else{
        eye.classList.add("fa-eye");
        eye.classList.remove("fa-eye-slash");
        signUp_password.setAttribute("type", "password");
    }
});

// ----- signup button -----
let checkName_signUp;
let checkEmail_signUp;
let checkPassword_signUp;
const signUp_name_message = document.querySelector(".signUp_name_message");
const signUp_email_message = document.querySelector(".signUp_email_message");
const signUp_password_message = document.querySelector(".signUp_password_message");
const signUp_button = document.querySelector(".signUp_button");

signUp_button.classList.add("invalid");

function open_signUp_button(){
    signUp_button.classList.remove("invalid");
    signUp_button.classList.add("valid");
    signUp_button.disabled = false;
}

function close_signUp_button(){
    signUp_button.classList.add("invalid");
    signUp_button.classList.remove("valid");
    signUp_button.disabled = true;
}

signUp_name.addEventListener("input", ()=>{
    checkName_signUp = false;

    if(signUp_name.value == ""){
        signUp_name_message.innerHTML = "請輸入姓名";
        signUp_name.style.border = "1px solid rgba(204, 92, 92, 0.9)";    
        checkName_signUp = false;
    }else{
        if(signUp_name.value.length < 1 || signUp_name.value.length > 8){
            signUp_name_message.innerHTML = "須介於1-8個字元";
            signUp_name.style.border = "1px solid rgba(204, 92, 92, 0.9)";
            checkName_signUp = false;
        }
        else{
            signUp_name_message.innerHTML = "";
            signUp_name.style.border = "1px solid #cccccc";
            checkName_signUp = true;
        }
    }

    if(checkName_signUp && checkEmail_signUp && checkPassword_signUp){
        open_signUp_button()
    }else{
        close_signUp_button()
    }

    return checkName_signUp;
});


signUp_email.addEventListener("input", ()=>{
    checkEmail_signUp = false;

    if(signUp_email.value == ""){
        signUp_email_message.innerHTML = "請輸入電子信箱";
        signUp_email.style.border = "1px solid rgba(204, 92, 92, 0.9)";
        checkEmail_signUp = false;
    }else{
        let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        if(!reg.test(signUp_email.value)){
            signUp_email_message.innerHTML = "電子信箱格式錯誤";
            signUp_email.style.border = "1px solid rgba(204, 92, 92, 0.9)";
            checkEmail_signUp = false;
        }else{
            signUp_email_message.innerHTML = "";
            signUp_email.style.border = "1px solid #cccccc";
            checkEmail_signUp = true;
        }
    }

    if(checkName_signUp && checkEmail_signUp && checkPassword_signUp){
        open_signUp_button()
    }else{
        close_signUp_button()
    }

    return checkEmail_signUp;
});

signUp_password.addEventListener("input", ()=>{
    checkPassword_signUp = false;

    if(signUp_password.value == ""){
        signUp_password_message.innerHTML = "請輸入密碼";
        signUp_password.style.border = "1px solid rgba(204, 92, 92, 0.9)";
        checkPassword_signUp = false;
    }else{
        if(signUp_password.value.length < 6 || signUp_password.value.length > 10){
            signUp_password_message.innerHTML = "須介於6-10個字元";
            signUp_password.style.border = "1px solid rgba(204, 92, 92, 0.9)";
            checkPassword_signUp = false;
        }else{
            signUp_password_message.innerHTML = "";
            signUp_password.style.border = "1px solid #cccccc";
            checkPassword_signUp = true;
        }
    }

    if(checkName_signUp && checkEmail_signUp && checkPassword_signUp){
        open_signUp_button()
    }else{
        close_signUp_button()
    }

    return checkPassword_signUp;
});
 

signUp_button.addEventListener("click", ()=>{
    fetch("/api/user", {
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"name":signUp_name.value,
                            "email":signUp_email.value,
                            "password":signUp_password.value})
    })
    .then((res)=>{
        return res.json();
    })
    .then((res)=>{
        signUp_response_message.innerHTML = res.message;
    })
    .catch((error)=>{
        signUp_response_message.innerHTML = error.message;
    })
});

// ----- signIn -----
let checkEmail_signIn;
let checkPassword_signIn;
const signIn_email_message = document.querySelector(".signIn_email_message");
const signIn_password_message = document.querySelector(".signIn_password_message");
const signIn_button = document.querySelector(".signIn_button");

signIn_button.classList.add("invalid");

function open_signIn_button(){
    signIn_button.classList.remove("invalid");
    signIn_button.classList.add("valid");
    signIn_button.disabled = false;
}

function close_signIn_button(){
    signIn_button.classList.add("invalid");
    signIn_button.classList.remove("valid");
    signIn_button.disabled = true;
}

signIn_email.addEventListener("input", ()=>{
    checkEmail_signIn = false;

    if(signIn_email.value == ""){
        signIn_email_message.innerHTML = "請輸入電子信箱";
        signIn_email.style.border = "1px solid rgba(204, 92, 92, 0.9)";
        checkEmail_signIn = false;
    }else{
        let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        if(!reg.test(signIn_email.value)){
            signIn_email_message.innerHTML = "電子信箱格式錯誤";
            signIn_email.style.border = "1px solid rgba(204, 92, 92, 0.9)";
            checkEmail_signIn = false;
        }else{
            signIn_email_message.innerHTML = "";
            signIn_email.style.border = "1px solid #cccccc";
            checkEmail_signIn = true;
        }
    }

    if(checkEmail_signIn && checkPassword_signIn){
        open_signIn_button()
    }else{
        close_signIn_button()
    }

    return checkEmail_signIn;
});

signIn_password.addEventListener("input", ()=>{
    checkPassword_signIn = false;

    if(signIn_password.value == ""){
        signIn_password_message.innerHTML = "請輸入密碼";
        signIn_password.style.border = "1px solid rgba(204, 92, 92, 0.9)";
        checkPassword_signIn = false;
    }else{
        if(signIn_password.value.length < 6 || signIn_password.value.length > 10){
            signIn_password_message.innerHTML = "須介於6-10個字元";
            signIn_password.style.border = "1px solid rgba(204, 92, 92, 0.9)";
            checkPassword_signIn = false;
        }else{
            signIn_password_message.innerHTML = "";
            signIn_password.style.border = "1px solid #cccccc";
            checkPassword_signIn = true;
        }
    }
    if(checkEmail_signIn && checkPassword_signIn){
        open_signIn_button()
    }else{
        close_signIn_button()
    }
    
    return checkPassword_signIn;
});


signIn_button.addEventListener("click", ()=>{
    fetch("/api/user/auth",{
        method: "PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"email":signIn_email.value,
                            "password":signIn_password.value})
    }).then((res)=>{
        return res.json();
    }).then((res)=>{
        if(res.error){
            signIn_response_message.innerHTML = res.message;
            return
        }
        window.location.reload();
    }).catch((err)=>{
        signIn_response_message.innerHTML = err.message;
    })
});

// ----- signOut button -----
top_link_logout.addEventListener("click", ()=>{
    fetch("/api/user/auth",{
        method: "DELETE",
        headers:{"Content-Type":"application/json"}
    }).then((res)=>{
       return res.json()
    }).then((res)=>{
        if(res.ok){
            document.location.href="/";
        }
    })
});


side_link_logout.addEventListener("click", ()=>{
    fetch("/api/user/auth",{
        method: "DELETE",
        headers:{"Content-Type":"application/json"}
    }).then((res)=>{
       return res.json()
    }).then((res)=>{
        if(res.ok){
            document.location.href="/";
        }
    })
});


// ----- nav link booking -----
const top_link_booking = document.querySelector(".top_link_booking");

top_link_booking.addEventListener("click", ()=>{
    if(isLogin){
        document.location.href="/booking";
    }else{
        signIn.style.display = "block";
        signIn.classList.add("appear");
        overlay.style.display = "block";
    }
});

side_link_booking.addEventListener("click", ()=>{
    if(isLogin){
        document.location.href="/booking";
    }else{
        signIn.style.display = "block";
        signIn.classList.add("appear");
        overlay.style.display = "block";
    }
});

// ---- nav link history -----

top_name.addEventListener("click", ()=>{
    if(isLogin){
        document.location.href="/history";
    }else{
        signIn.style.display = "block";
        signIn.classList.add("appear");
        overlay.style.display = "block";
    }
});

side_name.addEventListener("click", ()=>{
    if(isLogin){
        document.location.href="/history";
    }else{
        signIn.style.display = "block";
        signIn.classList.add("appear");
        overlay.style.display = "block";
    }
});