// ********************************
// EXTENSIONS: 
// Changed shapes of grid in grid.js to change over time 
// implemented blob functionality from "colour tracking with blobs" week 17
// ********************************
var video;
var prevImg;
var diffImg;
var currImg;
var thresholdSlider;
var threshold;
var grid;
var blobs = [];


function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);

    grid = new Grid(640,480);
    blobs = new Blob(640,480)
}

function draw() {

    blobs = [];
    var sumX=0, sumY=0, avgX=0, avgY = 0;
    var matchCount=0;

    background(0);
    image(video, 0, 0);

    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);

    currImg.resize(currImg.width/4,currImg.height/4);
    currImg.filter(BLUR,3);

    diffImg = createImage(video.width, video.height);
    diffImg.loadPixels();

    diffImg.resize(diffImg.width/4,diffImg.height/4);

    threshold = thresholdSlider.value();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (var x = 0; x < currImg.width; x += 1) {
            for (var y = 0; y < currImg.height; y += 1) {
                var index = (x + (y * currImg.width)) * 4;
                var redSource = currImg.pixels[index + 0];
                var greenSource = currImg.pixels[index + 1];
                var blueSource = currImg.pixels[index + 2];

                var redBack = prevImg.pixels[index + 0];
                var greenBack = prevImg.pixels[index + 1];
                var blueBack = prevImg.pixels[index + 2];

                var d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                if (d > threshold) {
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }

                if (d > threshold){
                    blobLogic(x,y);
                    sumX += x;
                    sumY += y;
                    matchCount++
                }

            }
        }
    }
    diffImg.updatePixels();
    image(diffImg, 640, 0);

    noFill();
    stroke(255);
    text(threshold, 160, 35);

    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);

    grid.run(diffImg);

    if (matchCount>0){
        avgX = sumX / matchCount;
        avgY = sumY / matchCount;
    }

    for (var i=0; i<blobs.length; i++){
      blobs[i].show();
      console.log(blobs.length)
    }

}

function keyPressed() {
    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
    console.log("saved new background");
}

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2){
  var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
  return d;
}


function blobLogic(x,y){
    var found = false; 
    if (blobs.length>0){
        for (var i=0; i <blobs.length; i++){
            if (blobs[i].isNear(x,y)){
                blobs[i].add(x,y);
                found = true;
                break;
            }
        }
    }

    if (!found){
        blobs.push(new Blob(x,y));
    }
}
/*
class Blob {

    constructor(x, y) {
      this.minx = x;
      this.miny = y;
      this.maxx = x;
      this.maxy = y;
    }
  
    show() {
      push();
      fill(0,255,0,100)
      rectMode(CORNERS);
      rect(this.minx*4, this.miny*4, this.maxx*4, this.maxy*4);
      pop();   
    }
  
    add(x, y) {
      this.minx = min(this.minx, x);
      this.miny = min(this.miny, y);
      this.maxx = max(this.maxx, x);
      this.maxy = max(this.maxy, y);
    }
  
    size() {
      return (this.maxx-this.minx)*(this.maxy-this.miny);
    }
  
    isNear(x, y) {
      var cx = (this.minx + this.maxx) / 2;
      var cy = (this.miny + this.maxy) / 2;

      var d = dist(cx, cy, x, y);
      if (d < 30) {
        return true;
      } else {
        return false;
      }
    }
  }
*/
  
