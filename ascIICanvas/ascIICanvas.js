const DEBUG = true;
const STANDARDFONT = 'MingLiu'
const BLINKSPEED = 100;
const ALLOWEDCHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ %&/|+()*#"

function askiiCanvas(paragraph, rows, cols) {
//class, takes as arguments a paragraph, that is a <p> element,
// number of rows, and number of columns
    

/*
_______________________
METHODS
_______________________
*/
    function spaces(r,c){ 
        //returns an rxc 2d array of spaces
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

    this.drawRect = function(x,y,w,h,character) {
        for (i = x; i < x + w + 1; i ++){
            for (j = y; j < y + h + 1; j ++){//maybe make these the minimum
                if (i < this.charArray.length) {
                    if (j < this.charArray[0].length) {
                        this.charArray[i][j] = character;
                    }
                }
            }
        }
        this.rendArray();
    }

    this.createArray = function() {
        let htmlText = ''
        for (let r = 0; r < this.charArray.length; r ++) {
                rowText = ""
                for (let c = 0; c< this.charArray[0].length; c ++){
                    let is_selected = false;
                    
                    rowText += `<span id = '${r}x${c}'>`;
                    rowText += this.charArray[r][c];
                    rowText += `</span>`;

                }
                rowText += '<br>';
    
                htmlText += rowText;
            }

        this.paragraph.innerHTML = htmlText;

        for (let r = 0; r < this.charArray.length; r ++) {
            let currentRow = []
            for (let c = 0; c < this.charArray[0].length; c++) {
                spanPixel = document.getElementById(`${r}x${c}`);
                currentRow.push(spanPixel);
            }
            this.spanArray.push(currentRow);
        }
        
    }

    
    this.rendArray = function() {
        
        for (let r = 0; r < this.charArray.length; r ++) {
            
            for (let c = 0; c< this.charArray[0].length; c ++){
                
                
                this.spanArray[r][c].innerText = this.charArray[r][c];

            }
            
        }
        
    }

    
    this.font = STANDARDFONT;
    this.charArray = spaces(rows, cols);
    this.paragraph = paragraph;
    this.textToRender = "";
    this.selected = [10,10]; //this is the selected piece of text. It automatically defaults to 0
    this.toggleSelector = true;
    this.toggleBlink = false;
    var toggleBlink = false;
    var defaultColor = 'black';

    this.editingToggled = false;
    this.spanArray = []
    

    this.createArray()
    console.log(this.spanArray)
    
    
    // the code \xa0 is the code that always gives a space, otherwise html will edit it out



    /*
    ____________________________________________
    EVENTS AND INTERVALS
    ____________________________________________
    */

    // setInterval(()=> {
    //     if (!this.editingToggled){
    //         if (!toggleBlink){
    //             document.getElementById('selectedInCanvas').style.backgroundColor = defaultColor; 
    //             // I was having trouble referencing and editing this, so this certainly isn't great. Object oriented programming is hard to get the hang of.
    //         }
    //         else{
    //             document.getElementById('selectedInCanvas').style.backgroundColor = 'magenta';
    //         }
    //         toggleBlink = !toggleBlink;
    //     }
    // }, 400);


    // window.addEventListener('keydown', (event) => {

        
    //     if (!this.editingToggled){
    //         dx = 0;
    //         dy = 0;
    //         x = this.selected[1];
    //         y = this.selected[0];
    //         if (event.code == 'ArrowLeft') {
    //             if ( x > 0) {
    //                 dx = -1;
    //             }
    //         } else if (event.code == 'ArrowRight') {
    //             if ( x < this.charArray[0].length - 1){
    //                 dx = 1;
    //             }
    //         } else if (event.code == 'ArrowDown') {
    //             if (y > 0) {
    //                 dy = 1;
    //             }
    //         } else if (event.code == 'ArrowUp') {
    //             if (y < this.charArray.length) {
    //                 dy = -1;
    //             }
    //         }
    //         x += dx;
    //         y += dy;
    //         this.selected = [y,x];
    //         this.rendArray();
    //         document.getElementById('selectedInCanvas').style.backgroundColor = 'magenta'
    //     }   

    // });

    // window.addEventListener('keypress', (event) => {
        
    //     if(event.code == 'Enter'){
    //         this.editingToggled = !this.editingToggled;
    //         console.log('editing toggled')
    //         document.getElementById('selectedInCanvas').style.backgroundColor = 'yellow';
    //     }

    //     if (event.key.length == 1){
    //         if (true){ //fix later
    //             if (event.key != " "){
    //                 this.charArray[this.selected[0]][this.selected[1]] = event.key;
    //             }
    //             else{
    //                 this.charArray[this.selected[0]][this.selected[1]] = '\xa0';
    //             }
    //             this.rendArray()
    //             document.getElementById('selectedInCanvas').style.backgroundColor = 'yellow';
    //         }
            
    //     }
        

        
    // })

    if (DEBUG) {
        console.log('array initialized!');
    }
}

/*
____________________________________________
   Additional Comments
    ____________________________________________
*/

//I'm going to add code to have characters selected, by adding a div tag


function testing(){
    canvParagraph = document.getElementById('askiiCanvas');
    canvParagraph.style = 
    `font-family:'Courier New', Courier, monospace;
    line-height:0.9;
    font-size:1.5vw;
    overflow: hidden;
    height: 90vh;
    ;`;


    canv = new askiiCanvas(canvParagraph, 50, 100);
    
    
    canv.drawRect(10,10, 20,20, "+");
    canv.drawRect(20,30, 5,10, "X");
    
    canv.rendArray();

    document.body.style.background = 'black';
    canvParagraph.style.color = 'green';
    
}

testing();