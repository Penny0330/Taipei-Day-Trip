let url_Id = location.pathname.split("/")[2];
let attractionImg;
let imgCount;
let imgData;
let imgAll = document.querySelector(".imgAll");
let dotAll = document.querySelector(".dotAll");
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

        let headTitle = document.querySelector("title");
        headTitle.innerHTML = data["name"];

        let title = document.querySelector(".title");
        title.innerHTML = data["name"];

        let info = document.querySelector(".info");
        info.innerHTML = `${data["category"]} at ${data["mrt"]}`;

        let description = document.querySelector(".description");
        description.innerHTML= data["description"];

        let addressContent = document.querySelector(".addressContent");
        addressContent.innerHTML = data["address"];

        let directionContent = document.querySelector(".directionContent");
        directionContent.innerHTML = data["transport"];

        imgCount = data["images"].length;
        imgData = data["images"];
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

    // ----- push the dots can change img -----
    for(let i = 0; i < dots.length; i++){
        dots[i].addEventListener("click", (e)=>{
            showImages(imageIndex = i + 1);
        })
    }
};

// ----- img-Arrows -----
function arrowButton(index) {
    showImages(imageIndex += index);
}



function showImages(index) {
    let i;
    
    if (index > images.length){ 
        imageIndex = 1;
    }
    if (index < 1){
        imageIndex = images.length;
    }
    for (i = 0; i < images.length; i++) {
        images[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }
    images[imageIndex-1].style.display = "block";
    dots[imageIndex-1].classList.add("active");
}


// ----- price -----
let morning = document.getElementById("morning");
let afternoon = document.getElementById("afternoon");
let price = document.getElementById("price");

morning.addEventListener("click", ()=>{
    price.innerHTML = "新台幣 2000 元";
})

afternoon.addEventListener("click", ()=>{
    price.innerHTML = "新台幣 2500 元";
})

// ----- top button -----
let top_btn = document.getElementById("top_btn");
window.onscroll = function() {
    top_btn.style.display = "block";
    let height = document.documentElement.scrollTop || document.body.scrollTop;
    if(height == 0) {
        top_btn.style.display = "none";
    }
}

// ----- push the Top-button,back to top ------
top_btn.addEventListener("click", ()=>{
    window.scrollTo({
        top:0,
        behavior:"smooth"
    })
})





