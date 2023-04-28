const DEBUG = true;
const BLINKDELAY = 500;
const BLINKONCOLOR = 'magenta';
const BACKGROUNDCOLOR = 'black';
const TYPINGCOLOR = 'yellow';
const DEFAULTFILENAME = 'YourBeautifulASCIIArt.txt'
const DRAGCOLOR = 'aqua'
const BUTTONHOVERCOLOR = '#AAFF00';
const BUTTONCLICKCOLOR = 'yellow';
const DEFAULTCOLOR = 'green';

var CLIPBOARD = ""; //this is a makeshift clipboard, to get arround having to deal with a bunch of annoying permision stuff.

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
        // console.log(this.selected[0],this.selected[1])
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
    

    //methods directly related to renduring stuff.
    this.fillWithClipboard = function() {
        this.interpolateCharArray(this.clipboardToCharArray())
    }

    this.clipboardToCharArray = function() {
    
        var charArray = [];
        var row = [];
        for (let i = 0; i < CLIPBOARD.length; i ++) {
            
            if (CLIPBOARD[i] == "\n") {
                charArray.push(row);
                row = [];
            }
            else {
                row.push(CLIPBOARD[i]);
            }
        }
        return charArray;
    
            
    }

    this.interpolateCharArray = function(charArray) {
        //interpolates an array onto the selction box, or else onto the selected area
        if (this.dragMode) {
            console.log('TODO')
        }
        else {
            let baseCoord = this.selected
            for (let i = 0; i < charArray.length; i++) {
                for (let j = 0; j < charArray[0].length; j++) {
                    this.setCharacter(baseCoord[0] + i,baseCoord[1] + j,charArray[i][j]);
                }
            }
        }
        
    }

    this.copySelected = function() { //if there is a selection (i.e. in drag mode), then copy selected. Otherwise just copy everything
        var clipboardString = ""
        console.log('copying')
        if (this.dragMode) {
            
            console.log('in selection mode', this.dragMode)
            console.log(this.dragSelectedCharArray)
            for (let r = 0; r < this.dragSelectedCharArray.length; r++) {
                var rowString = ""
                for (let c = 0; c < this.dragSelectedCharArray[0].length; c++) {
                    rowString += this.dragSelectedCharArray[r][c];
                }
                
                clipboardString += rowString;
                clipboardString += "\n"
                console.log(rowString, 'copied')
            }
        }
        else {
            console.log('not in selection mode', this.dragMode)
            for (let r = 0; r < this.charArray.length; r++) {
                var rowString = ""
                for (let c = 0; c < this.charArray[0].length; c++) {
                    rowString += this.charArray[r][c];
                }
                
                clipboardString += rowString
                clipboardString += "\n"
                console.log(rowString)
                console.log(rowString, 'copied')
            }
        }
        CLIPBOARD = clipboardString;
        console.log(clipboardString)
        console.log('copied: ', '\n',CLIPBOARD)
    }

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
        // console.log(this.dragSelectedCoords)
        for (let index = 0; index < this.dragSelectedCoords.length; index++) {
            
            this.setCharacter(this.dragSelectedCoords[index][0], this.dragSelectedCoords[index][1], char)
        }
    }

    this.createArray = function() {
        //this function is run upon intialization of the ascii canvas class.
        //it's job is to strategically label the elements of our paragraph using spans, and store those spans in an array, which is this.spanArray
        //this first loop goes through and labels the span tags, as well as gives them their inner text (usually a space)
            let htmlText = '';
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
                    // console.log(r,c)
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
            var isInArray = false;
            try {
                tryMe = this.spanArray[y][x]
                isInArray = true;
            }
            catch {
                isInArray = false;
            }
            if (isInArray) {
                this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = 'transparent';
                this.selected = [y,x];
                this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = BLINKONCOLOR;
            }
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

    this.mouseDown = false

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
                    // if (event.which == 1) {
                    //     // this.charArray[this.selected[0]][this.selected[1]] = this.lastChar;
                    //     // this.setCharacter(this.selected[0], this.selected[1], this.lastChar);

                    //     //commenting out the above code may have fixed the problem with the selection with the mouse slowing things down.
                    //     // if (!this.brushMode) {
                    //     //     this.setBrushMode(this);
                    //     //     console.log('setting brush mode')
                    //     // }
                    //     // else {
                    //     //     this.toggleBrushMode(this);
                    //     //     console.log('toggling brush mode')
                    //     // }
                        
                    // }
                    this.mouseDown = true
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

            this.spanArray[r][c].addEventListener('mouseup', (event) => {
                this.mouseDown = false
            })

            this.spanArray[r][c].addEventListener("mouseover", (event) => {
                if (this.brushMode) {
                    this.spanArray[r][c].style.backgroundColor = DRAGCOLOR
                    if (this.mouseDown) {
                        this.spanArray[r][c].innerText = this.lastChar;
                        this.charArray[r][c] = this.lastChar;
                    }
                }
                
            });

            this.spanArray[r][c].addEventListener('mouseleave', (event) => {
                if (this.brushMode) {
                    this.spanArray[r][c].style.backgroundColor = 'transparent'
                }
                
            });
        }
    }
    

    window.addEventListener('keydown', (event) => {
        //commands
        if (event.altKey && event.ctrlKey){
            //most keyboard shortcuts are defined here

            if(event.key == 'U') {
                console.log('pasting')
                this.fillWithClipboard();
            }

            if(event.key == 'K') {
                this.copySelected();
            }

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
            if (event.key.toUpperCase() == 'K') {
                this.copySelected()
            }
            if (event.key.toUpperCase() == 'U') {
                this.fillWithClipboard()
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
        // console.log(event.key == 'c' && event.altKey)
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

function button(div, funct) {
    this.div = div;
    this.funct = funct;

    this.div.addEventListener('mousedown', ()=> {
        this.funct();
        this.div.style.color = BUTTONCLICKCOLOR;
    });
    this.div.addEventListener('mouseup', ()=> {
        this.div.style.color = BUTTONHOVERCOLOR;
    })
    this.div.addEventListener('mouseenter', ()=>{
        this.div.style.color = BUTTONHOVERCOLOR;
    })
    this.div.addEventListener('mouseleave', ()=> {
        this.div.style.color = DEFAULTCOLOR;
    })
}

function main() {
    canvas = document.getElementById("editor");

    editor = new ascIIEditor(canvas, 47, 149, 'Editor', background = '\x0a');

    selectDiv = document.getElementById("select");
    select = new button(selectDiv, () => {
        if (!editor.dragMode) {
            editor.setDragMode(editor);
        }
        else {
            editor.toggleDragMode(editor)
        }
        
    })

    brushDiv = document.getElementById("brush");
    brush = new button(brushDiv, () => {
        if (!editor.brushMode){
            editor.setBrushMode(editor);
        }
        else {
            editor.toggleBrushMode(editor)
        }
    })

    eraseDiv = document.getElementById("erase");
    erase = new button(eraseDiv, () => {
        //editor.setBrushMode(editor);
        console.log("TODO");
    })

    // textDiv = document.getElementById("text");
    // text = new button(textDiv, () => {
    //     //editor.setBrushMode(editor);
    //     console.log("TODO");
    // })

    fillDiv = document.getElementById("fill");
    fill = new button(fillDiv, () => {
        //editor.setBrushMode(editor);
        console.log("TODO");
    })

    typingDiv = document.getElementById("typing");
    typing = new button(typingDiv, () => {
        if (!editor.typingMode) {
            editor.setTypingMode(editor);
        }
        else {
            editor.toggleTypingMode(editor)
        }
    })

    shapeDiv = document.getElementById("shape");
    shape = new button(shapeDiv, () => {
        editor.drawElipse(editor.selected[1], editor.selected[0], 6*2,4*2, editor.lastChar);
    })

    switchDiv = document.getElementById("mode_switch");
    mode_switch = new button(switchDiv, () => {
        //editor.setTypingMode(editor);
        console.log("TODO");
    })

    clearDiv = document.getElementById("clear");
    clear = new button(clearDiv, () => {
        editor.charArray = spaces(editor.rows, editor.cols);
        editor.rendArray();
        console.log('cleared');
    })

    cameraDiv = document.getElementById("camera");
    camera = new button(cameraDiv, () => {
        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=0,height=0,left=-1000,top=-1000`;
            window.open('ImgWindow.html', 'test', params);
        console.log('camera window opening')
        // console.log("TODO");
    })

    settingsDiv = document.getElementById("settings");
    settings = new button(settingsDiv, () => {
        console.log("TODO");
    })

    infoDiv = document.getElementById("info");
    info = new button(infoDiv, () => {
        console.log("TODO");
    })
}

main()