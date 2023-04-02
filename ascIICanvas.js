const DEBUG = true;
const BLINKDELAY = 500;
const BLINKONCOLOR = 'magenta';
const BACKGROUNDCOLOR = 'black';
const TYPINGCOLOR = 'yellow';
const DEFAULTFILENAME = 'YourBeautifulASCIIArt.txt'
const DRAGCOLOR = 'aqua'
const BUTTONHOVERCOLOR = '#AAFF00';
const BUTTONCLICKCOLOR = 'yellow';

var CLIPBOARD = ""; //this is a makeshift clipboard, to get arround having to deal with a bunch of annoying permision stuff.



function ascIIButton(paragraph, borderChar, innerText, funct) {
    this.paragraph = paragraph;
    this.borderChar = borderChar;
    this.innerText = innerText;
    this.funct = funct;

    if (DEBUG) {
        console.log("making button")
    }

    this.rend = function() {
        let textToRend = "";
        buttonWidth = this.innerText.length + 2; //the idea is to pad the text with the border character.

        for (let i = 0; i < buttonWidth; i++) {
            textToRend += this.borderChar;
        }
        textToRend += '<br>';
        
        textToRend += this.borderChar;
        textToRend += this.innerText;
        textToRend += this.borderChar;
        textToRend += '<br>';

        for (let i = 0; i < buttonWidth; i++) {
            textToRend += this.borderChar;
        }
        textToRend += '<br>';
        this.paragraph.innerHTML = textToRend;
    }

    this.rend()

    this.paragraph.addEventListener('mousedown', ()=> {
        this.funct();
        this.paragraph.style.color = BUTTONCLICKCOLOR;
    });
    this.paragraph.addEventListener('mouseup', ()=> {
        this.paragraph.style.color = BUTTONHOVERCOLOR;
    })
    this.paragraph.addEventListener('mouseenter', ()=>{
        this.paragraph.style.color = BUTTONHOVERCOLOR;
    })
    this.paragraph.addEventListener('mouseleave', ()=> {
        this.paragraph.style.color = 'green';
    })

}

function ascIIEditor(paragraph, rows, cols, canvID, background) {



    //mode setters

    this.setMode = function(modeName) {
        //toggles all but one mode; sets that one mode
        for (nm of this.modeNames) {
            if (nm != modeName) {
                this.modeTogglers[nm](editor = this);
            }
        }
    } 

    this.setTypingMode = function(editor) {
        editor.setMode('typingMode');
        editor.typingMode = true;
        if (DEBUG) {
            console.log('set typing mode');
        }
        this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;

        
    }

    this.setDragMode = function(editor) {
        editor.setMode('dragMode');
        editor.clearDragSelected();
        editor.dragMode = true;
    }

    this.setCircleMode = function(editor) {
        editor.setMode('circleMode')
        editor.circleMode = true;

    }

    this.setBrushMode = function(editor) {
        editor.setMode('brushMode')
        editor.brushMode = true;
    }

    //mode togglers

    this.toggleTypingMode = function(editor) {
        editor.typingMode = false;
        if (DEBUG) {
            console.log('toggled typing mode')
        }
    }

    this.toggleDragMode = function(editor) {
        editor.clearDragSelected()
        editor.dragMode = false;
    }

    this.toggleCircleMode = function(editor) {
        editor.circleMode = false;
    }

    this.toggleBrushMode = function(editor) {
        editor.brushMode = false;
    }






    //nice stuff for making things

    function spaces(r,c) {
	//returns a rxc 2d array of spaces
        let spacesArray = [];
        for (let i = 0; i < r; i ++){
            let row = [];
            for (let j = 0; j< c; j++) {
                row.push('\xa0');
            }
            spacesArray.push(row);
        }
        return spacesArray;
    }


    //methods directly related to renduring stuff.

    this.setDrag = function(r,c) { //handles both turning the drag selected region blue, as well as setting the drag arrays

        this.drag = [r,c];

        var startR;
        var startC;
        var endR;
        var endC;

        if (this.drag[0] <= this.selected[0]) { //this sequence of for loops is used to determine the start and end X and Y values of the drag box
            startR = this.drag[0];
            endR = this.selected[0];
        }
        else {
            startR = this.selected[0];
            endR = this.drag[0];
        }

        if (this.drag[1] <= this.selected[1]) {
            startC = this.drag[1];
            endC = this.selected[1];
        }
        else {
            startC = this.selected[1];
            endC = this.drag[1];
        }
        
        for (let row = startR; row <= endR; row++) { //then we go and actually create the drag box.

            var dragSelectedArrayRow = [];
            var dragSelectedCharArrayRow = [];
            for (let col = startC; col <= endC; col++) {
                dragSelectedElt = this.spanArray[row][col].style.backgroundColor = DRAGCOLOR;
                dragSelectedArrayRow.push(dragSelectedElt);
                dragSelectedCharArrayRow.push(this.charArray[row][col]);
                this.dragSelectedCoords.push([row,col]);
            }
            this.dragSelectedArray.push(dragSelectedArrayRow);
            this.dragSelectedCharArray.push(dragSelectedCharArrayRow)
        }

    }


    this.clearDragSelected = function() {//This function is called to clear the color and data of the previous selection.
        var startR;
        var startC;
        var endR;
        var endC;

        this.dragSelectedArray = [];
        this.dragSelectedCoords = [];
        this.dragSelectedCharArray = []; //clears the previous arrays

        if (this.drag[0] <= this.selected[0]) { //finds the previous corners of the drag box.
            startR = this.drag[0];
            endR = this.selected[0];
        }
        else {
            startR = this.selected[0];
            endR = this.drag[0];
        }

        if (this.drag[1] <= this.selected[1]) {
            startC = this.drag[1];
            endC = this.selected[1];
        }
        else {
            startC = this.selected[1];
            endC = this.drag[1];
        }
        for (let row = startR; row <= endR; row++) { //goes through and removes the blue!
            for (let col = startC; col <= endC; col++) {
                this.spanArray[row][col].style.backgroundColor = 'transparent';
            }
        }
    }


    function makeBackground(r,c){ 
        //returns an rxc 2d array of spaces
        let spacesArray = [];
        for (let i = 0; i < r; i ++){
            let row = [];
            for (let j = 0; j< c; j++) {
                row.push(this.background);
            }
            spacesArray.push(row);
        }
        return spacesArray;
    }

    this.drawRect = function(x,y,w,h,character) {
        //edits this.charArray
        for (i = x; i < x + w + 1; i ++){
            for (j = y; j < y + h + 1; j ++){//maybe make these the minimum
                if (i < this.charArray.length) {
                    if (j < this.charArray[0].length) {
                        this.charArray[i][j] = character;
                    }
                }
            }
        }
        this.rendArray(); //then renders that array. This is what actually causes the rectangle to show up on the screen.
    }


    this.paintElipse = function() {
        //paints the area of a given elipse, as well as clears the previous elipse selection

        //clears elipse
        for (let i = 0; i < this.elipseSelectedArray.length; i++) {
            this.elipseSelectedArray[i].style.backgroundColor = 'transparent';
        }
        //creates the new elipse

        this.elipseSelectedArray = []

        for (let r = widthY - centerY**2; r <= widthY + centerY**2 ; r++) {
            for (let c = widthX - centerX**2; c<= widthX + centerX**2; c++) {
                if (((r- centerY)/(widthY))**2 + ((c-centerX)/(widthX))**2 < 2) { //equiation for an elipse
                    this.spanArray[r][c].style.backgroundColor = DRAGCOLOR;
                    this.elipseSelectedArray.push(this.spanArray[r][c]);
                }
            }
        }
    }


    this.drawElipse = function(centerX, centerY, widthX, widthY, char = " "){

        for (let r = widthY - centerY**2; r <= widthY + centerY**2 ; r++) {
            for (let c = widthX - centerX**2; c<= widthX + centerX**2; c++) {
                if (((r- centerY)/(widthY))**2 + ((c-centerX)/(widthX))**2 < 2) { //equiation for an elipse
                    this.setCharacter(r,c, char);
                }
            }
        }
    }

    this.fillDrag = function(char) { //this function fills the drag-selected area with a particular character
        console.log(this.dragSelectedCoords)
        for (let index = 0; index < this.dragSelectedCoords.length; index++) {
            
            this.setCharacter(this.dragSelectedCoords[index][0], this.dragSelectedCoords[index][1], char)
        }
    }


    this.createArray = function() {
        //this function is run upon intialization of the ascii canvas class.
        //it's job is to strategically label the elements of our paragraph using spans, and store those spans in an array, which is this.spanArray
            
    
        //this first loop goes through and labels the span tags, as well as gives them their inner text (usually a space)
    
            let htmlText = ''
                for (let r = 0; r < this.charArray.length; r ++) {
                        let rowText = ""
                        for (let c = 0; c< this.charArray[0].length; c ++){
                            rowText += `<span id = '${r}x${c}+${this.canvID}' loading="lazy" >`;
                            rowText += this.charArray[r][c];
                            rowText += `</span>`;
                        }
                        rowText += '<br>';
                        htmlText += rowText;
                    }
    
                this.paragraph.innerHTML = htmlText;
    
            /*this second loop  actually creates the reference to said elements in the spanArray. Having these references massively improves the efficiency  */
    
                for (let r = 0; r < this.charArray.length; r ++) {
                    let currentRow = [];
                    for (let c = 0; c < this.charArray[0].length; c++) {
                        spanPixel = document.getElementById(`${r}x${c}+${this.canvID}`);
                        currentRow.push(spanPixel);
                    }
                    this.spanArray.push(currentRow);
                }
            
        }
    
        
        this.rendArray = function() {
    
        //While createArray was responsible for actually putting the labels there, this function goes and makes sure the text is up to date
        //for many operations, however, it is best to avoid doing this, which is possible by directly referencing the pixel using spanArray.
            if (DEBUG) {
                console.log('rendering array')
            }        
            for (let r = 0; r < this.spanArray.length; r ++) {            
                for (let c = 0; c< this.spanArray[0].length; c ++) {                
                    let innerHTML = '';                
                    innerHTML += this.charArray[r][c];                              
                    this.spanArray[r][c].innerHTML = innerHTML;
                }          
            }
        }
    
    
    
        this.setCharacter = function(y,x,character) {
        //A simple yet powerful counterpart to rendArray, this directly changes the element. This could be done otherwise, but in my opinion it's more readable otherwise
            try {
                this.spanArray[y][x].innerText = character;
                this.charArray[y][x] = character;
            } catch {
                if (DEBUG) {
                    console.log(`unable to place character at index (${y}, ${x}), probably out of bounds...`)
                }
            }
            
        }
    
        this.setSelected = function(y,x) { 
            //sets the selected character to the new value.
    
            this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = 'transparent';
            this.selected = [y,x];
            this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = BLINKONCOLOR;
        }

    //file and clipboard related methods

    this.saveToTXT = function() {
	//automatically saves to a txt file which appears in the user's downloads folder. This is a pretty makeshift function, we may want to remake it.
        if (DEBUG) {
            console.log('saving to txt...')
        }

        var textToSave = "";

        if (!this.dragMode)
            for (let r = 0; r < this.charArray.length; r ++ ) {
                for (let c = 0; c < this.charArray[0].length; c ++ ) {
                    textToSave += this.charArray[r][c];
                }
                textToSave += '\n';
        } else {
            for (let r = 0; r < this.dragSelectedCharArray.length; r ++ ) {
                for (let c = 0; c < this.dragSelectedCharArray[0].length; c ++ ) {
                    textToSave += this.dragSelectedCharArray[r][c];
                    this.dragSelectedCharArray[r][c]
                }
                textToSave += '\n';
            }
        }
	//since the text content of the  paragraph includes <br> tags et cetera, it's better to recreate a massive string to be the content of the txt file

        

        let elt = document.createElement('a');
        elt.setAttribute('href', 'data:text/plane;charset=utf-8,' + encodeURIComponent(textToSave));
        elt.setAttribute('download', DEFAULTFILENAME);
        elt.style.display = 'none';
        document.body.appendChild(elt) //so you we can 'click' it
        elt.click();//force click the invisible download link
        document.body.removeChild(elt);// we don't want this in the document

        if (DEBUG) {
            console.log('succesfully saved as,',DEFAULTFILENAME);
        }
    }







    //attributes



    this.background = background;
    let backgroundToMake;
    if (background == '\x0a') {
        backgroundToMake = spaces(rows,cols);
    }
    else{
        backgroundToMake = makeBackground(rows, cols);
    }
    this.charArray = backgroundToMake;
    this.rows = rows;
    this.cols = cols;
    this.spanArray = []
    
    if (DEBUG) {
        console.log(canvID, 'is',this.selectable);
    }
    
    this.paragraph = paragraph;
    this.canvID = canvID
    this.selected = [0,0];

    this.toggleSelector = false;
    this.toggleBlink = false;
    
    this.selecterTag = `selectedInCanvas${this.canvID}`;
    this.lastChar = '*';
    this.typeingStartedAt = 0;

    this.typingMode = false;
    this.dragMode = false;
    this.brushMode = false; //for drawing with mouse


    

    this.typingBaseX = 0;

    this.drag = [10,10]; //used for the drag selection
    this.dragSelectedArray = [];
    this.dragSelectedCoords = [];
    this.dragSelectedCharArray = [];


    this.selectionMode = false
    this.dragMode = false
    this.circleMode = false


    this.modeNames = [
        'dragMode',
        'circleMode',
        'typingMode',
        'brushMode'
    ];

    this.modeSetters = {
        'dragMode' : this.setDragMode,
        'circleMode'  : this.setCircleMode,
        'typingMode' : this.setTypingMode,
        'brushMode' : this.setBrushMode
    };

    this.modeTogglers = {
        'dragMode' : this.toggleDragMode,
        'circleMode' : this.toggleCircleMode,
        'typingMode' : this.toggleTypingMode,
        'brushMode' : this.toggleBrushMode
    };

    
    this.createArray() 
    this.rendArray() //necessary for adding the selected tag
    if (DEBUG) {
        console.log('canvas initialized')
    }





    setInterval(
        ()=>{

            if (!this.toggleBlink) {
                this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = 'transparent';
                
            } else {
                this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = BLINKONCOLOR;
                
            }
            this.toggleBlink = !this.toggleBlink;

        },
        BLINKDELAY
    );

    window.addEventListener('keydown', (event) => {
        if (!this.dragMode) {
            dx = 0;
            dy = 0;
            x = this.selected[1];
            y = this.selected[0];
            if (event.code == 'ArrowLeft') {
                if ( x > 0) {
                    dx = -1;
                }
            } else if (event.code == 'ArrowRight') {
                if ( x < this.charArray[0].length - 1){
                    dx = 1;
                }
            } else if (event.code == 'ArrowDown') {
                if (y < this.charArray.length) {
                    dy = 1;
                }
            } else if (event.code == 'ArrowUp') {
                if (y > 0) {
                    dy = -1;
                }
            }
            x += dx;
            y += dy;
            if (this.brushMode) {
                this.setCharacter(y,x, this.lastChar);
            }
            this.setSelected(y, x);

        }
        else {

            dx = 0;
            dy = 0;
            x = this.drag[1];
            y = this.drag[0];
            if (event.code == 'ArrowLeft') {
                if ( x > 0) {
                    dx = -1;
                }
            } else if (event.code == 'ArrowRight') {
                if ( x < this.charArray[0].length - 1){
                    dx = 1;
                }
            } else if (event.code == 'ArrowDown') {
                if (y < this.charArray.length) {
                    dy = 1;
                }
            } else if (event.code == 'ArrowUp') {
                if (y > 0) {
                    dy = -1;
                }
            }
            x += dx;
            y += dy;
            this.clearDragSelected();
            this.setDrag(y, x);

        }
        
        
    
    });

    for (let r = 0; r < this.spanArray.length; r++) {
        for (let c = 0; c < this.spanArray[0].length; c ++) {
            this.spanArray[r][c].addEventListener('mousedown', (event)=>{
                
                if (!this.dragMode) {
                    this.setSelected(r,c);

                    //maybe change
                    if (!this.typingMode) {
                        this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = BLINKONCOLOR;
                    }
                    else {
                        this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;
                    }

                    if (event.which == 3) {
                        // this.charArray[this.selected[0]][this.selected[1]] = this.lastChar;
                        // this.setCharacter(this.selected[0], this.selected[1], this.lastChar);

                        //commenting out the above code may have fixed the problem with the selection with the mouse slowing things down.
                        if (!this.brushMode) {
                            this.setBrushMode(this);
                            console.log('setting brush mode')
                        }
                        else {
                            this.toggleBrushMode(this);
                            console.log('toggling brush mode')
                        }
                    }
                } else {

                    this.clearDragSelected()
                    this.setDrag(r,c);
                    //clear the last selection's color


                    //color stuff blue


                    
                }
                
                
            });

            this.spanArray[r][c].addEventListener('dblclick', (event)=> {
                if (this.dragMode) {
                    this.clearDragSelected()
                    this.setSelected(r,c);
                }
            })
            this.spanArray[r][c].addEventListener("mouseover", (event) => {
                if (this.brushMode) {
                    this.spanArray[r][c].innerText = this.lastChar;
                    this.charArray[r][c] = this.lastChar;
                }
                
                

            });
        }
    }
    

    window.addEventListener('keydown', (event) => {
        
        //commands
        if (event.altKey && event.ctrlKey){


            //most keyboard shortcuts are defined here
            if(event.code == 'Enter'){
                if (this.typingMode) {
                    this.toggleTypingMode(this);
                }
                else {
                    this.setTypingMode(this);
                }
                this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;
            }
            if (event.key == 's') {
                this.saveToTXT();
                if (DEBUG) {
                    console.log('saved to TXT')
                }
            }
            if (event.key == 'c') {
                this.charArray = spaces(this.rows, this.cols);
                this.rendArray();//this instance of rendArray is necessary
                console.log('cleared')
            }
            if (event.key == 'v') {
                if (!this.dragMode) {
                    this.setDragMode(this);
                }
                else{
                    this.toggleDragMode(this);
                }
                
            }
            if (event.key == 'r' && this.dragMode) {
                this.fillDrag(this.lastChar);
            }
            if (event.key == 'd') {
                if (this.brushMode) {
                    this.toggle
                }
            }
        }

        if (event.key == "Enter" && this.dragMode) {
            this.clearDragSelected();
            this.setSelected(this.drag[0], this.drag[1]);
        }


        if (!event.altKey) {
            if (event.key.length == 1){
                
                if (true){ //fix later
                    if (event.key != " "){
                        this.charArray[this.selected[0]][this.selected[1]] = event.key;
                        this.lastChar = event.key;
                    }
                    else{
                        this.charArray[this.selected[0]][this.selected[1]] = '\xa0';
                        this.lastChar = '\xa0';
                        
                    }
                    this.setCharacter(this.selected[0], this.selected[1], this.lastChar)
                    if (this.typingMode && this.selected[1] < this.spanArray[0].length - 1){
                        this.setSelected(this.selected[0], this.selected[1] + 1);
                        
                        
                    }
                    
                    if (this.typingMode){
                        
                        this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;
                    }
                }
                
            }
            else if (event.code == 'Backspace' && this.selected[1] > 0 && this.typingMode) {
                this.setCharacter(this.selected[0],this.selected[1], '\xa0');
                this.setSelected(this.selected[0], this.selected[1] - 1)
                
                this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;
                
                
            }
            else if (event.code == 'Enter' && this.selected[0] < this.spanArray.length - 1 && this.typingMode) {
                this.setSelected(this.selected[0] + 1, this.typingBaseX);
                this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;
            }
        }
        console.log(event.key == 'c' && event.altKey)

        
        
    })




}





function ascIICanvas(paragraph, rows, cols, background) {

    function spaces(r,c) {
	//returns a rxc 2d array of spaces
        let spacesArray = [];
        for (let i = 0; i < r; i ++){
            let row = [];
            for (let j = 0; j< c; j++) {
                row.push('\xa0');
            }
            spacesArray.push(row);
        }
        return spacesArray;
    }


    function makeBackground(r,c){ 
        //returns an rxc 2d array of spaces
        let spacesArray = [];
        for (let i = 0; i < r; i ++){
            let row = [];
            for (let j = 0; j< c; j++) {
                row.push(this.background);
            }
            spacesArray.push(row);
        }
        
        return spacesArray;
    }

    this.drawRect = function(x,y,w,h,character) {
        //edits this.charArray
        for (i = x; i < x + w + 1; i ++){
            for (j = y; j < y + h + 1; j ++){//maybe make these the minimum
                if (i < this.charArray.length) {
                    if (j < this.charArray[0].length) {
                        this.charArray[i][j] = character;
                    }
                }
            }
        }
        this.rendArray(); //then renders that array. This is what actually causes the rectangle to show up on the screen.
    }




    
    this.rendArray = function() {
        //I actually think the original version is faster for *static* graphics. If we want things like dynamic stuff, we want span tagts 
        //in order to be able to reference stuff. On the other hand, these span tags take a lot of resources to rendur, even though 
        //they make renduring faster so long as the page is loaded.
        if (DEBUG) {
            console.log('rendering array')
        }        

        let textToRend = "";
        for (let r = 0; r < this.charArray.length; r ++) {   
            let innerHTML = '';    
            for (let c = 0; c< this.charArray[0].length; c ++) {                
                            
                innerHTML += this.charArray[r][c];                 
            }          
            textToRend += innerHTML + "\n";
        }
        this.paragraph.innerHTML = textToRend;
    }

    this.background = background;
    let backgroundToMake;
    if (background == '\x0a') {
        backgroundToMake = spaces(rows,cols);
    }
    else{
        backgroundToMake = makeBackground(rows, cols);
    }


    //attributes
    this.charArray = backgroundToMake;
    this.rows = rows;
    this.cols = cols;
    
    this.paragraph = paragraph;
    
    this.rendArray() 
    if (DEBUG) {
        console.log('canvas initialized')
    }

}


function main(){


    

    canvParagraph = document.getElementById('ascIIEditor');
    canvParagraph.style.color = 'green';
    canvParagraph.style = 
    `font-family:'Courier New', Courier, monospace;
    line-height:0.9;
    font-size:1vw;
    overflow: hidden;
    position: absolute;
    height: 60vh;
    width: 60vw;
    left: 20vw;
    top: 12vw;
    background-color : black;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    border-style: solid;
    border-color: green;
    ;`;

    editor = new ascIIEditor(canvParagraph, 80, 100, 'Editor', background = '\x0a');
    //y,x
    
    editor.rendArray();

    document.body.style.background = 'black';
    canvParagraph.style.color = 'green';




    headerParagraph = document.getElementById('ascIIHeader');
    headerParagraph.style = 
    `
    
    font-family:'Courier New', Courier, monospace;
    line-height:0.9;
    font-size:1vw;
    overflow: hidden;
    
    height: 10vh;
    width: 98vw;
    left: 1vw;
    top: 0vh;
    float: left

    ;`;
    headerParagraph.style.color = 'green';
    headerCanv = new ascIICanvas(headerParagraph, 10, 200,'Header',background = '#');
    headerCanv.rendArray();



    //create typing mode button
    TypingModeButtonParagraph = document.getElementById('typingMode');
    TypingModeButtonParagraph.style = 
    `
    
    font-family:'Courier New', Courier, monospace;
    line-height:0.9;
    font-size:1vw;
    overflow: hidden;
    position: absolute;
    height: auto;
    width: auto;
    left: 1vw;
    top: 20vh;

    //make it unselectable
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    ;`;

    typingModeButton = new ascIIButton(TypingModeButtonParagraph, "*", "Typing Mode (Ctr+Alt+Enter)", () => {
        editor.setTypingMode(editor);
    })
    typingModeButton.paragraph.style.color = 'green';
    

    dragModeButtonParagraph = document.getElementById('dragMode');
    dragModeButtonParagraph.style = `

    font-family:'Courier New', Courier, monospace;
    line-height:0.9;
    font-size:1vw;
    overflow: hidden;
    position: absolute;

    height: auto;
    width: auto;
    left: 1vw;
    top: 25vh;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    
    `
    dragModeButtonParagraph.style.color = 'green';
    
    dragModeButtonParagraph = new ascIIButton(dragModeButtonParagraph, "*", "Drag Mode (Ctr+Alt+V)", () => {
        editor.setDragMode(editor)
    });



    circleModeButtonParagraph = document.getElementById('circleMode');
    circleModeButtonParagraph.style = `

    font-family:'Courier New', Courier, monospace;
    line-height:0.9;
    font-size:1vw;
    overflow: hidden;
    position: absolute;

    height: auto;
    width: auto;
    left: 1vw;
    top: 30vh;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    
    `
    circleModeButtonParagraph.style.color = 'green';
    
    circleModeButtonParagraph = new ascIIButton(circleModeButtonParagraph, "*", "Draw Circle (Ctr+Alt+C)", () => {
        console.log('cirlce mode button clicked');
        editor.drawElipse(editor.selected[1], editor.selected[0], 6*2,4*2, editor.lastChar);
    });
    
    
}

main()