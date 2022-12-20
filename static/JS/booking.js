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
const contact_name_input = document.getElementById("contact_name_input");
const contact_email_input = document.getElementById("contact_email_input");
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


let totalPrice;
let attraction_id;
let attraction_name;
let attraction_address;
let attraction_image;
let booking_date;
let booking_time;

function getBooking(res){
    main.style.display = "grid";
    const attraction_info = res.data.attraction;

    attraction_img.src = attraction_info.images;
    attraction_title.innerHTML = `台北一日遊：${attraction_info.name}`;
    date.textContent = res.data.date;
    price.textContent = `新台幣 ${res.data.price} 元`;
    address.textContent = attraction_info.address;
    welcome_text.innerHTML = `您好，${user_name}，待預訂的行程如下：`;
    if(res.data.time === "morning"){
        time.textContent = "早上 9 點到下午 4 點";
    }else{
        time.textContent = "下午 4 點到晚上 10 點";
    }
    contact_email_input.value = user_email;
    contact_name_input.value = user_name;
    total_price.innerHTML = `總價：新台幣 ${res.data.price} 元`;

    totalPrice = res.data.price;
    attraction_id = attraction_info.id;
    attraction_name = attraction_info.name;
    attraction_address = attraction_info.address;
    attraction_image = attraction_info.images;
    booking_date = res.data.date;
    booking_time = res.data.time;
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


let checkName = true;
let checkEmail = true;
let checkTel;
// ----- name regex -----
const contact_name_message = document.querySelector(".contact_name_message");
const checkPay_button = document.querySelector(".checkPay_button");

contact_name_input.addEventListener("input", ()=>{
    checkName = true;
    if(!contact_name_input.value){
        contact_name_message.textContent = "請輸入聯絡姓名";
        checkName = false;
    }else{
        if(contact_name_input.value.length < 1 || contact_name_input.value.length > 8){
            contact_name_message.textContent = "須介於1-8個字元";
            checkName = false;
        }
        else{
            contact_name_message.textContent = "";
            checkName = true;
        }
    }

    return checkName
});

// ----- email regex -----
const contact_email_message = document.querySelector(".contact_email_message");

contact_email_input.addEventListener("change", ()=>{
    checkEmail = true;
    if(!contact_email_input.value){
        contact_email_message.textContent = "請輸入電子信箱";
        checkEmail = false;
    }else{
        let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        if(!reg.test(contact_email_input.value)){
            contact_email_message.textContent = "電子信箱格式錯誤";
            checkEmail = false;
        }else{
            contact_email_message.textContent = "";
            checkEmail = true;
        }
    }

    return checkEmail;
});

// ----- tel regex -----
const contact_tel_input = document.getElementById("contact_tel_input");
const contact_tel_message = document.querySelector(".contact_tel_message");

contact_tel_input.addEventListener("change", ()=>{
    checkTel = false;
    if(!contact_tel_input.value){
        contact_tel_message.textContent = "請輸入手機號碼";
        checkTel = false;
    }else{
        let reg = /09\d{2}(\d{6}|-\d{3}-\d{3})/;
        if(!reg.test(contact_tel_input.value)){
            contact_tel_message.textContent = "手機號碼格式錯誤";
            checkTel = false;
        }else{
            contact_tel_message.textContent = "";
            checkTel = true;
        }
    }

    return checkTel
});


// TapPay
TPDirect.setupSDK(126851, 'app_6vEk2OsAENqVWnjTewPdyElIIKrF4D35fBs799t6fe2uuvwL6IM0Jzl7wl3m', 'sandbox');

let fields = {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "ccv",
    },
  };

TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        input: {
            "font-size": "16px",
            color: "gray",
        },
        // style focus state
        ":focus": {
        color: "#337788",
        },
        // style valid state
        ".valid": {
        color: "#448899",
        },
        // style invalid state
        ".invalid": {
        color: "IndianRed",
        },
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
});

const check_message_box = document.querySelector(".check_message_box");
const check_message_title = document.querySelector(".check_message_title");

checkPay_button.addEventListener("click", ()=>{
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    if(checkName && checkEmail && checkTel){
        // 確認是否可以 getPrime
        if (tappayStatus.canGetPrime === false) {
            appear_message();
            check_message_title.textContent = "信用卡資料填寫不正確";
            return
    }
    }else{
        if(!contact_tel_input.value){
            contact_tel_message.textContent = "請輸入手機號碼";
            appear_message();
            check_message_title.textContent = "聯絡資料填寫不正確";
            return
        }
        appear_message();
        check_message_title.textContent = "聯絡資料填寫不正確";
        return
    };

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            appear_message();
        check_message_title.textContent = "付款失敗";
        return
        }
        
        fetch("/api/orders", {
            method: "POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({"prime":result.card.prime,
                                "order":{
                                    "price": totalPrice,
                                    "trip":{
                                        "attraction":{
                                            "id": attraction_id,
                                            "name": attraction_name,
                                            "address": attraction_address,
                                            "image": attraction_image
                                        },
                                        "date": booking_date,
                                        "time": booking_time
                                    },
                                    "contact":{
                                        "name": contact_name_input.value,
                                        "email": contact_email_input.value,
                                        "phone": contact_tel_input.value
                                    }

                                }
                            })
        }).then((res)=>{
            return res.json()
        }).then((res)=>{
            console.log(res.data.payment.status)
            if(res.data.payment.status === 0){
                document.location.href="/thankyou?number=" + res.data.number;
            }else{
                appear_message();
                check_message_title.textContent = "付款失敗";
            }
        })
    })
});

function appear_message(){
    check_message_box.style.display = "grid";
    check_message_box.classList.add("appear");
}


const check_message_close_button = document.querySelector(".check_message_close_button");
check_message_close_button.addEventListener("click", ()=>{
    check_message_box.style.display = "none";
})
