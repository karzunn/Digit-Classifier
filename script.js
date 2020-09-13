let canvas = document.getElementsByTagName("canvas")[0];
let checkButton = document.getElementById("checkButton");
canvas.height = 168;
canvas.width = 168;
let ctx = canvas.getContext("2d");
canvas.style.backgroundColor = "black";
let canDraw = false;
let guess = document.getElementById("guess");
let uploadButton = document.getElementById("upload");

checkButton.disabled = true;

canvas.addEventListener("mousedown", drawStatus);
canvas.addEventListener("mouseup", drawStatus);
canvas.addEventListener("mousemove", drawPixel);
canvas.addEventListener("dblclick", eraseCanvas);

let dataArray = [...Array(28)].map(e => Array(28))

function drawStatus(e){
    canDraw = !canDraw;
    ctx.fillRect(e.clientX-9,e.clientY-9,12,12);
    ctx.fillStyle = "#fff";
    ctx.fill();
}

function drawPixel(e){
    if (canDraw){
        ctx.fillRect(e.clientX-9,e.clientY-9,12,12);
        ctx.fillStyle = "#fff";
        ctx.fill();
    }
}

function eraseCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('DOMContentLoaded', run);

async function run() {  

    let model;

    uploadButton.addEventListener("click", uploadModel);
    async function uploadModel(){
      const jsonUpload = document.getElementById('json-upload');
      const weightsUpload = document.getElementById('weights-upload');
      model = await tf.loadLayersModel(
          tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]));
      guess.textContent = "Guess: ";
      checkButton.disabled = false;
      }

    checkButton.addEventListener("click", getData)

    function getData(){
        let imageData = ctx.getImageData(0,0,168,168).data;
        let x = 0;
        let y = 0;
        let i = 0;
        while (i<imageData.length){
            if (i%24 == 0){
                dataArray[y][x] = imageData[i];
                x+=1;
                if (x==28){
                    x=0;
                    y+=1;
                    i+=3361;
                }
            }
            i+=1;
        }
        let datatensor = tf.tensor(dataArray).reshape([1,28,28,1]);
        let guessarray = model.predict(datatensor).dataSync();
        guess.textContent = "Guess: "+(guessarray.indexOf(Math.max(...guessarray))).toString();
    }

}