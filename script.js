const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillcolor = document.querySelector("#fill-color"),
sizeSlider= document.querySelector("#size-slider")
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas")
saveImg = document.querySelector(".save-img"),


ctx = canvas.getContext("2d");

// globle variable with default value 
let prevMouseX , prevMouseY, spanshot,
isDrawing = false ,
selectTool = "brush",
brushWidth = 3,
selectedColor = "#000";

const setCanvasBackground = ()=>
{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0, canvas.width , canvas.height);
    ctx.fillStyle = selectedColor;
    
}


window.addEventListener("load", ()=>{
 // setting canvas width / height .. offsetwidth / height return viewable width /height of an element 
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

});

// draw rectangle 

const drawRect = (e)=>
{
    if(!fillcolor.checked)
    {
        return ctx.strokeRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    
}

// circle draww code 
 const drawCircle = (e) =>
 {
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX),2)+ Math.pow((prevMouseY - e.offsetY),2));
    ctx.arc(prevMouseX , prevMouseY ,  radius , 0 ,2 * Math.PI);
    fillcolor.checked ? ctx.fill(): ctx.stroke();
  
 }

 // Triangle draw code 
 const drawTriangle =(e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX , prevMouseY);
    ctx.lineTo(e.offsetX ,e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX , e.offsetY);
    ctx.closePath();

    fillcolor.checked ? ctx.fill(): ctx.stroke();
   
   


 }


const startDraw = (e)=>
{
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouse X value 
    prevMouseY = e.offsetY;  // passing current mouseY position as prevMouseY value 
    ctx.beginPath(); // create a new path  to draw 
    ctx.lineWidth = brushWidth; // passing brushsize as line width 
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
    snapshot = ctx.getImageData(0 ,0, canvas.width , canvas.height);
}

const drawing =(e)=>{
    if(!isDrawing) return ; // if isdrawing is false return from hero 
     ctx.putImageData(snapshot , 0 , 0);
    if(selectTool === "brush" || selectTool === "eraser")
    {
        ctx.strokeStyle = selectTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX , e.offsetY); // creating a line according to the mouse pointer 
        ctx.stroke(); // drawing /filling line with color 
    }
    else if(selectTool === "rectangle")
    {
        drawRect(e);
    }
    else if(selectTool === "circle")
    {
        drawCircle(e);
    }
    else
    {
        drawTriangle(e);
    }
   
   

}

toolBtns.forEach(btn =>{
  btn.addEventListener("click" , ()=>{ // adding click event to all tool option 
    // removing active class from the previous option and adding on current clciked option 
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectTool = btn.id;

    console.log(selectTool);
  });
});

colorBtns.forEach(btn =>{
 btn.addEventListener("click" , ()=>{
   
 document.querySelector(".options .selected").classList.remove("selected");
 btn.classList.add("selected");
 selectedColor =  window.getComputedStyle(btn).getPropertyValue("background-color");
 });
});

colorPicker.addEventListener("change" , ()=>{
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click" , ()=>{
    ctx.clearRect(0 ,0, canvas.width , canvas.height);
})

saveImg.addEventListener("click" , ()=>{
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
})

sizeSlider.addEventListener("change" , () => brushWidth = sizeSlider.value);

canvas.addEventListener("mousedown" , startDraw);
canvas.addEventListener("mousemove" , drawing);
canvas.addEventListener("mouseup" , ()=> isDrawing = false );