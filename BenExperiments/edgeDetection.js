// set a gradient for the char ascii art
//var charGrad0 = " .'`^,:;I!i<>~+_-?[]{}1()|/tfjrxnuvczXYUJCLQ0)Zmwqpdbkhao*#MW&8%B@$"; 
//var gradLen0 = charGrad0.length;
var charGrad0 = " .:-=+*#%@";
var gradLen0 = charGrad0.length;
var charGrad1 = "  .,:-=&";
var gradLen1 = charGrad1.length;
var charGrad2 = " -=#8";
var gradLen2 = charGrad2.length;


var gradients = [charGrad0, charGrad1, charGrad2];
var gradLens = [gradLen0, gradLen1, gradLen2];

var gradVal = 0;
var wantCharAscii = true;
var darkMode = true;
var cameraToggle = true;

// Set of pixalting width and height
var pxlWidth = cameraWidth/(10/scalar);
var pxlHeight = cameraHeight/(10/scalar);
var imgWidth = uploadWidth/(10/scalars[scalarIndex])
var imgHeight = uploadHeight/(10/scalars[scalarIndex])

// Set a variable for the video tag
const video = document.getElementById("video");
var playing = false;

//Function that copies to text that is currently in the image
const copyToClipboardAsync = str => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText){
        return navigator.clipboard.writeText(str);
    }
    return Promise.reject('The Clipboard API is not available.');
};

// Where the Ascii art values are stored
var text = ""

// Function to stream video from the web cam
async function streamVideo() {
    // Set video parameters
    const constraints = {
        // no audio is required
        audio: false,
        // Set the video size
        video: {
            width: cameraWidth, height: cameraHeight
        }
    };
    
    try {
        // Get the video stream
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        window.stream = stream;
        video.srcObject = stream;
        playing = true
         
    } catch (e) {
        alert("An error occurred while accessing the web cam.");
    }   
}

// Function to draw a video frame onto the canvas
function drawCanvas() {
    // Get context and draw frame from video element
    var canvas = document.getElementById("streamCanvas");
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
}

// Function to start the video stream
function startVideo() {
    cameraToggle = true
    streamVideo();
    video.play();
    live = true;
    charCanvas.width = cameraWidth*scalar*.61;
	charCanvas.height = cameraHeight*scalar;
}

// Function that toggles between pausing and playing the video stream
function pausePlayVideo() {
    if (playing === true){
        video.pause();
        playing = false;
    }
    else if (playing === false) {
        video.play();
        playing = true;
    }
}

// Function that stops the video stream
function stopVideo() {
    if (playing === false){
        video.play();
        playing = true;
    }
    
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
    });
}

//flip the array horizontally
function flipArray(array) {
    out = []
    for (let y = 0; y < array.length; y++) {
        let row = []
        for (let x = array[0].length - 1; x > -1; x--) {
            row.push(array[y][x])
        }
        out.push(row)
    }
    return out
}

// Function that takes in the canvas and returns a 2d array
function lineToArray(canvas){
    var asciiImage = document.getElementById(canvas).getContext('2d');
    var imgData = asciiImage.getImageData(0,0,cameraWidth,cameraHeight);
    var array = imgData.data;
    var pxlImg = []
    for (let j=0; j<4*(cameraHeight)-1; j+=4){
        var pxlRow = [];
        for (let i=(j*cameraWidth); i<(j*cameraWidth)+4*cameraWidth; i+=4){
                var pix = array[i];
                pxlRow.push(pix);
            }
        pxlImg.push(pxlRow);
    }
    return pxlImg
}

// Function that takes in camera input and spits out line art on canvas
function edgeDetection() {
    // Set interval to repeat function every 42 milliseconds
    setInterval(() => {
        if (cameraToggle === true){
        if (wantCharAscii === false){
           // Draw frame to the intermediate canvas
            drawCanvas();
            // Get the current frame from the intermediate canvas
            var src = cv.imread("streamCanvas");
            cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
            cv.Canny(src, src, 60, 100, 3, false);
            cv.imshow("edgeDetectionCanvas", src);
            var input = lineToArray("edgeDetectionCanvas");
            var binaryArray = arrayToBinaryArray(input, 0);
            var chunks = arrayToChunks(binaryArray, chunksVal);
            var lst = chunksToAscii(chunks);
            var array = reshape(lst, ROW_LENGTH);
            var lineArray = to_chrs(array);
            displayArray('charCanvas', lineArray);
            src.delete(); 
        }}
    }, 42);

}

// Function that takes in an array and returns a set of strings split my new line character
function splitLines(array) {
    text = "";
    for (const element of array) {
        for (const item of element) {
            text = text.concat(item);
        }
        text = text.concat("\n");
    }
    var lines = text.split('\n');
    return lines;
}

//Takes in the wanted display canvas and a 2D array and the array onto the canvas
function displayArray(canvas, array){
    var asciiCanvas = document.getElementById(canvas);
    var context = asciiCanvas.getContext('2d');
    context.clearRect(0,0,cameraWidth*scalar,cameraHeight*scalar);
    context.fillStyle = fontColor;
    context.font = asciiFont;
    characters = splitLines(array);
    for (var i = 0; i<characters.length; i++) {
        context.fillText(characters[i], 0, 15 + (i*11) );
    }
}

//Take in the gray scale canvas context and spits out an array of ascii values
function asciiConvert(canvas){
    var asciiImage = document.getElementById(canvas).getContext('2d');
    var imgData = asciiImage.getImageData(0,0,pxlWidth,pxlHeight);
    var array = imgData.data;
    var pxlImg = []
    for (let j=0; j<4*(pxlHeight)-1; j+=4){
        var pxlRow = [];
        for (let i=(j*pxlWidth); i<(j*pxlWidth)+4*pxlWidth; i+=4){
                var pix = array[i];
                let convertNum = Math.trunc((pix*gradLens[gradVal])/255)%gradLens[gradVal];
                var converted = gradients[gradVal][convertNum];
                pxlRow.push(converted);
            }
        pxlImg.push(pxlRow);
    }
    displayArray('charCanvas',pxlImg)
}

//Function that takes in stream to canvas, converts to grays scale, resizes, and then calls asciiConvert
function charAscii(){
    setInterval(() => {
        if (cameraToggle === true){
        if (wantCharAscii === true){
            drawCanvas();
            var src = cv.imread("streamCanvas");
            cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
            let dsize = new cv.Size(pxlWidth,pxlHeight);
            cv.resize(src, src, dsize, 0, 0, cv.INTER_CUBIC);
            cv.imshow("grayCharStreamCanvas" ,src);
            asciiConvert("grayCharStreamCanvas");
            src.delete(); 
        }}
    }, 42);
}

//Copy Ascii button function
function copyText(){
    copyToClipboardAsync(text);
}

//Inverts a string and returns it
function reverseString(str){
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return(joinArray);
}

//Inverts the ascii values
function invertGrad(){
    for (let i=0; i<gradients.length;i++){
        gradients[i] = reverseString(gradients[i]);
    }
}

//Loops through the available gradients
function loopGrad(){
    gradVal = (gradVal+1)%gradients.length;
}

//Adds the current gradient in the form to the array of the gradients
function addGrad(){
    var newGrad = prompt('enter new gradient:');
    if (newGrad != null){
        gradients.push(newGrad);
        gradLens.push(newGrad.length);
    }
}

//Resets the array with all the gradients and the array with the lengths to the default
function resetGrad(){
    gradients = [charGrad0, charGrad1, charGrad2];
    gradLens = [gradLen0, gradLen1, gradLen2];
    gradVal = 0;
}

function swapAscii(){
    var asciiCanvas = document.getElementById('charCanvas');
    var context = asciiCanvas.getContext('2d');
    if (wantCharAscii === true){
        wantCharAscii = false;
        context.clearRect(0,0,cameraWidth*scalar,cameraHeight*scalar);
    }
    else if (wantCharAscii === false){
        wantCharAscii = true;
        context.clearRect(0,0,cameraWidth*scalar,cameraHeight*scalar);
    }
}

//Resizes the Ascii Canvas to three preset sizes
function changeAsciiSize(){
    scalarIndex = (scalarIndex+1)%(scalars.length)
    scalar = scalars[scalarIndex];
	chunksVal = chunks[scalarIndex];
    charCanvas.width = cameraWidth*scalar*.61;
	charCanvas.height = cameraHeight*scalar;
    pxlWidth = cameraWidth/(10/scalar);
    pxlHeight = cameraHeight/(10/scalar);
}

//Swap Text and background colors
function lightDarkMode(){
    if (darkMode === true){
        fontColor = "black";
        darkMode = false;
        document.getElementById("charCanvas").style.backgroundColor="white";
    }
    else if (darkMode === false){
        fontColor = "white";
        darkMode = true;
        document.getElementById("charCanvas").style.backgroundColor="black";
    }
}


function convertImage(){
    if (document.getElementById("fileInput").files[0]==undefined){
        alert("No Image Uploaded");
    }
    else{
        cameraToggle = false;
        var img = new Image();
        img.onload = () => {
            // charCanvas.width = uploadWidth
            // charCanvas.height = uploadHeight
            var canvas = document.getElementById('imgUpload');
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0,0);
            if (wantCharAscii === true){
                var src = cv.imread("imgUpload");
                cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
                let dsize = new cv.Size(imgWidth,imgHeight);
                cv.resize(src, src, dsize, 0, 0, cv.INTER_CUBIC);
                cv.imshow("grayImgUpload" ,src);
                asciiConvert("grayImgUpload");
                src.delete();
            }
            else if (wantCharAscii === false){
                var src = cv.imread("imgUpload");
                cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
                cv.Canny(src, src, 60, 100, 3, false);
                cv.imshow("grayImgUpload", src);
                var input = lineToArray("grayImgUpload");
                var binaryArray = arrayToBinaryArray(input, 0);
                var chunks = arrayToChunks(binaryArray, chunksVal);
                var lst = chunksToAscii(chunks);
                var array = reshape(lst, ROW_LENGTH);
                var lineArray = to_chrs(array);
                displayArray('charCanvas', lineArray);
                src.delete(); 
            }
        }
        var smth = document.getElementById("fileInput").files[0]
        img.src = URL.createObjectURL(smth);
        //document.body.appendChild(img)
    }
}

// main function to clean up

function main() {
    // Hide the video tag
    video.style.display = "none";
    // Run edge detection
    edgeDetection();
    // Run char AscII function
    charAscii();
    
}

// Load main
main();
