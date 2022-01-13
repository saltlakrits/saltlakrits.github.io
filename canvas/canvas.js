const MaxBubbleRadius = 150;
const BackgroundColor = "#202020";
// const BubbleColor = "#3b0066";
const BubbleColor = "#342160";

// from this, the width, height, and canvastext width/height are also set.
// this does not, however, account for text. currently you can't put
// arbitrary amounts of text in the badges without it overflowing.

/* THE SOLUTION IS SO SIMPLE JUST
 set text width from canvas width -> set canvas height from text height
 if you want all badges to be of the same dimensions, even with different
 text, you could then do a final loop and set the same height for all of
 that class
 1. set canvas width depending on viewport width
 2. set text width depending on canvas width
 3. set canvas height depending on text height
 can (but don't have to) then ensure that all canvases have the same height */
// final loop to equalize all heights can use another class than before. this
// would allow you to group different badges that you want of equal size, and
// still just run a loop over the rest to set theirs.
// the above does depend on whether text height will automatically adjust or not
const MaxCanvasWidth = 400;
const MinCanvasWidth = 350;


// if you have more text to fit, play with these
// when canvas is max width, multiply by this to get corresponding height
const MaxCanvasModifier = 0.5;
// ditto for min width
const MinCanvasModifier = 0.5;


// TODO: currently on touchscreens pressing on the canvases generates
// a bubble, which doesn't go away. possible to check for touch device?
// otherwise think of a way to clear them or otherwise stop that from
// happening
// maybe just listen for click.......?
// you can just listen for touch, touchmove etc but screw that for now


// these need to be in global scope, because i suck
let bubbleRadius = 0;
let mouseTime;

const initializeCanvas = (e) => {
    let ctx = e.getContext("2d");
    ctx.clearRect(0, 0, e.clientWidth, e.clientHeight);
}

const getMousePos = (e) => {
    const target = e.target;
    const rect = target.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    return [x, y, e.target];
}

const drawBubble = (x, y, r, t) => {
    let ctx = t.getContext("2d");
    gradient = ctx.createRadialGradient(x, y, r, x, y, 0);

    gradient.addColorStop(0, BackgroundColor)
    gradient.addColorStop(1, BubbleColor);

    ctx.fillStyle = gradient;

    ctx.fillRect(0, 0, t.clientWidth, t.clientHeight);
}

const canvasMouseOut = (e) => {
    const [x, y, target] = getMousePos(e);
    let ctx = target.getContext("2d");

    for (let i = 0; i <= (MaxBubbleRadius / 10); i++) {
        setTimeout(() => drawBubble(x, y, MaxBubbleRadius - 10 * i, target), 5 * i);
    }

    // after shrinking, now make it blank
    setTimeout(() => {
        ctx.clearRect(0, 0, target.clientWidth, target.clientHeight);
    }, 105);
    bubbleRadius = 0;
    clearTimeout(mouseTime);
}


const canvasMousemove = (e) => {
    clearTimeout(mouseTime);

    const [x, y, target] = getMousePos(e);

    let ctx = target.getContext("2d");
    drawBubble(x, y, bubbleRadius, target);

    if (bubbleRadius < MaxBubbleRadius) {
        bubbleRadius += 10;
        mouseTime = setTimeout(() => canvasMousemove(e), 1);
    }
}

const setCanvasDimensions = (el) => {
    let sizeCheck = document.documentElement.clientWidth * 0.4;
    if (sizeCheck > MaxCanvasWidth) {
        el.width = MaxCanvasWidth;
        el.height = el.width * MaxCanvasModifier;
    }
    else {
        el.width = MinCanvasWidth;
        el.height = el.width * MinCanvasModifier;
    }
}

const setCanvasTextDimensions = (el, canvas) => {
    el.style.width = `${canvas.width * 0.9}px`;
    el.style.height = `${canvas.height * 0.85}px`;
}

let canvases = document.getElementsByClassName("drawingCanvas");
let canvasTexts = document.getElementsByClassName("absoluteChild");

for (let i = 0; i < canvases.length; i++) {

    let el = canvases[i];
    let elText = canvasTexts[i];

    setCanvasDimensions(el);

    setCanvasTextDimensions(canvasTexts[i], el)

    window.addEventListener('resize', () => {
        setCanvasDimensions(el);
        setCanvasTextDimensions(elText, el);
        initializeCanvas(el);
    });
    initializeCanvas(el);
    el.addEventListener("mouseout", (e) => canvasMouseOut(e));
    el.addEventListener("mousemove", (e) => canvasMousemove(e));
}