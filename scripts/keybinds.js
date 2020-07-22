document.body.setAttribute("onkeydown", "keyPressHandler(event)");

function keyPressHandler(e) {
  if (e.altKey) {
    if (e.preventDefault) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }

    switch (e.code) {
      case "KeyS": document.getElementById('pixelSizePopup').style.display='inline'; break; //save
      case "KeyR": reset(); break; //reset
      case "KeyP": sample(document.getElementById('sampler')); break; //pick (colour)
      case "KeyE": erase(document.getElementById('eraser')); break; //erase
      case "KeyF": filler(document.getElementById('filler')); break; //fill
      case "KeyC": colourer(document.getElementById('colourer')); break; //colour
      case "KeyL": liner(document.getElementById('liner')); break; //line
      case "KeyH": toggleMenu(document.getElementById('hideMenu')); break; //toggle menu
      case "KeyV": toggleView(); //toggle view
      case "KeyZ": 
        if (e.shiftKey) redo(); //redo
        else undo(); //undo
        break;
      case "KeyD": exportAsFile(); break; //download project
      case "Space": pen(document.getElementById('pen')); break; //pen
      case "KeyB": randomise.apply(undefined, prompt("Type in comma-separated values for the following (in order, no spaces):\nred min, red max, green min, green max, blue min, blue max, alpha min, alpha max.\nRGB can be 0-255, alpha can be 0-1. Example: 255,255,0,0,0,0,0.5,1").split(',').map(value=>Number(value))); break; //pen
    } 
  }
}