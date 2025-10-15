let mainShader;
let video;
let cam;

const numberOfCols = 12; // how many colors are used
let cols = [];

async function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  mainShader = await loadShader('effect.vert', 'effect.frag');
  shader(mainShader); // tell p5js to use the shader
  
  video = createCapture(VIDEO);
  video.hide();
  
  cam = createGraphics(width, height); // used to store the video and use it as an input for the shader
  cam.translate(0, height);
  cam.scale(1, -1);
  
  // define a numberOfCols amound of random colors based on different levels of brightness
  const inc = 255 / numberOfCols;
  for(let i = 0; i < numberOfCols; i++) {
    const bright = i * inc;
    const index = i * 3;
    const col = calcColor(bright);
    cols[index] = col[0] / 255;
    cols[index+1] = col[1] / 255;
    cols[index+2] = col[2] / 255;
  }
  
  // set the variables in the shader using variables in the javascript code
  mainShader.setUniform('canvasSize', [width, height]);
  mainShader.setUniform('cols', cols);
  
  noStroke();
}

function draw() {
  clear();
  Back();
  
  mainShader.setUniform('tex0', cam);
  
  const inp = mouseX / width;
  mainShader.setUniform('tRounder', (inp != 0) ? inp : 0.01);
  
  // run shader
  rect(0, 0, width, height);
}

// simply sets the 'graphic' to the video input
function Back() {
  cam.background(0);
  
  cam.push();
  cam.translate(width, 0);
  cam.scale(-1, 1);
  cam.image(video, 0, 0, width * video.width / video.height, height);
  cam.pop();
}

// get different random colors
function resetColors() {
  cols = [];
  
  const inc = 255 / numberOfCols;
  for(let i = 0; i < numberOfCols; i++) {
    const bright = i * inc;
    const index = i * 3;
    const col = calcColor(bright);
    cols[index] = col[0] / 255;
    cols[index+1] = col[1] / 255;
    cols[index+2] = col[2] / 255;
  }
  mainShader.setUniform('cols', cols);
}

function keyPressed() {
  switch (key) {
    case 'r':
    case 'R':
      priorityColor = 0;
      break;
    case 'g':
    case 'G':
      priorityColor = 1;
      break;
    case 'b':
    case 'B':
      priorityColor = 2;
      break;
    default:
      priorityColor = 3;
      break;
  }
  
  resetColors();
}
