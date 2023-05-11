# fantAscII
A dynamic editor and image converter for ASCII art.

The main interface of this software can be found at either of the two addresses:

<a href = 'https://tinyurl.com/FantAscII'>tinyurl.com/FantAscII</a> OR <a href = 
'https://august-jhn.github.io/fantAscII'>august-jhn.github.io/fantAscII</a>

These links will take you to the editor.

# Editor Window (index.html along with AscIICanvas.js)

The editor window is the main window into our editor. Here, there a number of useful tools.

No matter which mode your in, there will always be a <i>selected</i> pixel, which will blink in magenta. Regardless of your mode, you 
can always enter in a character at the selected pixel by typing it in the keyboard. When not in drag-mode, you can always set the 
selected pixel by clicking on the editor. You can also navigate using the arrow keys.

## Drag Selection

To drag select, either click the drag selection button, or enter the command <i>Ctr+Alt+V</i>.

A basepoint will then be set at the selected pixel on the canvas. You can then select a second point, which will determine a 
rectangle of selected area.

There are essentially three uses of drag mode: <ul> <li>Filling the selected text with the last character pressed on the keyboard. 
This is done by entering <i>Ctr+Alt+R</i></li> <li>Copying a selected area of text. To copy the selected rectangle, enter 
<i>Ctr+Alt+K</i></li> <li>Saving the selected area of text as a text file. To do this, enter <i>Ctr+Alt+S</i> while in drag-selection 
mode</li> </ul>

It is possible to navigate the drag selector with only the keyboard. Use the arrow keys to adjust the box, and press enter to set the 
basepoint. To switch the selected character with the mouse, you must <i>double click</i>. When adjusting, just click on the editor.

## Copy and Paste

To copy the entire editor's text (only in the editor, we do not have access to the clipboard API in all browsers), you type 
<i>Ctr+Alt+K</i> while not in selection mode.

As already stated, you can also copy a selected are of text.

You can also paste text, starting at the selected pixel, by typing <i>Ctr+Alt+U.</i>

## Saving



## Paint Brush

We do not currently have a keyboard command for entering into the paint mode, though we plan to in later versions. To enter into the 
paint mode, click on the button.

A blue selection will follow your mouse, indicating where the last character typed will be placed when you drag on the editor.

You can also paint using the arrow keys, draging along with the selected pixel using the arrow keys.

## Shape

Currently, by pressing the shape button, a circle of a fixed size will be drawn. In later versions, more elaborate shapes will be 
possible to draw as well.

## Typing

It is possble to use the editor like a text editor. Either press the button for typing, or print the

## File Upload

To upload a text file, click the file upload button and select a text file.

Once this is done, then click the 'copy to clipboard' button, and use the paste command to view the text.

This is especially helpful for using the camera, as will be described later.

## Camera

The camera button opens a popup window with the interface.

If this popup window is to be used, you must first save as a text file from this window, and then use the upload feature to view your 
ASCII art in the editor.



# Camera Tool (ImgWindow.html, edgeDetection.js)

Our second feature is the camera interface. This is a tool which allows the user to either convert direct input from their webcam 
into ASCII, or to upload an image.

## Gradint Conversion/Line ASCII

Clicking the button 'toggle line ascii' will switch between these two modes.

Edge detection currently has some issues with sizing, which will be fixed in later versions.

## Uploading Custum Gradients

The user has the option to upload custom gradients. Preferably, these should be from light to dark

## Loop Gradients

To loop through various pre-made and custom gradients, click this button.

## Invert

To reverse the gradient's correspondence to pixel brightness, click this button.

## Toggle dark mode

To toggle between dark and light mode, click this button. Future versions of the editor will also support this feature.

## Copy to Clipboard

Unfortunately, due to DOM errors, we cannot actually use this clipboard to put your converted ASCII art into the editor. However, if 
you wish to copy and past something to a discord server, this is the button for you.

## Save as TXT

This button is important becaue it allows the user to take the converted image/webcam input and put it into the editor.

After the button 'save as txt' is clicked, a new file called ImageConverterOutput.txt (n) will be created. Find this in the editor by 
uploading it, and copying and pasting it there.
