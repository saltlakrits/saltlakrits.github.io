
// this should be run on page load and will re-run the setCurrenTime function every second to update the clock
let intervalId = window.setInterval(function () {
    setCurrentTime()
}, 1000);

// get current time and set it to the appropriate div
let setCurrentTime = () => {
    let now = new Date();
    let currentTime = now.getHours() + ":"
        + (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) + ":"
        + (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds());
    document.getElementById("currentTime").innerHTML = `The time is now: ${currentTime}`;
}


// run upon buttonclick to toggle div passed as argument (string).
// currently assumed the given div is either a flex or hidden

let toggleDisplay = (e) => {
    let element = document.getElementById(e);
    let style = document.defaultView.getComputedStyle(element);

    if (style["display"] == "none") element.style.display = "flex";
    else element.style.display = "none";
}



// showNav.addEventListener('click', () => {
//     let element = document.getElementById("nav");
//     let style = document.defaultView.getComputedStyle(element);

//     if (style["display"] == "none"){
//         element.style.display = "block";
//     }
//     else{
//         element.style.display = "none";
//     }
// })

showNav.addEventListener('click', () => {
    let element = document.getElementById("nav");
    element.classList.toggle("open");
    console.log(element.classList);
})

const grabDimensions = (e) => {
    const target = e.target;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return [x, y];
}

const backgroundString = (x, y, p) => `#222 radial-gradient(circle at ${x}px ${y}px, #342160 0%, #222 calc(0% + ${p}px))`;

let bubbleWidth = 0;
let timerID;

const mouseMove = (e) => {
    const [x, y] = grabDimensions(e);
    e.target.style.background = backgroundString(x, y, bubbleWidth);

    if (bubbleWidth < 150) {
        bubbleWidth += 10;
        timerID = setTimeout(() => {
            mouseMove(e);
        }, 10);
    }
}

let alts = document.querySelectorAll(".alternating");
for (let i = 0; i < alts.length; i++) {
    alts[i].addEventListener('mousemove', (e) => {
        mouseMove(e);
    })
    alts[i].addEventListener('mouseout', (e) => {
        bubbleWidth = 0;
        const [x, y] = grabDimensions(e);
        e.target.style.background = backgroundString(x, y, 150);
        for (let j = 150; j >= 0; j = j - 10) {
            setTimeout(() => {
                e.target.style.background = backgroundString(x, y, j);
            }, 150 - j);
        }
    })
}