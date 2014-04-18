function viewFrame (origin, size) {

  this.dX = function () { return size.x;   };
  this.dY = function () { return size.y;   };
  this.x0 = function () { return origin.x; };
  this.y0 = function () { return origin.y; };

  this.toString = function () {
    return [this.x0(), this.y0(), this.dX(), this.dY()].join(' ');
  };

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

}
