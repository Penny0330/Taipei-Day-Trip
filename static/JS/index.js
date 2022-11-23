let fetching = false;
let nextPage;
let keyword_value;

let main = document.querySelector("main");

window.onload = function(){
    checkPage(0);
    fetchCategory();

    let footer = document.querySelector("footer");
    const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
    };
    const observer = new IntersectionObserver(continuePage, options);
    observer.observe(footer);
    function continuePage(entries, observer){
        entries.forEach((entry) => {
            if(entry.isIntersecting){
                if(nextPage == null || nextPage == "null"){
                    return;
                }
                if(keyword_value && fetching == false){
                    let url = `/api/attractions?page=${nextPage}&keyword=${keyword_value}`;
                    fetchKeyword(url);
                }else if(nextPage && fetching == false){
                    let url = `/api/attractions?page=${nextPage}`;
                    fetchData(url);
                }
            }
        })
    } 

    
}

function checkPage(page){
    let url = `/api/attractions?page=${page}`;
    fetchData(url);
}

function fetchData(url){
    fetching = true;
    fetch(url, {
        method:'GET',
        headers: {
        'Content-Type':'application/json'
      }
    })
    .then(response => {
        return response.json();
    })
    .then(response => {
        getAttraction(response);
        nextPage = response.nextPage;
    })
}

// keyword 查詢
let keyword = document.querySelector("#keyword_value");
let button = document.querySelector("button");

button.addEventListener("click", ()=>{
    keyword_value = keyword.value;
    let url = `/api/attractions?page=0&keyword=${keyword_value}`;
    keyword.value = "";
    main.innerHTML = "";
    fetchKeyword(url);
})

function fetchKeyword(url){
    fetching = true;
    fetch(url, {
        method:'GET',
        headers: {
        'Content-Type':'application/json'
      }
    })
    .then(response => {
        return response.json();
    })
    .then(response=> {
        if(response.data == undefined){
            main.innerHTML = "";
            main.innerHTML = "查無相關景點，請重新輸入";
            return
        }
        getAttraction(response);
        nextPage = response.nextPage;
    })
}

function getAttraction(response){
    let get_data = response.data;

    for(let i = 0; i < get_data.length; i++){

        let attraction = document.createElement("a");
        attraction.setAttribute("class", "attraction");
        main.append(attraction);

        let attraction_name = document.createElement("div");
        attraction_name.setAttribute("class", "attraction_name");
        attraction.append(attraction_name);

        let img = document.createElement("img");
        img.src = get_data[i]["images"][0];
        attraction_name.append(img);

        let p = document.createElement("p")
        p.innerHTML = get_data[i]["name"];
        attraction_name.append(p);

        let attraction_info = document.createElement("div");
        attraction_info.setAttribute("class", "attraction_info");
        attraction.appendChild(attraction_info);

        let mrt = document.createElement("div");
        mrt.setAttribute("class", "mrt");
        mrt.innerHTML = get_data[i]["mrt"];
        attraction_info.append(mrt);

        let category = document.createElement("div");
        category.setAttribute("class", "category");
        category.innerHTML = get_data[i]["category"];
        attraction_info.append(category);
    }
    fetching = false;
}


// 連線 API，取得⽬前所有的景點分類
function fetchCategory(){
    fetch("/api/categories")
    .then(function(response){
        return response.json()
    })
    .then(function(response){
        getCategory(response);
    })
}

// 建立暫時隱藏的分類區塊，並將取得的景點分類放入
function getCategory(response){
    data = response.data;

    let category_list = document.createElement("div");
    category_list.setAttribute("class", "category_list");
    let slogan_search = document.querySelector(".slogan_search");
    slogan_search.appendChild(category_list);

    for(let category_name = 0; category_name < data.length; category_name++){
        let category = document.createElement("span");
        category.setAttribute("class", "category");
        category.innerHTML = data[category_name];
        category_list.appendChild(category);
    }
}


// 點擊 keyword_input，顯示 category_list
let searchInput = document.querySelector(".searchInput");

searchInput.addEventListener("click", ()=>{
    let category_list = document.querySelector(".category_list");
    category_list.style.display = "grid";

    category_list.childNodes.forEach(category =>{
        category.addEventListener("mousedown", (e)=>{
            e.preventDefault(); // 防止 blur 與 click event
            let input_text = document.querySelector("#keyword_value");
            input_text.value = e.target.textContent;
            category_list.style.display = "none";
        })
    })
})


// 任意處關閉 category_list
searchInput.addEventListener("blur", (e)=>{
    let category_list = document.querySelector(".category_list");
    category_list.style.display = "none"; 
})