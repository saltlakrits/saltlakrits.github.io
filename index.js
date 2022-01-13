
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


let alternating = document.getElementsByClassName("alternating");
for (let i = 0; i < alternating.length; i++) {
    alternating[i].addEventListener('mouseover', () => {
        alternating[i].innerHTML = "<div>You can hide some text inside these bubbles to show on mouseover!</div>"
    })
    alternating[i].addEventListener('mouseout', () => {
        alternating[i].innerHTML = "<div>Whatevs.</div>"
    })
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