const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "ut-2004.png";

const charList = "@#%*+=-:. ";

// Multiplier for spacing of characters
const multX = 6;  // Defines the horizontal spacing multiplier between ASCII characters.
const multY = 8;  // Defines the vertical spacing multiplier between ASCII characters.

// Scale
const scale = 0.4;  // Defines the scaling factor for the image.

// Font Size
const fontSize = 10;  // Defines the font size used to display the ASCII characters on the canvas.


img.onload = function () {
 
    const asciiW = Math.floor(img.width * scale);
    const asciiH = Math.floor(img.height * scale);

    canvas.width = asciiW * multX;
    canvas.height = asciiH * multY; 

    ctx.drawImage(img, 0, 0, asciiW, asciiH);
    const imageData = ctx.getImageData(0, 0, asciiW, asciiH).data;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
    ctx.font = `${fontSize}px monospace`;

    for (let y = 0; y < asciiH; y++) {
        for (let x = 0; x < asciiW; x++) {
            let index = (y * asciiW + x) * 4;
            let r = imageData[index];
            let g = imageData[index + 1];
            let b = imageData[index + 2];

            // YIQ formula for better contrast https://en.wikipedia.org/wiki/YIQ
            let brightness = r * 0.299 + g * 0.587 + b * 0.114;
            let charIndex = Math.floor((brightness / 255) * (charList.length - 1));

            let char = charList[charList.length - 1 - charIndex];
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillText(char, x * multX, y * multY);
        }
 
    }
};







