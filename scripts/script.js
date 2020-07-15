//keeps track of whether to apply change when hovering over a pixel widthout a click if the mouse is already down
var mouseDown = false;
document.body.setAttribute('onmousedown', "mouseDown=true");
document.body.setAttribute('onmouseleave', "mouseDown=false");
document.body.setAttribute('onmouseup', "mouseDown=false");

//tools
var selecting = false;
var filling = false;
var oldcol = 'black';
var colourSelect = false;
var lining = false;
var movingSetting = false;

var colour = 'black';


//returns the formatted image url in b64
function makeImage(width, height, multiplier, data) {

  let imageWidth = width;
  let imageHeight = height;

  //makes all the pixels be the defined multiplier size
  function expandImage(pixelSize, imageData){
    let outputList = [];
    imageWidth *= pixelSize;
    imageHeight *= pixelSize;

    //basically inserts each pixel n times into the row, and each row n times into the image list
    for (row of imageData) {
      let newRow = [];
      for (pixel of row) {
        for (a=0; a<pixelSize; a++) {
          newRow.push(pixel);
        }
      }
      for (let b=0; b<pixelSize; b++) {
        outputList.push(newRow);
      }
    }
    return outputList.toString().replace(/[\[\]]/g, '').split(','); //returns as single list
  }

  let imageData = expandImage(multiplier, data);
  let formattedImageData = imageData.map(data=>String.fromCharCode(data)).join(''); //converts each element in the data list to the string from char code and puts it all in a big string
  let dataURL = btoa(generatePng(imageWidth, imageHeight, formattedImageData));
  let finalURL = 'data:image/png;base64,' + dataURL;
  //window.open(finalURL); //uncomment to make the new image open in a new tab
  img = document.createElement("img");
  img.src = finalURL;

  return img;
}

//function is run when a pixel is hovered
function divHover(element) {
  if ((!selecting) && (!movingSetting) && (!filling)) {
    let currentBackground = element.style.backgroundColor;
    if (!mouseDown) {
      element.setAttribute("onmouseleave", "this.style.backgroundColor='"+currentBackground+"';this.removeAttribute('onmouseleave')"); //if the mouse is not down, make it lose the colour when hovered out, and also delete the hover out event
    } 
    element.style.backgroundColor = colour;
  }
}

//function is run when a pixel is clicked
function divClick(element) {
  if (((!selecting) && (!filling)) && (!movingSetting)) {
    element.style.backgroundColor = colour;
    element.removeAttribute("onmouseleave"); //ensure the colour isn't reset by the hover event above
  } else if (selecting) {
    changeColour(element.style.backgroundColor);
  } else {
    fill(element);
  }
}


/* makes and displays the grid with the following layout:
<span><div></div><div></div></span<br>
<span><div></div><div></div></span

(each div is a pixel)*/
function makeGrid(width, height) {
  //scale to the most constricted element so that all the boxes fit on the page (set the line height accordingly)
  let a = window.innerHeight/height;
  let b = (window.innerWidth-110)/width; //the 110 is the sidebar width
  let divSize = Math.min(a,b)-2;
  document.body.style.lineHeight = (Math.floor(divSize)+1).toString()+'px';
  
  //actually make and append the elements to the page
  for (let a=0; a<height; a++) {
    let newSpan = document.createElement('span');
    newSpan.classList.add('rowSpan')
    document.body.appendChild(newSpan);

    for (let b=0; b<width; b++) {

      let newDiv = document.createElement('div');

      newDiv.style.height = newDiv.style.width = Math.floor(divSize).toString()+'px';

      newDiv.setAttribute("onclick","divClick(this)");
      newDiv.setAttribute("onmouseenter","divHover(this)");
      newDiv.setAttribute("onmousedown","divHover(this)");
      
      //make divs on the right and bottom have a border
      if (b-width == -1) {
        newDiv.style.borderRight = "solid gray 1px";
      }
      if (a-height == -1) {
        newDiv.style.borderBottom = "solid gray 1px";
      }

      newDiv.classList.add('pixel'); //pixel class has extra formatting (see style.css)


      newSpan.appendChild(newDiv);

    }

    document.body.innerHTML += '<br>';
  }
  document.body.innerHTML += '<br>';

  //make sure sliders are updated
  let currentColour = getColour();
  currentColour = currentColour.concat(rgbToHsl(currentColour[0], currentColour[1], currentColour[2]));
  updateSliders(currentColour);

}

//input:element
//output: [r, g, b, a] (0-255 for each)
function getDivColour(div) {
  let unformatted = window.getComputedStyle(div, null).getPropertyValue('background-color');
  let spliced = unformatted.replace(/[()a-z]/g, '');
  let listed = spliced.split(',');
  if (listed.length == 3) {
    listed.push(255);
  } else {
    listed[3] = Math.round(parseFloat(listed[3])*255);
  }
  let numerified = listed.map(x=>parseInt(x));
  return numerified;
}

//goes through each element and returns a compatible list of colours
function getImageData() {
  let imageData = [];
  let spans = document.getElementsByClassName('rowSpan');

  for (span of spans) {
    let rowData = [];
    let children = span.children;

    for (div of children) {
      rowData.push(getDivColour(div));
    }

    imageData.push(rowData);
  }
  
  return imageData;
}

//called on for filling
function fill(div) {
  let elements = [];
  let spans = document.getElementsByClassName('rowSpan');

  let x, y;

  let counterX = 0;
  for (span of spans) {
    elements.push(span.children);

    let counterY = 0;
    for (i of span.children) {
      if (i == div) {
        x = counterX;
        y = counterY;
        break;
      }
      counterY ++;
    }
    counterX ++;
  }

  let maxX = elements.length-1;
  let maxY = elements[0].length-1;

  let initialColour = getDivColour(elements[x][y]).join('');
  elements[x][y].style.backgroundColor = colour;
  let afterColour = getDivColour(elements[x][y]).join('');

  let toFillList = [[elements[x][y], x, y]];
  //debugger; //uncomment to see beautiful fill

  //fill algorithm
  if (initialColour !== afterColour) { //don't try filling in pixels to the same colour as the pixel that was clicked (causes infiniloop)
    for (; toFillList.length > 0; toFillList.shift()) { //while list has items, iterator: remove 1st element
      let div = toFillList[0];
      let x = div[1];
      let y = div[2];
  
      if ((x < maxX) && (getDivColour(elements[x+1][y]).join('')==initialColour)) {
        elements[x+1][y].style.backgroundColor = colour;
        toFillList.push([elements[x+1][y], x+1, y]);
      }
      if ((x > 0) && (getDivColour(elements[x-1][y]).join('')==initialColour)) {
        elements[x-1][y].style.backgroundColor = colour;
        toFillList.push([elements[x-1][y], x-1, y]);
      }
      if ((y < maxY) && (getDivColour(elements[x][y+1]).join('')==initialColour)) {
        elements[x][y+1].style.backgroundColor = colour;
        toFillList.push([elements[x][y+1], x, y+1]);
      }
      if ((y > 0) && (getDivColour(elements[x][y-1]).join('')==initialColour)) {
        elements[x][y-1].style.backgroundColor = colour;
        toFillList.push([elements[x][y-1], x, y-1]);
      }
    }
  }
  
  
}

function line(x0, y0, x1, y1) {
  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = (x0 < x1) ? 1 : -1;
  var sy = (y0 < y1) ? 1 : -1;
  var err = dx - dy;

  while(true) {
    setPixel(x0, y0); // Do what you need to for this

    if ((x0 === x1) && (y0 === y1)) break;
    var e2 = 2*err;
    if (e2 > -dy) { err -= dy; x0  += sx; }
    if (e2 < dx) { err += dx; y0  += sy; }
  }
}








//-------------tools-------------



//when the save button is clicked
function getImage() {
  document.getElementById('pixelSizePopup').style.display = 'none';
  let myImage = makeImage(settings[0],settings[1], parseInt(document.getElementById('pxsz').value), getImageData());
  document.body.appendChild(myImage);
}

//when the reset button is clicked
function reset() {
  for (div of document.getElementsByClassName('pixel')) {
    div.style.backgroundColor = '';
  }
}

//when the popup is confirmed
function start() {
  document.getElementById('sizePopup').style.display = 'none';
  document.getElementById('saver').style.display = 'inline';

  settings = [document.getElementById('startHeight').value, document.getElementById('startWidth').value];

  makeGrid(settings[0],settings[1]);
}

//when the sampler button is clicked
function sample(button) {
  document.getElementById('eraser').style.backgroundColor = '';

  document.getElementById('filler').style.backgroundColor = '';
  filling = false;


  if (button.style.backgroundColor == 'white') {
    selecting = false;
    button.style.backgroundColor = '';
  } else {
    colour = oldcol;
    selecting = true;
    button.style.backgroundColor = 'white';
  }
}

//when the eraser button is clicked
function erase(button) {
  document.getElementById('sampler').style.backgroundColor = '';
  selecting = false;

  document.getElementById('filler').style.backgroundColor = '';
  filling = false;


  if (button.style.backgroundColor == 'white') {
    colour = oldcol;
    button.style.backgroundColor = '';
  } else {
    oldcol = colour;
    colour = '';
    button.style.backgroundColor = 'white';
  }
}

//when the filler button is clicked
function filler(button) {
  document.getElementById('sampler').style.backgroundColor = '';
  selecting = false;

  document.getElementById('eraser').style.backgroundColor = '';
  colour = oldcol;


  if (button.style.backgroundColor == 'white') {
    filling = false;
    button.style.backgroundColor = '';
  } else {
    filling = true;
    button.style.backgroundColor = 'white';
  }
}



//when the filler button is clicked
function colourer(button) {
  if (button.style.backgroundColor == 'white') {
    colourSelect = false;
    button.style.backgroundColor = '';
    button.style.borderColor = colour;
    document.getElementById('colours').style.display = 'none';
  } else {
    colourSelect = true;
    button.style.backgroundColor = 'white';
    document.getElementById('colours').style.display = 'block';
  }
}

function liner() {
  //change settings and variables the call a line() function which follows the below.  
}







//confirm before leaving page
window.onbeforeunload = function (e) {
  e = e || window.event;
  // For IE and Firefox prior to version 4
  if (e) {
      e.returnValue = 'Sure?';
  }
  // For Safari
  return 'Sure?';
}


/*
Line drawing:


1. get all the elements as matrix
2. get the coord of the clicked square
3. set the divhover so that it finds its position in the matrix with x and y
4. when the divhover changes make it fill in the line with the algorith, but before colouring the pixel add it and its old colour to a list of pixels
5. if click, move out of line mode
6. if no click and hovered div changes, re-fill all the old divs from list and redo



make it so when tool selected no apparent differences (div still coloured when hovered), but when clicked, fills in that pixel and sets off the line divhover mode, and so live line is shown on pixel hover change. when clicked, line is filled in and line mode is still on, but a new starting pixel is needed







*/






/*

tools to add:
 
line
duplicate area

*/