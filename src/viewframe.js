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

    this.translate = function (vector) {
      return new viewFrame(origin.add(vector), size);
    };

    this.scale = function (center, magnification) {
      newOrigin = origin.subtract(center).multiply(magnification).add(center);
      newSize = size.multiply(magnification);
      return new viewFrame(newOrigin, newSize);
    };

    this.anchor = {

      translate: function (vector) {
        origin = origin.add(vector);
      },

      scale: function (center, magnification) {
        origin = origin.subtract(center).multiply(magnification).add(center);
        size = size.multiply(magnification);
      }
    };
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
