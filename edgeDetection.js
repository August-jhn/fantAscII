
const charGrad = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,^`'. ";
const gradLen = charGrad.length;
const charGrad2 = " .:-=+*#%@" //"@%#*+=-:. "
const gradLen2 = charGrad2.length

const pxlWidth = cameraWidth/(10/scalar)
const pxlHeight = cameraHeight/(10/scalar)

const video = document.getElementById("video");
var playing = false

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
    canvas.style.display = 'none';
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
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
        cv.Canny(src, src, 60, 100, 3, false);
        cv.imshow("edgeDetectionCanvas", src);
        src.delete();
    }, 42);

}

// Function that takes in an array and returns a set of strings split my new line character
function splitLines(array) {
    var text = "";
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
                let convertNum = Math.trunc((pix*gradLen2)/255)%gradLen2;
                var converted = charGrad2[convertNum];
                pxlRow.push(converted);
            }
        pxlImg.push(pxlRow);
    }
    var asciiCanvas = document.getElementById('charCanvas');
    var context = asciiCanvas.getContext('2d');
    context.clearRect(0,0,cameraWidth*scalar,cameraHeight*scalar)
    context.fillStyle = "white";
    context.font = "bold 11px Courier";
    var characters = splitLines(pxlImg);
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
        cv.resize(src, src, dsize, 0, 0, cv.INTER_CUBIC)
        cv.imshow("grayCharStreamCanvas" ,src);
        asciiConvert();
        src.delete();
    }, 42);
}

function main() {
    // Hide the video tag
    video.style.display = "none";
    // Run edge detection
    edgeDetection();
    charAscii();
    
}

// Load main
main();
