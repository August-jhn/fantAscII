const DEBUG = true;
const BLINKDELAY = 500;
const BLINKONCOLOR = 'magenta';
const BACKGROUNDCOLOR = 'black';
const TYPINGCOLOR = 'yellow';
const DEFAULTFILENAME = 'YourBeautifulASCIIArt.txt'

function ascIICanvas(paragraph, rows, cols, canvID, background, selectable = true) {

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
        this.rendArray(); //then rendurs that array. This is what actually causes the rectangle to show up on the screen.
    }

    this.saveToTXT = function() {
	//automatically saves to a txt file which appears in the user's downloads folder. This is a pretty makeshift function, we may want to remake it.
        if (DEBUG) {
            console.log('saving to txt...')
        }

        let textToSave = "";

        for (let r = 0; r < this.charArray.length; r ++ ) {
            for (let c = 0; c < this.charArray[0].length; c ++ ) {
                textToSave += this.charArray[r][c];
            }
            textToSave += '\n';

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



    this.createArray = function() {
	//this function is run upon intialization of the ascii canvas class.
	//it's job is to strategically label the elements of our paragraph using spans, and store those spans in an array, which is this.spanArray
        

	//this first loop goes through and labels the span tags, as well as gives them their inner text (usually a space)

	let htmlText = ''
        for (let r = 0; r < this.charArray.length; r ++) {
                let rowText = ""
                for (let c = 0; c< this.charArray[0].length; c ++){
                    rowText += `<span id = '${r}x${c}+${this.canvID}'>`;
                    rowText += this.charArray[r][c];
                    rowText += `</span>`;
                }
                rowText += '<br>';
                htmlText += rowText;
            }

        this.paragraph.innerHTML = htmlText;

	/*this second loop  actually creates the reference to said elements in the spanArray. Having these references massively improves the efficiency  */

        for (let r = 0; r < this.charArray.length; r ++) {
            let currentRow = []
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
        this.spanArray[y][x].innerText = character
    }

    this.setSelected = function(y,x) { 
        //sets the selected character to the new value.

        this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = 'transparent';
        this.selected = [y,x];
        this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = BLINKONCOLOR;
    }

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
    this.selectable = selectable
    console.log(canvID, 'is',this.selectable)

    this.paragraph = paragraph;
    this.canvID = canvID
    this.selected = [10,10];

    this.toggleSelector = false;
    this.toggleBlink = false;
    this.editingToggled = false;
    this.selecterTag = `selectedInCanvas${this.canvID}`;
    this.lastChar = '*';
    this.typeingStartedAt = 0;

    this.mouseMouseDrag = true;

    this.typingBaseX = 0;
    
    
    this.createArray() 
    this.rendArray() //necessary for adding the selected tag
    if (DEBUG) {
        console.log('canvas initialized')
    }

    if (this.selectable) {
        

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

            if (true) {
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
                this.setSelected(y, x);
                
            }
        });

        for (let r = 0; r < this.spanArray.length; r++) {
            for (let c = 0; c < this.spanArray[0].length; c ++) {
                this.spanArray[r][c].addEventListener('mousedown', (event)=>{
                    
                    
                    this.setSelected(r,c);

                    //maybe change
                    if (!this.editingToggled) {
                        this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = BLINKONCOLOR;
                    }
                    else {
                        this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;
                    }

                    if (event.which == 3) {
                        this.charArray[this.selected[0]][this.selected[1]] = this.lastChar;
                        this.setCharacter(this.selected[0], this.selected[1], this.lastChar);
                        this.mouseMouseDrag = !this.mouseMouseDrag;
                    }
                    
                    
                });
                this.spanArray[r][c].addEventListener("mouseover", (event) => {
                    if (this.mouseMouseDrag) {
                        this.spanArray[r][c].innerText = this.lastChar;
                        this.charArray[r][c] = this.lastChar;
                    }
                    
                    

                });
            }
        }
        

        window.addEventListener('keydown', (event) => {
            
            //commands
            if (event.altKey && event.ctrlKey){
                if(event.code == 'Enter'){
                    this.editingToggled = !this.editingToggled;
                    this.typingBaseX = this.selected[1];
                    if (DEBUG) {
                        console.log('editing toggled');
                    }
                    this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;
                }
                
                if (event.key == 's') {
                    this.saveToTXT();
                    console.log('hello there')
                }
                if (event.key == 'c') {
                    this.charArray = spaces(this.rows, this.cols);
                    this.rendArray();//this instance of rendArray is necessary
                    console.log('cleared')
                }
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
                        if (this.editingToggled && this.selected[1] < this.spanArray[0].length - 1){
                            this.setSelected(this.selected[0], this.selected[1] + 1);
                            
                            
                        }
                        
                        if (this.editingToggled){
                            
                            this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;
                        }
                    }
                    
                }
                else if (event.code == 'Backspace' && this.selected[1] > 0 && this.editingToggled) {
                    this.setCharacter(this.selected[0],this.selected[1], '\xa0');
                    this.setSelected(this.selected[0], this.selected[1] - 1)
                    
                    this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;
                    
                    
                }
                else if (event.code == 'Enter' && this.selected[0] < this.spanArray.length - 1 && this.editingToggled) {
                    this.setSelected(this.selected[0] + 1, this.typingBaseX);
                    this.spanArray[this.selected[0]][this.selected[1]].style.backgroundColor = TYPINGCOLOR;
                }
            }
            console.log(event.key == 'c' && event.altKey)

            
            
        })

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

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none

    border: solid;
    border-color: green;
    ;`;

    canv = new ascIICanvas(canvParagraph, 80, 100, 'Editor', background = '\x0a');
    //y,x
    
    canv.rendArray();

    document.body.style.background = 'black';
    canvParagraph.style.color = 'green';

    headerParagraph = document.getElementById('ascIIHeader');
    headerParagraph.style = 
    `
    
    font-family:'Courier New', Courier, monospace;
    line-height:0.9;
    font-size:1vw;
    overflow: hidden;
    position: absolute;
    height: 30vh;
    width: 98vw;
    left: 1vw;
    top: 0vh;

    ;`;
    headerParagraph.style.color = 'green'
    headerCanv = new ascIICanvas(headerParagraph, 10, 200,'Header',background = '#', selectable = false);
    headerCanv.drawRect(3,3,3,3,'*');
    headerCanv.rendArray();

    
    

    
}

main()
//want to be able to interpolate one canvas onto another. Similarly for a text file.
