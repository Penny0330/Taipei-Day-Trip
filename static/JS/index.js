let fetching = false; //是否在 fetch 資料
let nextPage;
let keyword_value;

const main = document.querySelector("main");

// start loading
checkPage(0);
fetchCategory();

// scroll event
const footer = document.querySelector("footer");

const options = {
root: null,
rootMargin: "0px",
threshold: 0.5,
};

const observer = new IntersectionObserver(continuePage, options);
observer.observe(footer);

function continuePage(entries){
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            if(nextPage != null && fetching == false){
                if(!keyword_value){
                    let url = `/api/attractions?page=${nextPage}`;
                    fetchData(url);
                }else{
                    let url = `/api/attractions?page=${nextPage}&keyword=${keyword_value}`;                  
                    fetchKeyword(url);
                }
            }
            else{
                // nextPage = null 時, 就停止動作
                return
            }
        }
    })
};


function checkPage(page){
    let url = `/api/attractions?page=${page}`;
    fetchData(url);
};

// 取得資料: 無 keyword
async function fetchData(url){
    fetching = true;

    const response = await fetch(url);
    const result = await response.json();
    getAttraction(result);
    nextPage = result.nextPage;

    fetching = false;
};

// keyword 查詢
const keyword = document.querySelector("#keyword_value");
const button = document.querySelector(".search_btn");

button.addEventListener("click", ()=>{
    keyword_value = keyword.value;
    let url = `/api/attractions?page=0&keyword=${keyword_value}`;
    keyword.value = "";
    main.innerHTML = "";
    fetchKeyword(url);
});

// 取得資料: 有 keyword
async function fetchKeyword(url){
    fetching = true;
    const response = await fetch(url);
    const result = await response.json();

    if(result.data == undefined){
        main.innerHTML ="";
        main.innerHTML = `關鍵字:${keyword_value}，查無相關景點。`;
        return
    }
    getAttraction(result);
    nextPage = result.nextPage;

    fetching = false;
};

// 建立 Attraction 區塊，並將取得的 response 資料放入
function getAttraction(result){
    const get_data = result.data;

    for(let i = 0; i < get_data.length; i++){

        const attraction = document.createElement("a");
        attraction.setAttribute("class", "attraction");
        attraction.href = `attraction/${get_data[i].id}`;
        main.append(attraction);

        const attraction_name = document.createElement("div");
        attraction_name.setAttribute("class", "attraction_name");
        attraction.append(attraction_name);

        const img = document.createElement("img");
        img.src = get_data[i].images[0];
        attraction_name.append(img);

        const p = document.createElement("p")
        p.innerHTML = get_data[i].name;
        attraction_name.append(p);

        const attraction_info = document.createElement("div");
        attraction_info.setAttribute("class", "attraction_info");
        attraction.appendChild(attraction_info);

        const mrt = document.createElement("div");
        mrt.setAttribute("class", "mrt");
        if(get_data[i].mrt == null){
            mrt.innerHTML = "無捷運可到達";
        }else{
            mrt.innerHTML = get_data[i].mrt;
        }
        attraction_info.append(mrt);

        const category = document.createElement("div");
        category.setAttribute("class", "category");
        category.innerHTML = get_data[i].category;
        attraction_info.append(category);
    }
};


// 連線 API，取得⽬前所有的景點分類
async function fetchCategory(){
    fetching = true;

    const response = await fetch("/api/categories");
    const result = await response.json();
    getCategory(result);

    fetching = false;
};

// 建立暫時隱藏的分類區塊，並將取得的景點分類放入
function getCategory(result){
    data = result.data;

    const category_list = document.createElement("div");
    category_list.setAttribute("class", "category_list");

    const slogan_search = document.querySelector(".slogan_search");
    slogan_search.appendChild(category_list);

    for(let category_name = 0; category_name < data.length; category_name++){
        const category = document.createElement("span");
        category.setAttribute("class", "category");
        category.innerHTML = data[category_name];
        category_list.appendChild(category);
    }
};


// 點擊 keyword_input，顯示 category_list
const searchInput = document.querySelector(".searchInput");

searchInput.addEventListener("click", ()=>{
    const category_list = document.querySelector(".category_list");
    category_list.style.display = "grid";

    category_list.childNodes.forEach((category) =>{
        category.addEventListener("mousedown", (e)=>{
            e.preventDefault(); // 防止 blur 與 click event
            const input_text = document.querySelector("#keyword_value");
            input_text.value = e.target.textContent;
            category_list.style.display = "none";
        })
    })
});


// 任意處關閉 category_list
searchInput.addEventListener("blur", ()=>{
    const category_list = document.querySelector(".category_list");
    category_list.style.display = "none"; 
});


// ----- top button -----
const top_btn = document.getElementById("top_btn");
window.onscroll = function() {
    top_btn.style.display = "block";
    const height = document.documentElement.scrollTop || document.body.scrollTop;
    if(height == 0) {
        top_btn.style.display = "none";
    }
}

// ----- click the Top-button and back to top ------
top_btn.addEventListener("click", ()=>{
    window.scrollTo({
        top:0,
        behavior:"smooth"
    })
})