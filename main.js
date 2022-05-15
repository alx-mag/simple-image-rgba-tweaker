const canvas = document.getElementById("canvas");
const brightnessSlider = document.getElementById("brightness")
const contrastSlider = document.getElementById("contrast")
const opacitySlider = document.getElementById("transparent")

const image = new Image()
const canvasContext = canvas.getContext("2d");

// Upload File button listener
document.getElementById("file-input").addEventListener("change", ev => {
    let files = ev.target.files;
    if (!files) return
    let file = files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onloadend = e => {
        image.src = e.target.result.toString();
        image.onload = () => drawImage(image)
    };
})

// Tweakers listeners
brightnessSlider.addEventListener("change", () => onTweakersChange())
contrastSlider.addEventListener("change", () => onTweakersChange())
opacitySlider.addEventListener("change", () => onTweakersChange())

// Download button listener
document.getElementById("save-button").addEventListener("click", ev => {
    let imageData = canvas.toDataURL("image/png", 1);

    let tmpLink = document.createElement("a");
    tmpLink.download = "result.png";
    tmpLink.href = imageData;

    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);
})

function drawImage(image) {
    canvas.width = image.width;
    canvas.height = image.height;
    canvasContext.drawImage(image, 0, 0);
    resetTweakers()
}


const onTweakersChange = () => applyTweakers(
    parseInt(brightnessSlider.value),
    parseInt(contrastSlider.value),
    parseFloat(opacitySlider.value)
);

function applyTweakers(brightness, contrast, opacity) {
    // Redraw original image
    canvasContext.drawImage(image, 0, 0)

    // Modify image
    const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    let factor = 259 * (255 + contrast) / (255 * (259 - contrast));
    for (let rgbaIndex = 0; rgbaIndex < pixels.length; rgbaIndex += 4) {
        // Set RGB values
        for (let j = 0; j <= 2; j++) {
            let index = rgbaIndex + j;
            pixels[index] = truncateRgbaValue(factor * (pixels[index] - 128) + 128 + brightness)
        }

        // Set alpha
        let alphaIndex = rgbaIndex + 3;
        pixels[alphaIndex] = truncateRgbaValue(pixels[alphaIndex] * opacity)
    }
    canvasContext.putImageData(imageData, 0, 0);
}

function truncateRgbaValue(colorValue) {
    if (colorValue > 255) return 255;
    if (colorValue < 0) return 0;
    return colorValue;
}

function resetTweakers() {
    document.getElementById("brightness").value = 0
    document.getElementById("contrast").value = 0
    document.getElementById("transparent").value = 1
}