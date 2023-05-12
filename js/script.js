const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearEditor = document.querySelector(".clear-editor"),
saveImg = document.querySelector(".save-img");

const ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY, snapshot;
// global variables with default values
let isDrawing = false,
selectedTool = "brush",
selectedColor = "#000";
brushWidth = sizeSlider.value;

const setCanvasBackground = () => {
    // setting whole editor background white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selectedColor, it'll be the brush color
}

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/offsetheight returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    !fillColor.checked ?
    ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
    :
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    const x = prevMouseX - e.offsetX;
    const y = prevMouseY - e.offsetY;
    const radius = Math.sqrt(x*x + y*y);
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    !fillColor.checked ? ctx.stroke() : ctx.fill(); // if fillColor is checked draw fill circle else border circle
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw triangle
    ctx.moveTo(prevMouseX, prevMouseY); // moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY); // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY); // creating bottom line of triangle
    ctx.closePath(); // closing path of a triangle so the third line draw automatically
    !fillColor.checked ? ctx.stroke() : ctx.fill(); // if fillColor is checked draw fill triangle else border triangle
}

const startDrawing = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouse x position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouse y position as prevMouseY value
    ctx.beginPath(); // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brush size as line width
    ctx.strokeStyle = selectedColor; // passing selectedColor as stroke style
    ctx.fillStyle = selectedColor; // passing selecdedColor as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    if (!isDrawing)return; // if isDrawing is false return from here
    // adding copied canvas data on to this canvas
    ctx.putImageData(snapshot, 0, 0);

    if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer
        ctx.stroke(); // drawing/filling line with color
    }else if (selectedTool === "rectangle") {
        drawRect(e);
    }else if (selectedTool === "circle") {
        drawCircle(e);
    }else if (selectedTool === "triangle") {
        drawTriangle(e);
    }
}

toolBtns.forEach((btn) => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        // console.log(selectedTool);
    });
});

// passing slider value as brushSize
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all color option
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        // console.log(selectedColor);
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearEditor.addEventListener("click", () => {
    const agree = window.confirm("Warning! are you going to clear everything?");
    if (agree) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // clearing whole canvas
        setCanvasBackground();
    }
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvas data as link download value
    link.click(); // clicking link to download image
})

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);