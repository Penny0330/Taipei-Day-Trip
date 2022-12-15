const url_Id = location.pathname.split("/")[2];
const imgAll = document.querySelector(".imgAll");
const dotAll = document.querySelector(".dotAll");
let attractionImg;
let imgCount;
let imgData;
let images;
let dots;
let dotSpan;
let imageIndex;
let choosePrice;

getAttraction_Id(url_Id);

// ----- get data ----- 
function getAttraction_Id(url_Id){
    fetch(`/api/attraction/${url_Id}`)
    .then((res)=>{
        return res.json();
    })
    .then((result)=>{
        data = result.data;

        const headTitle = document.querySelector("title");
        headTitle.innerHTML = data.name;

        const title = document.querySelector(".title");
        title.innerHTML = data.name;

        const info = document.querySelector(".info");
        if(data.mrt == null){
            info.innerHTML = `${data.category} at 無捷運可到達`;
        }else{
            info.innerHTML = `${data.category} at ${data.mrt}`;
        }
    
        const description = document.querySelector(".description");
        description.innerHTML= data.description;

        const addressContent = document.querySelector(".addressContent");
        addressContent.innerHTML = data.address;

        const directionContent = document.querySelector(".directionContent");
        directionContent.innerHTML = data.transport;

        const map = document.querySelector(".map");
        map.src = `https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${data.address}(${data.name})&z=16&output=embed&t=`;

        imgCount = data.images.length;
        imgData = data.images;
        create_DotImg();

    })
    .catch((error)=>{
        document.querySelector(".top").innerHTML = "There appears to be some error!";
    })
};

// ----- create dot、img ----- 
const loader = document.querySelector(".loader");
const loader_text = document.querySelector(".loader_text"); 
function create_DotImg(){
    for(let i = 0; i < imgCount; i++){
        dotSpan = document.createElement("span");
        dotSpan.setAttribute("class", "dot");
        dotAll.append(dotSpan);
    }

    // image preload;
    let finishImg = 0;

    imgData.map((value, index, arr)=>{
        attractionImg = document.createElement("img");
        
        attractionImg.addEventListener("load", ()=>{
            finishImg += 1;
            if (finishImg === imgCount){
                imgAll.style.display = "block";
                dotAll.style.display = "flex";
                loader.style.display = "none"; 
            }else{
                loader.style.display = "flex";
                loader_text.textContent = `${Math.round((finishImg / arr.length) * 100)}%`;
            }
        })
        attractionImg.setAttribute("class", "attractionImg");
        attractionImg.src = value;
        imgAll.append(attractionImg);
    })
    
    
    // all dots、images
    dots = document.querySelectorAll("span");
    images = document.getElementsByClassName("attractionImg");

    // ----- initial loading -----
    imageIndex = 1;
    showImages(imageIndex);

    // ----- click the dot switch images -----
    for(let i = 0; i < dots.length; i++){
        dots[i].addEventListener("click", ()=>{
            // showImages(imageIndex = i + 1);
            showImages(imageIndex = i);
        })
    }

};

// ----- img-Arrows -----
function arrowButton(index) {
    showImages(imageIndex += index);
};


function showImages(index) {
    let i;
    
    // if currentIndex > imgCount, imageIndex back to startIndex
    if (index > imgCount){ 
        imageIndex = 1;
    }
    // if currentIndex < 1, imageIndex back to endIndex
    if (index < 1){
        imageIndex = imgCount;
    }
    // all images set display = "none"
    for (i = 0; i < imgCount; i++) {
        images[i].style.display = "none";
    }
    // all dots remove CSS.active
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    // according to the current index, show  the image and dot
    images[imageIndex-1].style.display = "block";
    dots[imageIndex].classList.add("active");
};


// ----- price -----
const morning = document.getElementById("morning");
const afternoon = document.getElementById("afternoon");
let price = document.getElementById("price");

morning.addEventListener("click", ()=>{
    price.innerHTML = "新台幣 2000 元";
    choosePrice = 2000;
});

afternoon.addEventListener("click", ()=>{
    price.innerHTML = "新台幣 2500 元";
    choosePrice = 2500;
});

// ----- booking -----
const bookingBtn = document.querySelector(".bookingBtn");
const date = document.querySelector(".date");
const date_input = document.querySelector("#date_input");
const time = document.querySelector(".time");
let chooseTime;

bookingBtn.addEventListener("click", ()=>{
    if(!isLogin){
        open_signIn_box();
    }else if(date_input.value == ""){  // no choose date
        date.classList.add("warn");
        setTimeout(()=>{
            date.classList.remove("warn");
        }, 500);
    }else if(!morning.checked && !afternoon.checked){  // no choose time
        time.classList.add("warn");
        setTimeout(()=>{
            time.classList.remove("warn");
        }, 500);
    }else{
        booking()
    }
})

// ----- open signIn box ----- 
function open_signIn_box(){
    

    signIn.style.display = "block";
    signIn.classList.add("appear");
    overlay.style.display = "block";

    signIn.style.display = "block";
    signIn.classList.add("appear");
    overlay.style.display = "block";
}

const booking_message_box = document.querySelector(".booking_message_box");
const booking_message_title = document.querySelector(".booking_message_title")
const booking_message_close_button = document.querySelector(".booking_message_close_button");
const booking_message_button = document.querySelector(".booking_message_button")

function booking(){

    chooseTime = document.querySelector('input[name="time"]:checked').value;
    
    fetch("/api/booking", {
        method: "POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            "attractionId": url_Id,
            "date": date_input.value,
            "time": chooseTime,
            "price": choosePrice,
        })
    })
    .then((res)=>{
        return res.json();
    })
    .then((res)=>{
        
        if(res.update){
            appearBookingMessage(res);
        }else if(res.ok){
            appearBookingMessage(res);
        }else{
            appearBookingMessage(res);
        }
    })
    .catch((err)=>{
        console.log(err.message);
    })
}

function appearBookingMessage(res){
    booking_message_box.style.display = "grid";
    booking_message_box.classList.add("appear");
    booking_message_title.innerHTML = res.message;
};

booking_message_close_button.addEventListener("click", ()=>{
    booking_message_box.style.display = "none";
})

booking_message_button.addEventListener("click", ()=>{
    booking_message_box.style.display = "none";
    document.location.href="/booking";
})

// ----- top button -----
const top_btn = document.getElementById("top_btn");
window.onscroll = function() {
    top_btn.style.display = "block";
    const height = document.documentElement.scrollTop || document.body.scrollTop;
    if(height == 0) {
        top_btn.style.display = "none";
    }
};

// ----- click the Top-button and back to top ------
top_btn.addEventListener("click", ()=>{
    window.scrollTo({
        top:0,
        behavior:"smooth"
    })
});





