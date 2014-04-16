function viewFrame (origin, size) {

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

  this.translate = function (vector) {
    return new viewFrame(origin.add(vector), size);
  };

  this.anchorTranslate = function (vector) {
    origin = origin.add(vector);
  };
}