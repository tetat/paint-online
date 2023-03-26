const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-editor");
const saveImg = document.querySelector(".save-img");
const ctx = canvas.getContext("2d");

// global variable with default value
let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 3;
let selectedColor = "#000";
let prevMouseX, prevMouseY, snapshot;

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selected color, it will be brush color
}

window.addEventListener("load", () => {
    // setting canvas width/height, offsetwidth/height and returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if (!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    ctx.beginPath(); // creating new path to draw circle
    // getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(((prevMouseX - e.offsetX) * (prevMouseX - e.offsetX)) + ((prevMouseY - e.offsetY) * (prevMouseY - e.offsetY)));
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    // if fillColor is checked fill circle else draw border circle
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTriangle = (e) => {
    ctx.beginPath(); // creating new path to draw triangle
    // moving triangle to the mouse pointer
    ctx.moveTo(prevMouseX, prevMouseY);
    // creating first line according to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);
    // creating bottom line of triangle
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    // closing path of a triangle so the third line draw automatically
    ctx.closePath();
    // if fillColor is checked fill triangle else draw border triangle
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    // creating new path to draw
    ctx.beginPath();
    // passing brush size as line width
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedColor; // passing selected color as stroke style
    ctx.fillStyle = selectedColor; // passing selected color as fill style
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}
const endDraw = () => {
    isDrawing = false;
}

const drawing = (e) => {
    if (!isDrawing)return;
    // adding copied canvas data on to this canvas
    ctx.putImageData(snapshot, 0, 0);
    
    if (selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white else selectd color
        ctx.strokeStyle = (selectedTool === "eraser" ? "#fff" : selectedColor);
        // creating line according to mouse pointer
        ctx.lineTo(e.offsetX, e.offsetY);
        // drawing/filling line with color
        ctx.stroke();
    } else if (selectedTool === "rectangle") {
        drawRect(e);
    } else if (selectedTool === "circle") {
        drawCircle(e);
    } else if (selectedTool === "triangle") {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    // adding click event to all tool option
    btn.addEventListener("click", () => {
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

// passing slider value as brushSize or eraserSize
sizeSlider.addEventListener("change", () => {
    if (selectedTool === "brush") {
        brushWidth = sizeSlider.value;
    }
    else if (selectedTool === "eraser") {
        // if eraser then value will 2x
        brushWidth = sizeSlider.value * 2;
    }
    // console.log(brushWidth);
});

colorBtns.forEach(btn => {
    // adding click event to all color button
    btn.addEventListener("click", () => {
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
    // clearing whole canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    const link = document.createElement("a"); // creating <a> element
    link.download = `${Date.now()}.jpeg`; // passing current date as file name
    link.href = canvas.toDataURL(); // passing canvas data as link href value
    link.click(); // clicking link to download image
});



canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", endDraw);