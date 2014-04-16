function viewFrame (origin, size) {
  this.getOrigin = function () {
    return origin;
  };
  this.getWidth = function () {
    return size.x;
  };
}