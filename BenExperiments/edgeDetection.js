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
    var canvas = document.getElementById("streamCanvas")
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0); 
}

// Function to start the video stream
function startVideo() {
    streamVideo();
}

// Function that toggles between pausing and playing the video stream
function pausePlayVideo() {
    if (playing === true){
        video.pause();
        playing = false;
        console.log(playing);
    }
    else if (playing === false) {
        video.play();
        playing = true;
        console.log(playing);
    }
}

// Function that stops the video stream
function stopVideo() {
    stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live') {
            track.stop();
        }
    });
}

// Function that applies OpenCV grayscale and immediately into edge detection
function edgeDetection() {
    
    // Start video stream
    //streamVideo();
    
    // Set interval to repeat function every 42 milliseconds
    setInterval(() => {
        // Draw frame to the intermediate canvas
        drawCanvas();
        
        // Get the current frame from the intermediate canvas
        var src = cv.imread("streamCanvas");
        cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        cv.imshow("blackAndWhite",src);
        cv.Canny(src, src, 60, 100, 3, false);
        cv.imshow("edgeDetectionCanvas", src);
        src.delete();
    }, 42);

    //setInterval(() => {
        // Draw frame to the intermediate canvas
        //drawCanvas();
        
        // Get the current frame from the intermediate canvas
        //var src = cv.imread("noBackStreamCanvas");
        //cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
        //cv.Canny(src, src, 90, 200, 3, false);
        //cv.imshow("noBackEdgeDetectionCanvas", src);
        //src.delete();
    //}, 42);
}

// main function to clean up
function main() {
    // Hide the video tag
    video.style.display = "none";
    // Run edge detection
    edgeDetection();
    
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