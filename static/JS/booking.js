const attraction_title = document.querySelector(".attraction_title");
const date = document.querySelector(".date");
const price = document.querySelector(".price");
const address = document.querySelector(".address");
const attraction_img = document.querySelector(".attraction_img");
const time = document.querySelector(".time");
const main = document.querySelector("main");
const booking_info = document.querySelector(".booking_info");
const contact = document.querySelector(".contact");
const payment = document.querySelector(".payment");
const checkPay = document.querySelector(".checkPay");
const no_booking = document.querySelector(".no_booking");
const footer = document.querySelector("footer");
const welcome_text = document.querySelector(".welcome_text");
const name = document.getElementById("name");
const email = document.getElementById("email");
const total_price = document.querySelector(".total_price");

window.onload = function(){ 
    fetch("/api/user/auth",{
        method: "GET",
        headers:{"Content-Type":"application/json"}
    }).then((res)=>{
        return res.json();
    }).then((res)=>{
        if(res.data){
            user_name = res.data.name;
            user_email = res.data.email;

            bookingInfo();
            topLinkChange(res);

            isLogin = true;
        }else{
            document.location.href="/";

            isLogin = false;
        }
    })
}

function bookingInfo(){
    fetch("/api/booking",{
        method: "GET",
        headers:{"Content-Type":"application/json"}
    })
    .then((res)=>{
        return res.json();
    })
    .then((res)=>{
        if(!res.data){
            noBooking(res);
        }else{
            getBooking(res);
        }
    })
};

// ----- delete button -----
const delete_button = document.querySelector(".delete_button");
const check_delete_box = document.querySelector(".check_delete_box");
const check_button = document.querySelector(".check_button");
const checked = document.querySelector(".checked");
const cancel = document.querySelector(".cancel");
const title = document.querySelector(".title");
const check_delete_close_button = document.querySelector(".check_delete_close_button");

delete_button.addEventListener("click", ()=>{
    check_delete_box.style.display = "grid";
    check_delete_box.classList.add("appear");
});

// ----- checked delete -----
checked.addEventListener("click", ()=>{
    fetch("/api/booking",{
        method: "DELETE",
        headers:{"Content-Type":"application/json"}
    })
    .then((res)=>{
        return res.json();
    })
    .then((res)=>{
        if(res.ok){
            main.style.display = "none";
            
            check_button.style.display = "none";
            title.textContent = "訂單已刪除";
            setTimeout(()=>{
                check_delete_box.style.display = "none";
            }, 1500)
            noBooking(res);
        }
    })
    
})

// ----- canceled delete -----
cancel.addEventListener("click", ()=>{
    check_delete_box.style.display = "none";
})

// ----- close delete button ------
check_delete_close_button.addEventListener("click", ()=>{
    check_delete_box.style.display = "none";
})


function getBooking(res){
    main.style.display = "grid";
    const attraction_info = res.data.attraction;

    attraction_img.src = attraction_info.images;
    attraction_title.innerHTML = `台北一日遊：${attraction_info.name}`;
    date.textContent = res.data.date;
    price.textContent = `新台幣 ${res.data.price} 元`;
    address.textContent = attraction_info.address;
    welcome_text.innerHTML = `您好，${user_name}，待預訂的行程如下：`;
    if(attraction_info.time === "morning"){
        time.textContent = "早上 9 點到下午 4 點";
    }else{
        time.textContent = "下午 4 點到晚上 10 點";
    }
    email.value = user_email;
    name.value = user_name;
    total_price.innerHTML = `總價：新台幣 ${res.data.price} 元`;
};

function noBooking(res){
    const root = document.querySelector("#root");

    const new_main = document.createElement("main");
    new_main.classList.add("new_main");
    root.insertBefore(new_main, footer);

    const new_welcome = document.createElement("div");
    new_main.appendChild(new_welcome);

    const new_welcome_text = document.createElement("div");
    new_welcome_text.classList.add("new_welcome_text");
    new_welcome.appendChild(new_welcome_text);
    new_welcome_text.textContent = `您好，${user_name}，待預訂的行程如下：`;

    const shoppingCart = document.createElement("img");
    shoppingCart.src = "/images/shopping-cart.png";
    shoppingCart.setAttribute("class", "shoppingCart");
    new_main.appendChild(shoppingCart);

    const no_booking_text = document.createElement("div");
    no_booking_text.classList.add("no_booking");
    no_booking_text.textContent = "目前沒有任何待預訂的行程";
    new_main.appendChild(no_booking_text);

    const going_button = document.createElement("button");
    going_button.textContent = "前往探索美麗台北"
    going_button.setAttribute("class", "going_button");
    new_main.appendChild(going_button);

    going_button.addEventListener("click", ()=>{
        document.location.href="/";
    })

    footer.classList.add("footerLayout");
};