const orderNumber = location.search.split("=")[1];
const main = document.querySelector("main");
const attraction = document.querySelector(".attraction");
const title = document.querySelector(".title");
const date = document.querySelector(".date");
const time = document.querySelector(".time");
const price = document.querySelector(".price");
const address = document.querySelector(".address");
const image = document.querySelector(".image");


getOrder(orderNumber);

function getOrder(orderNumber){
    fetch(`/api/order/${orderNumber}`)
    .then((res)=>{
        return res.json()
    })
    .then((res)=>{

        if(res.error){
            location.href = "/";
            return
        }else if(res.data === null){

            main.style.textAlign = "center";
            main.style.height = "100vh";
            const thankyou = document.createElement("div");
            thankyou.setAttribute("class", "thankyou");
            thankyou.style.marginTop = "50px";
            thankyou.textContent = "查無此訂單編號";
            main.appendChild(thankyou);
            
            return
        }

        loadOrder(res);
    })
};

function loadOrder(res){
    res = res.data;

    const container = document.createElement("div");
    container.classList.add("container");
    main.appendChild(container);

    const top = document.createElement("div");
    top.setAttribute("class", "top");
    container.appendChild(top);

    const thankyou = document.createElement("div");
    thankyou.setAttribute("class", "thankyou");
    thankyou.textContent = "感謝您的訂購";
    top.appendChild(thankyou);

    const number = document.createElement("div");
    number.setAttribute("class", "order_number");
    number.textContent = `您的訂單編號 : ${res.number}`;
    top.appendChild(number);

    const totalPrice = document.createElement("div");
    totalPrice.setAttribute("class", "total_price");
    top.appendChild(totalPrice);
    totalPrice.textContent = `訂單總金額$${res.price}`;

    const continueBookingButton = document.createElement("button");
    continueBookingButton.setAttribute("class", "continue_booking_button");
    continueBookingButton.textContent = "繼續預訂行程";
    top.appendChild(continueBookingButton);

    continueBookingButton.addEventListener("click", ()=>{
        location.href = "/";
    });

    const checkOrderButton = document.createElement("button");
    checkOrderButton.setAttribute("class", "check_order_button");
    checkOrderButton.textContent = "查看訂單內容";
    top.appendChild(checkOrderButton);

    checkOrderButton.addEventListener("click", ()=>{
        attraction.classList.toggle("appear");
        title.textContent = `台北一日遊：${res.trip.name}`;
        date.textContent = res.date;
        if(res.time === "morning"){
            time.textContent = "早上 9 點到下午 4 點";
        }else{
            time.textContent = "下午 4 點到晚上 10 點";
        };
        price.textContent = res.price;
        address.textContent = res.trip.address;
        image.src = res.trip.image;
    });

    const historyOrderButton = document.createElement("button");
    historyOrderButton.setAttribute("class", "check_order_button");
    historyOrderButton.textContent = "查看歷史訂單";
    top.appendChild(historyOrderButton);

    historyOrderButton.addEventListener("click", ()=>{
        location.href = "/history";
    })

    

};

const orderCloseButton = document.querySelector(".order_close_button");

orderCloseButton.addEventListener("click", ()=>{
    attraction.classList.remove("appear");
});


// ----- create balloons -----
const bdayBallons = (function(){
    const density = 7; // concurrent balloon count
    const balloons = []; 
    const colors = ['yellow', 'green', 'blue', 'red'];

    const stringElement = document.createElement("div");
    stringElement.classList.add("string");

    for (let i = 0; i < density; i++) {
        const element = document.createElement("div");
        element.classList.add("balloon");
        element.classList.add(randomColor());

        element.append(stringElement.cloneNode());
        document.body.append(element);
        
        setTimeout(() => {
            releaseBalloon(element);
        }, (i * 2000) + random(500, 1000));
    }


    function randomColor() {
        return colors[ random(0, colors.length) ];
    }

    function random (min, max){
        return Math.floor(Math.random() * (max-min)) + min;
    }

    function releaseBalloon(balloon) {
        const delay = random(100, 1000);
        const x = random(-99, -30); // random x value to fly
        const y = random(-99, -30); // random y value to fly

        const sequence = [{
            offset: 0,
            transform: `rotateZ(45deg) translate(0, 0)`
        }];


        // random fly direction
        if(random(0,2) === 0) {
            // first fly up to top left

            // left distance to keep balloon in view
            balloon.style.left = `${-1*x}vw`;

            sequence.push({
                offset: x/-200,
                transform: `rotateZ(45deg) translate(${x}vw, 0)`
            });
            sequence.push({
                offset: (x+y)/-200,
                transform: `rotateZ(45deg) translate(${x}vw, ${y}vh)`
            });
            sequence.push({
                offset: (-100+y)/-200,
                transform: `rotateZ(45deg) translate(-100vw, ${y}vh)`
            });
        } else {
            // fist fly up to right top

            sequence.push({
                offset: y/-200,
                transform: `rotateZ(45deg) translate(0, ${y}vh)`
            });
            sequence.push({
                offset: (x+y)/-200,
                transform: `rotateZ(45deg) translate(${x}vw, ${y}vh)`
            });
            sequence.push({
                offset: (-100+x)/-200,
                transform: `rotateZ(45deg) translate(${x}vw, -100vh)`
            });
        }

        // last move is common
        sequence.push({
            offset: 1,
            transform: `rotateZ(45deg) translate(-100vw, -100vh)`
        });

        const balloonAnimation = balloon.animate(sequence, {
            duration: 15000,
            delay: delay
        });


        balloonAnimation.onfinish = () => { releaseBalloon(balloon) }
    }
})();