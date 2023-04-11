// set a gradient for the char ascii art
var charGrad0 = " .'`^,:;I!i<>~+_-?[]{}1()|/tfjrxnuvczXYUJCLQ0)Zmwqpdbkhao*#MW&8%B@$"; 
var gradLen0 = charGrad0.length;
var charGrad1 = " .:-=+*#%@"
var gradLen1 = charGrad1.length
var charGrad2 = "  .,:-=&"
var gradLen2 = charGrad2.length

var gradients = [charGrad0, charGrad1, charGrad2];
var gradLens = [gradLen0, gradLen1, gradLen2];

var gradVal = 1;

// Set of pixalting width and height
var pxlWidth = cameraWidth/(10/scalar);
var pxlHeight = cameraHeight/(10/scalar);

// Set a variable for the video tag
const video = document.getElementById("video");
var playing = false;

//Function that copies to text that is currently in the image
const copyToClipboardAsync = str => {
    //console.log("function called")
    if (navigator && navigator.clipboard && navigator.clipboard.writeText){
        //console.log("if statement called")
        return navigator.clipboard.writeText(str);
    }
    //console.log("did not work")
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
    // var canvas = document.getElementById("charStreamCanvas");
    // var ctx = canvas.getContext('2d');
    // ctx.drawImage(video,0,0);
}

// Function to start the video stream
function startVideo() {
    streamVideo();
    live = true
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
        playing = true
    }
    
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
    });
}

// Function that applies OpenCV grayscale and immediately into edge detection
function edgeDetection() {
    // Set interval to repeat function every 42 milliseconds
    setInterval(() => {
        // Draw frame to the intermediate canvas
        drawCanvas();
        
        // Get the current frame from the intermediate canvas
        var src = cv.imread("streamCanvas");
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        //cv.imshow("blackAndWhite",src);
        cv.Canny(src, src, 60, 100, 3, false);
        cv.imshow("edgeDetectionCanvas", src);

        // var edgeDetected = document.getElementById('edgeDetectionCanvas').getContext('2d');
        // var imgData = edgeDetected.getImageData(0,0,cameraWidth,cameraHeight);
        // var array = imgData.data
        // var edgeImg = []
        // for (let j=0; j<4*(cameraHeight)-1; j+=4){
        //     var edgeRow = [];
        //     for (let i=(j*cameraWidth); i<(j*cameraWidth)+4*cameraWidth; i+=4){
        //             var pix = array[i];
        //             edgeRow.push(pix);
        //         }
        //     edgeImg.push(edgeRow);
        // }
        // console.log(edgeImg)

        src.delete();
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
    return lines
}

//Take in the gray scale canvas context and puts the conveted ascii characters onto the canvas
function asciiConvert(){
    var asciiImage = document.getElementById('grayCharStreamCanvas').getContext('2d');
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
    var asciiCanvas = document.getElementById('charCanvas');
    var context = asciiCanvas.getContext('2d');
    context.clearRect(0,0,cameraWidth*scalar,cameraHeight*scalar);
    context.fillStyle = "white";
    context.font = "bold 11px Courier";
    //var characters = splitLines(pxlImg);
    characters = splitLines(pxlImg);
    for (var i = 0; i<characters.length; i++) {
        context.fillText(characters[i], 0, 15 + (i*11) );
    }
}

//Function that takes in stream to canvas, converts to grays scale, resizes, and then calls asciiConvert
function charAscii(){
    setInterval(() => {
        drawCanvas();
        //var src = cv.imread("charStreamCanvas")
        var src = cv.imread("streamCanvas")
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        let dsize = new cv.Size(pxlWidth,pxlHeight);
        //cv.resize(src, src, dsize, 0, 0, cv.INTER_LANCZOS4);
        cv.resize(src, src, dsize, 0, 0, cv.INTER_CUBIC);
        cv.imshow("grayCharStreamCanvas" ,src);
        asciiConvert();
        src.delete();
    }, 42);
}

//Copy Ascii button function
function copyText(){
    copyToClipboardAsync(text)
}

//Inverts a string and returns it
function reverseString(str){
    var splitString = str.split("");
    var reverseArray = splitString.reverse();
    var joinArray = reverseArray.join("");
    return(joinArray)
}

//Inverts the ascii values
function invertGrad(){
    gradients[gradVal] = reverseString(gradients[gradVal])
}

//Loops through the available gradients
function loopGrad(){
    gradVal = (gradVal+1)%gradients.length
}

//Adds the current gradient in the form to the array of the gradients
function addGrad(){
    var newGrad = document.getElementById("addCharGradient").elements[0].value;
    if (newGrad != null){
        gradients.push(newGrad);
        gradLens.push(newGrad.length);
    }
}

//Resets the array with all the gradients and the array with the lengths to the default
function resetGrad(){
    gradients = [charGrad0, charGrad1, charGrad2];
    gradLens = [gradLen0, gradLen1, gradLen2];
    gradVal = 1;
}

// main function to clean up

function main() {
    // Hide the video tag
    video.style.display = "none";
    // Run edge detection
    edgeDetection();
    //test();
    charAscii();
    
}

// Load main
main();

// function removeBack(){
//     streamVideo();
//     const selfieSegmentation = new SelfieSegmentation({locateFile: (file) => {
//         return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
//       }});
//     setInterval(() => {
//         // Draw frame to the intermediate canvas
//         drawCanvas();

//         // Get the current frame from the intermediate canvas
//         var src = cv.imread("streamCanvas");
//         const segmentor = SelfiSegmentation()
//         var imgNoBg = segmentor.removeBG(src, (0,0,0), threshold=0.50)
//         cv.imshow("noBackStreamCanvas", src);
//         src.delete();
//     }, 42);
// }