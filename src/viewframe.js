function viewFrame (origin, size) {
  this.getOrigin = function () {
    return origin;
  };

  this.width = function () {
    return size.x;
  };

  this.height = function () {
    return size.y;
  };

  this.left = function () {
    return origin.x;
  };

  this.bottom = function () {
    return origin.y;
  };
  
  this.toString = function () {
  return [this.left(), this.bottom(), this.width(), this.height()].join(' ');
  };
}