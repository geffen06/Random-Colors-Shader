// this file runs on the gpu to alter each pixel every frame without lag

precision mediump float;
precision mediump int;

uniform sampler2D tex0;
varying vec2 pos;
uniform vec2 canvasSize;

const int numOfCols = 12;
uniform vec3 cols[numOfCols]; // get the array of colors from the javascript file/the cpu

const float tRounder = 0.55; // This value determines the "detail" of the video/image

float floorToNearest(float value, float nearest) {
  return (nearest * floor(value / nearest));
}
float ceilToNearest(float value, float nearest) {
  return (nearest * ceil(value / nearest));
}

void main() {
  // Blur the video to create smoother shapes/less noise
  vec4 tex = vec4(0.);
  vec2 pixelStep = 1. / canvasSize;
  const float blurAmount = 5.;
  for (float i = -blurAmount; i <= blurAmount; i++) {
    for (float j = -blurAmount; j <= blurAmount; j++) {
      vec4 pixel = texture2D(
        tex0, 
        pos + vec2(i * pixelStep.x, j * pixelStep.y)
      ); // get this pixel color from the video taken from the javascript file
      tex += pixel;
    }
  }
  tex /= (2. * blurAmount + 1.) * (2. * blurAmount + 1.);
  
  float floatNumOfCols = float(numOfCols);
  
  float brightness = (tex.r + tex.g + tex.b) / 3.;
  float nearest = 1. / floatNumOfCols;
  float flooredBrightness = floorToNearest(brightness, nearest); // floor the brightness to the nearest brightness with a color
  
  float idxf = floor(flooredBrightness * floatNumOfCols); // get the color index based on the rounded brightness
  idxf = clamp(idxf, 0.0, float(numOfCols - 1)); // clamp the index to ensure it is within range of the array
  int index = int(idxf);
  
  // get t for the lerping
  float t = (brightness - flooredBrightness) / nearest;
  t = ceilToNearest(t, tRounder); // round the t to create interesting shapes
  t = clamp(t, 0.0, 1.0);
  
  vec3 col = vec3(0.);
  // col = cols[index] doesn't work in GLSL so a for loop is used
  if (index == numOfCols-1) {
    // if index is the end of the array there is no index+1 thus no lerp
    for (int i = 0; i < numOfCols; i++) {
      float m = (i == index) ? 1.0 : 0.0;
      col += cols[i] * m;
    }
  } else {
    for (int i = 0; i < numOfCols; i++) {
      float m1 = (i == index) ? (1.0-t) : 0.0;
      float m2 = (i == index+1) ? t : 0.0;
      col += cols[i] * m1 + cols[i] * m2;
    }
  }
  
  gl_FragColor = vec4(col.r, col.g, col.b, 1.); // output pixel
}
