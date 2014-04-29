var viewFrame;
(function(){
  viewFrame = function(origin, size) {
    var HOME = { origin: origin, size: size };

    this.dX = function () { return size.x;   };
    this.dY = function () { return size.y;   };
    this.x0 = function () { return origin.x; };
    this.y0 = function () { return origin.y; };

    this.getOrigin = function(){ return origin; };
    this.getSize   = function(){ return size;   };

    this.setOrigin = function(point){ origin = point; };
    this.setSize = function(point){ size = point; };

    this.getHome = function(){ return HOME; };
  };

  viewFrame.prototype.translate = function(vector, permanent){
    var newOrigin = this.getOrigin().add(vector);
    if (permanent) {
      this.setOrigin(newOrigin);
    } else{
      return new viewFrame(newOrigin, this.getSize());
    }
  };

  viewFrame.prototype.scale = function(center, magnification, permanent){
    var newOrigin = this.getOrigin().subtract(center).multiply(magnification).add(center);
    var newSize = this.getSize().multiply(magnification);
    if (permanent) {
      this.setOrigin(newOrigin);
      this.setSize(newSize);
    } else{
      return new viewFrame(newOrigin, newSize);
    }
  };

  viewFrame.prototype.toString = function(){
    return [this.x0(), this.y0(), this.dX(), this.dY()].join(' ');
  };

  viewFrame.prototype.home = function(destination){
    var target = destination || this.getHome();
    this.setOrigin(target.origin);
    this.setSize(target.size);
  };
}());
