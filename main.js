const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const downloader = document.getElementById("downloader");
const fileInput = document.getElementById("file-input");

const scaleSlider = document.getElementById("scaleSlider");
const multSlider = document.getElementById("multSlider");
const fontSizeSlider = document.getElementById("fontSizeSlider");

const img = new Image();
img.src = "ut-2004.png";

const charList = "@#%*+=-:. ";

let mult = multSlider.value;

let scale = scaleSlider.value;

let fontSize = 10;

const authorized_types = ["image/jpeg", "image/png"];

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (authorized_types.includes(file.type)){
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            img.src = e.target.result;
        };
    }else{
        alert(`Unauthorized type: ${file.type}. Only the following types are allowed: ${authorized_types.join(", ")}`);
        fileInput.value = "";
    }
    
});

img.onload = function () {
    renderImage();
};

function handleScale(e) {
    scale = parseFloat(e.target.value);
    renderImage();
}

function handleMult(e) {
    mult = parseFloat(e.target.value);
    renderImage();
}

function handleFontSize(e) {
    fontSize = parseFloat(e.target.value);
    renderImage();
}

function renderImage() {
    const asciiW = Math.floor(img.width * scale);
    const asciiH = Math.floor(img.height * scale);

    canvas.width = asciiW * mult;
    canvas.height = asciiH * mult;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px monospace`;


    ctx.drawImage(img, 0, 0, asciiW, asciiH);
    const imageData = ctx.getImageData(0, 0, asciiW, asciiH).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < asciiH; y++) {
        for (let x = 0; x < asciiW; x++) {
            let index = (y * asciiW + x) * 4;
            let r = imageData[index];
            let g = imageData[index + 1];
            let b = imageData[index + 2];

            let brightness = r * 0.299 + g * 0.587 + b * 0.114;
            let charIndex = Math.floor((brightness / 255) * (charList.length - 1));
            let char = charList[charList.length - 1 - charIndex];


            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillText(char, x * mult, y * mult);
        }
    }

}

fontSizeSlider.addEventListener("change", (e) => handleFontSize(e));
scaleSlider.addEventListener("change", (e) => handleScale(e));
multSlider.addEventListener("change", (e) => handleMult(e));
downloader.addEventListener("click", (e) => download(e));

function download(e) {
    if (e.isTrusted) {
        e.preventDefault();
    }

    downloader.href = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
    e.target.click();
}









