let bubbleRadius = 0;
let mouseTime;

const MaxBubbleRadius = 150;
const BackgroundColor = "#202020";
// const BubbleColor = "#3b0066";
const BubbleColor = "#342160";

// TODO event: mouse leaves window, reset bubble size and kill timers
// perhaps not needed?

const initializeCanvas = (e) => {
    let ctx = e.getContext("2d");
    ctx.fillStyle = BackgroundColor;
    ctx.fillRect(0, 0, e.clientWidth, e.clientHeight);
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
        ctx.fillStyle = BackgroundColor;
        ctx.fillRect(0, 0, target.clientWidth, target.clientHeight);
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

let canvases = document.getElementsByClassName("drawingCanvas");

for (let i = 0; i < canvases.length; i++) {

    var el = canvases[i];
    initializeCanvas(el);
    el.addEventListener("mouseout", (e) => canvasMouseOut(e));
    el.addEventListener("mousemove", (e) => canvasMousemove(e));
}

// will need to make this work for arbitrary canvas sizes
// may also at that point need to listen for window resize event,
// if that exists as such, and run the initializeCanvas function on all the
// canvases again