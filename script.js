function generateAsciiArt() {
    var input = document.getElementById('inputImage');
    var file = input.files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
        var img = new Image();
        img.onload = function () {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var width = img.width;
            var height = img.height;
            canvas.width = width;
            canvas.height = height;
            context.drawImage(img, 0, 0, width, height);

            var sizeSlider = document.getElementById('sizeSlider');
            var sizePercent = sizeSlider.value;
            var newSize = Math.floor(width * (sizePercent / 100));

            var asciiArt = document.getElementById('asciiArt');
            asciiArt.innerHTML = '';

            var asciiChars = ' .:-=+*#%@';

            for (var y = 0; y < height; y += Math.ceil(height / newSize)) {
                for (var x = 0; x < width; x += Math.ceil(width / newSize)) {
                    var totalBrightness = 0;
                    var count = 0;

                    for (var i = 0; i < Math.ceil(height / newSize); i++) {
                        for (var j = 0; j < Math.ceil(width / newSize); j++) {
                            var pixelData = context.getImageData(x + j, y + i, 1, 1).data;
                            var r = pixelData[0];
                            var g = pixelData[1];
                            var b = pixelData[2];
                            var brightness = (r + g + b) / 3;
                            totalBrightness += brightness;
                            count++;
                        }
                    }

                    var averageBrightness = totalBrightness / count;
                    var asciiCharIndex = Math.floor((averageBrightness / 255) * (asciiChars.length - 1));
                    var asciiChar = asciiChars[asciiCharIndex];
                    asciiArt.innerHTML += asciiChar;
                }

                asciiArt.innerHTML += '\n';
            }
        };

        img.src = reader.result;
    };

    if (file) {
        // Check image size before reading the file
        if (file.size <= 80 * 1024 * 1024) {
            reader.readAsDataURL(file);
        } else {
            alert('Image size exceeds the limit of 80MB.');
        }
    }
}

function copyToClipboard() {
    var asciiArt = document.getElementById('asciiArt');
    var range = document.createRange();
    range.selectNode(asciiArt);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('ASCII art copied to clipboard.');
}

function setDarkTheme() {
    document.body.classList.add('dark-theme');
}

function setLightTheme() {
    document.body.classList.remove('dark-theme');
}

var inputImage = document.getElementById('inputImage');
inputImage.addEventListener('change', generateAsciiArt);

var sizeSlider = document.getElementById('sizeSlider');
sizeSlider.addEventListener('input', generateAsciiArt);

var copyButton = document.getElementById('copyButton');
copyButton.addEventListener('click', copyToClipboard);

var darkThemeButton = document.getElementById('darkThemeButton');
darkThemeButton.addEventListener('click', setDarkTheme);

var lightThemeButton = document.getElementById('lightThemeButton');
lightThemeButton.addEventListener('click', setLightTheme);
