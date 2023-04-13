// set a gradient for the char ascii art
const charGrad = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,^`'. ";
const gradLen = charGrad.length;
const charGrad2 = " .:-=+*#%@" //"@%#*+=-:. "
const gradLen2 = charGrad2.length

// Set of pixalting width and height
const pxlWidth = cameraWidth/(10/scalar)
const pxlHeight = cameraHeight/(10/scalar)

// Set a variable for the video tag
const video = document.getElementById("video");
var playing = false

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
    canvas.style.display = 'none';
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
    context.fillStyle = "green";
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


// function charFakeAscii() {
//     setInterval(() => {
//         drawCanvas();
//         var src = cv.imread("charStreamCanvas")
//         cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
//         //let dsize = new cv.Size(pxlWidth,pxlHeight);
//         //cv.resize(src, src, dsize, 0, 0, cv.INTER_LANCZOS4);
//         //cv.resize(src, src, dsize, 0, 0, cv.INTER_CUBIC)
//         cv.imshow("grayCharStreamCanvas" ,src);
//         asciiConvert();
//         src.delete();
//     }, 42);
    
// }

// function asciiFakeConvert(){ 
//     var asciiImage = document.getElementById('grayCharStreamCanvas').getContext('2d');
//     var imgData = asciiImage.getImageData(0,0,cameraWidth,cameraHeight);
//     //var pix = imgData.data[0,0];
//     //console.log(pix)
//     var pxlImg = []
//     for (let j=0; j<(cameraHeight)-2; j+=20){
//         var pxlRow = [];
//         for (let i=0; i<(cameraWidth)-2; i+=10){
//                 var pix = imgData.data[i,j];
//                 //console.log([i,j])
//                 //console.log(pix)
//                 let convertNum = Math.round((pix*gradLen)/255)%gradLen;
//                 var converted = charGrad[convertNum];
//                 pxlRow.push(converted);
//             }
//         pxlImg.push(pxlRow);
//     }
//     //console.log(pxlImg)
//     var asciiCanvas = document.getElementById('charCanvas');
//     var context = asciiCanvas.getContext('2d');
//     context.clearRect(0,0,cameraWidth,cameraHeight)
//     context.fillStyle = "white";
//     context.font = "bold 16px Courier";
//     var characters = splitLines(pxlImg);
//     for (var i = 0; i<characters.length; i++) {
//         context.fillText(characters[i], 0, 15 + (i*15) );
//     }
// }   

// //Test Function to see if the fillText command and splitLines command were working
// function test() {
//     var asciiCanvas = document.getElementById('charCanvas');
//     var context = asciiCanvas.getContext('2d');
//     context.fillStyle = "white";
//     context.font = "bold 18px Arial";
//     var test = [[1,3,4,3],[5,8,4,2],[7,5,3,2],[9,7,4,2]];
//     var text = "";
//     for (const element of test) {
//         for (const item of element) {
//             text = text.concat(item);
//         }
//         text = text.concat("\n");
//       }
//     console.log(text);
//     var lines = text.split('\n');
//     for (var i = 0; i<lines.length; i++) {
//         context.fillText(lines[i], 0, 15 + (i*15) );
//     }
        
//     //context.fillText(text, 0, 15);

// }


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