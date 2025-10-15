attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 pos;

void main() {
  pos = aTexCoord;
  
  // taking the original vertex positions which are in the 0 to 1 range
  vec4 position = vec4(aPosition, 1.0);
  // and were mapping them from -1 to 1 (which is the expected range for visible vertices)
  position.xy = position.xy * 2. - 1.;
  
  gl_Position = position;
}
