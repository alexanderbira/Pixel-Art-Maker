document.getElementById('coloursheader').setAttribute('onmousedown', 'startTracking(event)');

document.getElementById('colours').style.top = '0px';
document.getElementById('colours').style.left = '100px';

var colourX = 0, colourY = 0;

function startTracking(event) {
  movingSetting = true;

  colourX = event.clientX;
  colourY = event.clientY;

  document.addEventListener('mousemove', moveColour);
  document.addEventListener('mouseup', mouseGoesUp);
}

function moveColour(event) {
  let xChange = colourX - event.clientX;
  let yChange = colourY - event.clientY;

  colourX = event.clientX;
  colourY = event.clientY;

  let currentTop = (document.getElementById('colours').style.top.replace(/px/,''));
  let currentLeft = (document.getElementById('colours').style.left.replace(/px/,''));

  let newTop = (currentTop - yChange);
  let newLeft = (currentLeft - xChange);

  if (newLeft < 55) {
    newLeft = 55;
  } else if (newLeft > window.innerWidth-270) {
    newLeft = window.innerWidth-270;
  }

  if (newTop < 5) {
    newTop = 5;
  } else if (newTop > window.innerHeight-372) {
    newTop = window.innerHeight-372;
  }

  document.getElementById('colours').style.top = newTop + 'px';
  document.getElementById('colours').style.left = newLeft + 'px';
}

function mouseGoesUp() {
  movingSetting = false;

  document.removeEventListener('mouseup', mouseGoesUp);
  document.removeEventListener('mousemove', moveColour);
}