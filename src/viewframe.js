function viewFrame (origin, size) {
  this.origin = origin;
  this.size = size;
}

viewFrame.prototype = {
  constructor: viewFrame,
  width: function () {
    return this.size.x;
  },
  height: function () {
    return this.size.y;
  },
  left: function () {
    return this.origin.x;
  },
  bottom: function () {
    return this.origin.y;
  },
  toString: function () {
    return [this.left(), this.bottom(), this.width(), this.height()].join(' ');
  },
  translate: function (vector) {
    return new viewFrame(this.origin.add(vector), this.size);
  },
  anchorTranslate: function (vector) {
    this.origin = this.origin.add(vector);
  },
  scaleAt: function (center, magnification) {
    finalOrigin = this.origin.subtract(center).multiply(magnification).add(center);
    finalSize = this.size.multiply(magnification);
    return new viewFrame(finalOrigin, finalSize);
  },
  anchorScale: function (center, magnification) {
    this.origin = this.origin.subtract(center).multiply(magnification).add(center);
    this.size = this.size.multiply(magnification);
  }
};
