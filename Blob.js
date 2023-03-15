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

    /*blobLogic(x,y){
        var found = false; 
        if (this.length>0){
            for (var i=0; i <this.length; i++){
                if (this.isNear(x,y)){
                    this.add(x,y);
                    found = true;
                    break;
                }
            }
        }
    
        if (!found){
            new Blob(x,y);
        }
    }*/
  }