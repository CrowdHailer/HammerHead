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
}