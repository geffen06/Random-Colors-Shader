let priorityColor = 3;

// Takes a brightness value (from 0 - 255) and returns a random color with that brightness
function calcColor(B) {
  let tripleB = B * 3;
  
  let low = range(tripleB - 510);
  let high = range(tripleB);
  let r = random(low, high);
  
  low = range(tripleB - r - 255);
  high = range(tripleB - r);
  let g = random(low, high);
  
  let b = tripleB - r - g;
  
  let col = [r, g, b];
  if(priorityColor < 3) {
    col = priority(col, priorityColor);
  }
  
  return col;
}

function range(val) {
  if(val < 0) {
    return 0;
  } else if(val > 255) {
    return 255;
  } else {
    return val;
  }
}

// prioritizes a certain rgb (red, green, or blue) color by making that value the largest
function priority(col, val) {  
  let largest = col[val];
  let newVal = (val + 1) % 3;
  if(col[newVal] > largest) {
    let temp = col[val];
    col[val] = col[newVal];
    col[newVal] = temp;
  }
  
  largest = col[val];
  newVal = (val + 2) % 3;
  
  if(col[newVal] > largest) {
    let temp = col[val];
    col[val] = col[newVal];
    col[newVal] = temp;
  }
  
  return col;
}
