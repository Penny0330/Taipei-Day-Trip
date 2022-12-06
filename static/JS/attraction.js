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
function create_DotImg(){
    for(let i = 0; i < imgCount; i++){
        dotSpan = document.createElement("span");
        dotSpan.setAttribute("class", "dot");
        dotAll.append(dotSpan)
        
        attractionImg = document.createElement("img");
        attractionImg.setAttribute("class", "attractionImg");
        attractionImg.src = imgData[i];
        imgAll.append(attractionImg);
    }
    
    // all dots、images
    dots = document.querySelectorAll("span");
    images = document.getElementsByClassName("attractionImg");

    // ----- initial loading -----
    imageIndex = 1;
    showImages(imageIndex);

    // ----- click the dot switch images -----
    for(let i = 0; i < dots.length; i++){
        dots[i].addEventListener("click", ()=>{
            showImages(imageIndex = i + 1);
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
    dots[imageIndex-1].classList.add("active");
};


// ----- price -----
const morning = document.getElementById("morning");
const afternoon = document.getElementById("afternoon");
const price = document.getElementById("price");

morning.addEventListener("click", ()=>{
    price.innerHTML = "新台幣 2000 元";
});

afternoon.addEventListener("click", ()=>{
    price.innerHTML = "新台幣 2500 元";
});

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





