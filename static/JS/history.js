const main = document.querySelector("main");

fetchHistoryOrder();

async function fetchHistoryOrder(){
    const response = await fetch("/api/history");
    let result = await response.json();

    if(result.error){
        location.href = "/";
        return
    }else if(result.data === null){
        main.textContent = "尚無任何訂單紀錄";
        main.classList.add("no_order");
        return
    }
    
    result = result.data;

    createTitle(result);
    createHistoryOrder(result);
};


function createTitle(result){
    const welcome = document.createElement("div");
    welcome.classList.add("welcome");
    main.appendChild(welcome);

    const welcomeText = document.createElement("div");
    welcomeText.classList.add("welcome_text");
    welcomeText.textContent = `您好，${result[0].name}，歷史訂單如下：`
    welcome.appendChild(welcomeText);

    const newToOld = document.createElement("div");
    newToOld.classList.add("new_to_old");
    newToOld.textContent = "訂單排序 : 新 → 舊";
    main.appendChild(newToOld);
}

function createHistoryOrder(result){

    result.forEach(historyOrder => {

        const order = document.createElement("div");
        order.classList.add("order");
        main.appendChild(order);

        const left = document.createElement("div");
        left.classList.add("left");
        order.appendChild(left);

        const image = document.createElement("img");
        image.classList.add("image");
        image.src = historyOrder.attraction_image;
        left.appendChild(image);

        const right = document.createElement("div");
        right.classList.add("right");
        order.appendChild(right);

        const orderNumber = document.createElement("div");
        orderNumber.classList.add("order_number");
        orderNumber.textContent = "訂單編號：";
        right.appendChild(orderNumber);

        const number = document.createElement("span");
        number.classList.add("number");
        number.textContent = historyOrder.order_number;
        orderNumber.appendChild(number);

        const title = document.createElement("div");
        title.classList.add("title");
        title.textContent = `台北一日遊：${historyOrder.attraction_name}`;
        right.appendChild(title);

        const orderDate = document.createElement("div");
        orderDate.classList.add("order_date");
        orderDate.textContent = "日期：";
        right.appendChild(orderDate);

        const date = document.createElement("span");
        date.classList.add("date");
        date.textContent = historyOrder.date;
        orderDate.appendChild(date);

        const orderTime = document.createElement("div");
        orderTime.classList.add("order_time");
        orderTime.textContent = "時間：";
        right.appendChild(orderTime);

        const time = document.createElement("span");
        time.classList.add("time");
        if(historyOrder.time === "morning"){
            time.textContent = "早上 9 點到下午 4 點";
        }else{
            time.textContent = "下午 4 點到晚上 10 點";
        };
        orderTime.appendChild(time);

        const orderPrice = document.createElement("div");
        orderPrice.classList.add("order_price");
        orderPrice.textContent = "費用：";
        right.appendChild(orderPrice);

        const price = document.createElement("span");
        price.classList.add("price");
        price.textContent = historyOrder.price;
        orderPrice.appendChild(price);

        const order_again = document.createElement("div")
        right.appendChild(order_again);

        const againButton = document.createElement("button");
        againButton.classList.add("again_button")
        againButton.textContent = "再次訂購";
        order_again.appendChild(againButton);

        againButton.addEventListener("click", ()=>{
            location.href = `/attraction/${historyOrder.attraction_id}`;
        });
    });
};