const change_name_button = document.querySelector(".change_name_button");
const change_password_button = document.querySelector(".change_password_button");

init();
 
function init(){
    fetch("/api/user/auth",{
        method: "GET",
        headers:{"Content-Type":"application/json"}
    }).then((res)=>{
        return res.json();
    }).then((res)=>{
        if(res.data){

            isLogin = true;

        }else{
            document.location.href="/";

            isLogin = false;
        }
    })
} ;


// ----- new name -----
const new_name = document.getElementById("new_name");
const change_name_message = document.querySelector(".change_name_message");

change_name_button.addEventListener("click", ()=>{
    
    if(new_name.value){
        if(new_name.value.length > 0 && new_name.value.length < 9){
            changeName();
            setTimeout(()=>{
                window.location.reload(); 
            }, 1000);
        }else{
            change_name_message.textContent = "須介於1-8個字元";
            setTimeout(()=>{
                change_name_message.textContent = ""; 
            }, 1000);
        }
    }else{
        change_name_message.textContent = "請輸入新名字";
        setTimeout(()=>{
            change_name_message.textContent = ""; 
        }, 1000);
    }
});

async function changeName(){
    const response = await fetch("/api/member/name",{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            "name": new_name.value
        })
    });
    const result = await response.json();

    if(result.data){
        change_name_message.textContent = result.message;
    }else{
        change_name_message.textContent = result.message;
    }
};

// ----- new password -----
const old_password = document.getElementById("old_password");
const new_password = document.getElementById("new_password");
const renew_password = document.getElementById("renew_password");
const change_password_message = document.querySelector(".change_password_message");

change_password_button.addEventListener("click", ()=>{
    
    if(old_password.value && new_password.value && renew_password.value){
        if((old_password.value.length > 5 && old_password.value.length < 11) && (new_password.value.length > 5 && new_password.value.length < 11) && (renew_password.value.length > 5 && renew_password.value.length < 11)){
            if(new_password.value === renew_password.value){
                changePassword();
                setTimeout(()=>{
                    window.location.reload(); 
                }, 1000);
                return
            }
            change_password_message.textContent = "新密碼輸入不一致";
        }
        else{
            change_password_message.textContent = "密碼須介於6-10個字元";
        }
    }else{
        change_password_message.textContent = "請輸入密碼";
    }

    setTimeout(()=>{
        change_password_message.textContent = ""; 
    }, 1000);
});

async function changePassword(){
    const response = await fetch("/api/member/password",{
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            "old_password": old_password.value,
            "new_password": new_password.value
        })
    });
    const result = await response.json();

    if(result.data){
        change_password_message.textContent = result.message;
    }else{
        change_password_message.textContent = result.message;
    }

    setTimeout(()=>{
        change_password_message.textContent = ""; 
    }, 1000);
};