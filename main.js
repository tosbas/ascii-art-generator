const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "ut-2004.png";

const charList = "@#%*+=-:. ";

img.onload = function () {
    const scale = 0.50;
    const asciiW = Math.floor(img.width * scale);
    const asciiH = Math.floor(img.height * scale);

    canvas.width = asciiW * 6;
    canvas.height = asciiH * 8; 

    ctx.drawImage(img, 0, 0, asciiW, asciiH);
    const imageData = ctx.getImageData(0, 0, asciiW, asciiH).data;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "10px monospace";

    for (let y = 0; y < asciiH; y++) {
        for (let x = 0; x < asciiW; x++) {
            let index = (y * asciiW + x) * 4;
            let r = imageData[index];
            let g = imageData[index + 1];
            let b = imageData[index + 2];

            let brightness = (r + g + b) / 3;
            let charIndex = Math.floor((brightness / 255) * (charList.length - 1));

            let char = charList[charList.length - 1 - charIndex];
            ctx.fillText(char, x * 6, y * 8);
        }
 
    }
};







