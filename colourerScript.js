//called when colour is changed
function changeColour(col) {

  colour =  col;
  oldcol = col;

  document.getElementById('colourer').style.borderColor = col;

  let circles = document.getElementById('colourCirclesContainer').getElementsByClassName('colour');


  for (circle of circles) {
    if (circle.style.borderWidth === '3px') {
      circle.style.color = colour;
    }
  }

  let currentColour = getColour();
  currentColour = currentColour.concat(rgbToHsl(currentColour[0], currentColour[1], currentColour[2]));

  updateSliders(currentColour);

}

//called on when sliders change
function changeRGBAHSL(measure, value) {
  value = parseInt(value)
  document.getElementById(measure+'slider').value = value;
  document.getElementById(measure+'box').value = value;

  let currentColour = getColour().concat([parseInt(document.getElementById('Hslider').value), parseInt(document.getElementById('Sslider').value), parseInt(document.getElementById('Lslider').value)]); //returns RGBAHSL array
  let hsl, rgb;

  switch (measure) {
    case 'R':
      hsl = rgbToHsl(value, currentColour[1], currentColour[2]);
      currentColour[0] = value;
      currentColour[4] = hsl[0];
      currentColour[5] = hsl[1];
      currentColour[6] = hsl[2];
      break;

    case 'G':
      hsl = rgbToHsl(currentColour[0], value, currentColour[2]);
      currentColour[1] = value;
      currentColour[4] = hsl[0];
      currentColour[5] = hsl[1];
      currentColour[6] = hsl[2];
      break;

    case 'B':
      hsl = rgbToHsl(currentColour[0], currentColour[1], value);
      currentColour[2] = value;
      currentColour[4] = hsl[0];
      currentColour[5] = hsl[1];
      currentColour[6] = hsl[2];
      break;

    case 'A':
      currentColour[3] = value;
      break;

    case 'H':
      rgb = hslToRgb(value, currentColour[5], currentColour[6]);
      currentColour[4] = value;
      currentColour[0] = rgb[0];
      currentColour[1] = rgb[1];
      currentColour[2] = rgb[2];
      break;

    case 'S':
      rgb = hslToRgb(currentColour[4], value, currentColour[6]);
      currentColour[5] = value;
      currentColour[0] = rgb[0];
      currentColour[1] = rgb[1];
      currentColour[2] = rgb[2];
      break;

    case 'L':
      rgb = hslToRgb(currentColour[4], currentColour[5], value);
      currentColour[6] = value;
      currentColour[0] = rgb[0];
      currentColour[1] = rgb[1];
      currentColour[2] = rgb[2];
      break;
  }

  updateSliders(currentColour);

  changeColour(`rgb(${currentColour[0]}, ${currentColour[1]}, ${currentColour[2]}, ${currentColour[3]/255})`);


  //change slider and input values and !colour variables!
}

//credit: https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
function rgbToHsl(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h*255, s*255, l*255];
}
function hslToRgb(h, s, l){
  h /= 255, s /= 255, l /= 255;
  var r, g, b;

  if(s == 0){
    r = g = b = l; // achromatic
  }else{
    var hue2rgb = function hue2rgb(p, q, t) {
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function updateSliders(currentColour) {
  document.getElementById('Rslider').value = Math.round(currentColour[0]);
  document.getElementById('Rbox').value = Math.round(currentColour[0]);
  document.getElementById('Gslider').value = Math.round(currentColour[1]);
  document.getElementById('Gbox').value = Math.round(currentColour[1]);
  document.getElementById('Bslider').value = Math.round(currentColour[2]);
  document.getElementById('Bbox').value = Math.round(currentColour[2]);
  document.getElementById('Aslider').value = Math.round(currentColour[3]);
  document.getElementById('Abox').value = Math.round(currentColour[3]);
  if (currentColour[4] === 0) {
    document.getElementById('Hslider').value = 255;
    document.getElementById('Hbox').value = 255;
  } else {
    document.getElementById('Hslider').value = Math.round(currentColour[4]);
    document.getElementById('Hbox').value = Math.round(currentColour[4]);
  }
  document.getElementById('Sslider').value = Math.round(currentColour[5]);
  document.getElementById('Sbox').value = Math.round(currentColour[5]);
  document.getElementById('Lslider').value = Math.round(currentColour[6]);
  document.getElementById('Lbox').value = Math.round(currentColour[6]);
}

//creates a new circle when the + is clicked
function newColour() {
  let newCircle = document.createElement('div');
  newCircle.classList.add('colour');
  newCircle.setAttribute('onclick', "colourCircleClick(this)");

  document.getElementById('colourCirclesContainer').appendChild(newCircle);
}

function delColour() {
  let circles = document.getElementById('colourCirclesContainer').getElementsByClassName('colour');
  if (circles.length > 1) {
    for (circle of circles) {
      if (circle.style.borderColor === "white black black") {

        document.getElementById('colourCirclesContainer').removeChild(circle);
        let newMain = document.getElementById('colourCirclesContainer').children[2];

        newMain.style.borderWidth = '3px';
        newMain.style.width = "16px";
        newMain.style.height = "16px";
        newMain.style.borderColor = 'white black black black';

        let currentColour = getColour();
        currentColour = currentColour.concat(rgbToHsl(currentColour[0], currentColour[1], currentColour[2]));

        changeColour(`rgb(${currentColour[0]}, ${currentColour[1]}, ${currentColour[2]}, ${currentColour[3]/255})`);

        updateSliders(currentColour);
        exportColours();

      }
    }
  }
}

//changes the selected circle when clicked
function colourCircleClick(clickedCircle) {
  let circles = document.getElementById('colourCirclesContainer').getElementsByClassName('colour');

  document.getElementById('cssInput').value = '';

  for (circle of circles) {
    circle.style.borderWidth = '1px';
    circle.style.width = "20px";
    circle.style.height = "20px";
    circle.style.borderColor = 'black';
  }

  clickedCircle.style.borderWidth = '3px';
  clickedCircle.style.width = "16px";
  clickedCircle.style.height = "16px";
  clickedCircle.style.borderColor = 'white black black black';

  let currentColour = getColour();
  currentColour = currentColour.concat(rgbToHsl(currentColour[0], currentColour[1], currentColour[2]));

  changeColour(`rgb(${currentColour[0]}, ${currentColour[1]}, ${currentColour[2]}, ${currentColour[3]/255})`);


  updateSliders(currentColour);
}

//return the rgba of selected circle
function getColour() {
  let circles = document.getElementById('colourCirclesContainer').getElementsByClassName('colour');

  let circleColour;

  for (circle of circles) {
    if (circle.style.borderWidth === '3px') {
      circleColour = window.getComputedStyle(circle, null).getPropertyValue('color');
    }
  }
  let spliced = circleColour.replace(/[()a-z]/g, '');
  let listed = spliced.split(',');
  if (listed.length == 3) {
    listed.push(255);
  } else {
    listed[3] = Math.round(parseFloat(listed[3])*255);
  }
  let numerified = listed.map(x=>parseInt(x));

  return numerified;
}

//exports the colours to localstorage
function exportColours() {
  let circles = document.getElementById('colourCirclesContainer').getElementsByClassName('colour');

  let circleColour, spliced, listed, numerified;

  let toExport = [];

  for (circle of circles) {
    circleColour = window.getComputedStyle(circle, null).getPropertyValue('color');

    let spliced = circleColour.replace(/[()a-z]/g, '');
    let listed = spliced.split(',');
    if (listed.length == 3) {
      listed.push(255);
    } else {
      listed[3] = Math.round(parseFloat(listed[3])*255);
    }
    numerified = listed.map(x=>parseInt(x));
    numerified = numerified.join(',');

    toExport.push(numerified);
  }
  

  toExport = toExport.join('\n');
  localStorage.setItem('colourSettings', toExport);
}

//imports thecexisting colours from localstorage, if none generates a circle
function importColours() {
  let imported = localStorage.getItem('colourSettings');

  if (imported != undefined) {
    imported = imported.split('\n');

    for (importedColour of imported) {
      importedColour = importedColour.split(',');

      let newCircle = document.createElement('div');

      newCircle.classList.add('colour');
      newCircle.setAttribute('onclick', "colourCircleClick(this)");

      newCircle.style.color = `rgb(${importedColour[0]}, ${importedColour[1]}, ${importedColour[2]}, ${importedColour[3]/255})`;

      document.getElementById('colourCirclesContainer').appendChild(newCircle);
    }
  } else {
    let newCircle = document.createElement('div');
    newCircle.classList.add('colour');
    newCircle.setAttribute('onclick', "colourCircleClick(this)");

    document.getElementById('colourCirclesContainer').appendChild(newCircle);

  }
  document.getElementById('colourCirclesContainer').children[2].click();
}

importColours();