'use strict';

var _ = require('lodash');


function gravity(g, width, height, cropWidth, cropHeight){
  var x, y;

  // set the default x/y, same as gravity 'c' for center
  x = width/2 - cropWidth/2;
  y = height/2 - cropHeight/2;

  switch(g){
  case 'n':
    y = 0;
    break;
  case 'ne':
    x = width - cropWidth;
    y = 0;
    break;
  case 'nw':
    x = 0;
    y = 0;
    break;
  case 's':
    y = height - cropHeight;
    break;
  case 'se':
    x = width - cropWidth;
    y = height - cropHeight;
    break;
  case 'sw':
    x = 0;
    y = height - cropHeight;
    break;
  case 'e':
    x = width - cropWidth;
    break;
  case 'w':
    x = 0;
    break;
  }

  // make sure we do not return numbers less than zero
  if (x < 0){ x = 0; }
  if (y < 0){ y = 0; }

  return {
    x: Math.floor(x),
    y: Math.floor(y)
  };
}
exports.gravity = gravity;


function xy(modifiers, width, height, cropWidth, cropHeight){
  var x,y, dims;

  dims = gravity(modifiers.gravity, width, height, cropWidth, cropHeight);

  if (_.has(modifiers, 'x')){
    x = modifiers.x;
    if(x < 0) {
      dims.x = 0;
    } else if (x <= width - cropWidth){
      dims.x = modifiers.x;
    } else {
      // don't ignore modifier dimension
      // instead, place within bounds
      dims.x = width - cropWidth;
    }
  }

  if (_.has(modifiers, 'y')){
    y = modifiers.y;
    if(y < 0) {
      dims.y = 0;
    } else if (y <= height - cropHeight){
      dims.y = modifiers.y;
    }else{
      // don't ignore modifier dimension
      // instead, place within bounds
      dims.y = height - cropHeight;
    }
  }

  return dims;
}
exports.xy = xy;


exports.cropFill = function(modifiers, size){
  var newWd, newHt,
      cropWidth, cropHeight,
      crop;

  /* If only one dimension cropped, assume square crop */
  if (modifiers.width === null){
    modifiers.width = modifiers.height;
  }
  if (modifiers.height === null){
    modifiers.height = modifiers.width;
  }

  /* I don't know if it's safe to modify the modifiers, so clone it */
  var clonedModifiers = JSON.parse(JSON.stringify(modifiers));

  /* Fit crop to image */
  var scale = Math.min(size.height/modifiers.height, size.width/modifiers.width);
  if(scale < 1) {
    /* Crop too big, scale it down */
    cropWidth = modifiers.width * scale;
    cropHeight = modifiers.height * scale;
    newWd = size.width;
    newHt = size.height;
    /* Calculate focus */
    if(clonedModifiers.x) {
      clonedModifiers.x -= cropWidth/2;
    }
    if(clonedModifiers.y) {
      clonedModifiers.y -= cropHeight/2;
    }
  } else {
    /* Image too big, scale it down */
    cropWidth = modifiers.width;
    cropHeight = modifiers.height;
    newWd = size.width / scale;
    newHt = size.height / scale;
    /* Calculate focus */
    if(clonedModifiers.x) {
      clonedModifiers.x /= scale;
      clonedModifiers.x -= cropWidth/2;
    }
    if(clonedModifiers.y) {
      clonedModifiers.y /= scale;
      clonedModifiers.y -= cropHeight/2;
    }
  }

  // get the crop X/Y as defined by the gravity or x/y modifiers
  crop = xy(clonedModifiers, newWd, newHt, cropWidth, cropHeight);

  return {
    resize: {
      width: Math.round(newWd),
      height: Math.round(newHt)
    },
    crop: {
      width: Math.round(cropWidth),
      height: Math.round(cropHeight),
      x: Math.round(crop.x),
      y: Math.round(crop.y)
    }
  };
};

