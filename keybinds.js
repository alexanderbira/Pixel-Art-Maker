document.body.setAttribute("onkeydown", "keyPressHandler(event)");

function keyPressHandler(e) {
  if (e.altKey) {
    if (e.code == "KeyS") document.getElementById('pixelSizePopup').style.display='inline'; //save
    if (e.code == "KeyR") reset(); //reset
    if (e.code == "KeyP") sample(document.getElementById('sampler')); //pick (colour)
    if (e.code == "KeyE") erase(document.getElementById('eraser')); //erase
    if (e.code == "KeyF") filler(document.getElementById('filler')); //fill
    if (e.code == "KeyC") colourer(document.getElementById('colourer')); //colour
  }
}