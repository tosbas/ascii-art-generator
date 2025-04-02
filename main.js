const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

const fileInput = document.getElementById("file-input");
const textArea = document.getElementById("output-text");

const charList = "@#%*+=-: ";
let asciiText = "";

const authorized_types = ["image/jpeg", "image/png"];

const img = new Image();
img.src = "ut-2004.png";

img.onload = function () {
    renderImage();
};

canvas.width = 800;
canvas.height = 600;

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && authorized_types.includes(file.type)) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            img.onload = function () { renderImage(); }; // Réassigner l'événement onload
            img.src = e.target.result;
        };
    } else {
        alert(`Unauthorized type: ${file?.type}. Only: ${authorized_types.join(", ")}`);
        fileInput.value = "";
    }
});

function renderImage() {
    if (!img.width || !img.height) {
        return;
    }

    asciiText = "";

    let wRatio = canvas.width / img.width;
    let hRatio = canvas.height / img.height;
    let ratio = Math.min(wRatio, hRatio);

    const imgW = Math.floor(img.width * ratio);
    const imgH = Math.floor(img.height * ratio);

    canvas.width = imgW;
    canvas.height = imgH;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, imgW, imgH);
    const imageData = ctx.getImageData(0, 0, imgW, imgH).data;

    const charWidth = 8;
    const charHeight = 8;

    const asciiW = Math.floor(imgW / charWidth);
    const asciiH = Math.floor(imgH / charHeight);

    for (let y = 0; y < asciiH; y++) {
        for (let x = 0; x < asciiW; x++) {
            let pixelX = Math.floor(x * charWidth);
            let pixelY = Math.floor(y * charHeight);
            let index = (pixelY * imgW + pixelX) * 4;

            if (index >= imageData.length) continue;

            let r = imageData[index];
            let g = imageData[index + 1];
            let b = imageData[index + 2];

            let brightness = r * 0.299 + g * 0.587 + b * 0.114;
            let charIndex = Math.floor((brightness / 255) * (charList.length - 1));
            let char = charList[charList.length - 1 - charIndex];

            asciiText += char + " ";
        }
        asciiText += "\n";
    }

    textArea.style.fontFamily = "monospace";
    textArea.style.whiteSpace = "pre";
    textArea.value = asciiText;

}
