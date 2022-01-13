
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


let child2elements = document.getElementsByClassName("child2");
for (let i = 0; i < child2elements.length; i++) {
    child2elements[i].addEventListener('mouseover', () => {
        child2elements[i].innerHTML = "<div>You can hide some text inside these bubbles to show on mouseover!</div>"
    })
    child2elements[i].addEventListener('mouseout', () => {
        child2elements[i].innerHTML = "<div>This is a div of class child2 on a grid. There are empty divs filling up the blank spots in the grid.</div>"
    })
}

showNav.addEventListener('click', (e) => {
    let element = document.getElementById("nav");
    let style = document.defaultView.getComputedStyle(element);

    if (style["display"] == "none"){
        element.style.display = "block";
    }
    else{
        element.style.display = "none";
    }
})