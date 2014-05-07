var Hammerhead = (function(parent){
  pointPrototype = {
    add: function(other){
      return point(this.x + other.x, this.y + other.y);
    },
    subtract: function(other){
      return point(this.x - other.x, this.y - other.y);
    },
    multiply: function(scalar){
      return point(this.x * scalar, this.y * scalar);
    },
    transform: function (matrix) {
      return point(this.x * matrix.a + matrix.e, this.y * matrix.d + matrix.f);
    },
    scaleTransform: function (matrix) {
      return point(this.x * matrix.a, this.y * matrix.d);
    }
  };

  var point = function(first, orthogonal){
    var x, y;

    if (orthogonal === undefined ) {
      if (first.x !== undefined) {
        y = first.y;
        x = first.x;
      } else if (first.pageX !== undefined) {
        y = first.pageY;
        x = first.pageX;
      } else if (first.deltaX !== undefined) {
        y = first.deltaY;
        x = first.deltaX;
      }
    } else {
      x = first;
      y = orthogonal;
    }

    var instance = Object.create(pointPrototype);
    instance.x = x;
    instance.y = y;
    return instance;
  };

  parent.Point = point;

  return parent;
}(Hammerhead || {}));

// function Point (x, y) {
//   this.x = x;
//   this.y = y;
// }

// Point.prototype = {
//   constructor: Point,
//   add: function (point) {
//     return new Point(this.x + point.x, this.y + point.y);
//   },
//   subtract: function (point) {
//     return new Point(this.x - point.x, this.y - point.y);
//   },
//   multiply: function (scalar) {
//     return new Point(this.x * scalar, this.y * scalar);
//   },
//   mapTo: function(region){
//     var matrix = region.getScreenCTM().inverse();
//     return this.transform(matrix);
//   },
//   transform: function (matrix) {
//     var x = this.x;
//     var y = this.y;
//     return new Point(x*matrix.a + matrix.e, y*matrix.d + matrix.f);
//   },
//   scaleTransform: function (matrix) {
//     return new Point(this.x * matrix.a, this.y * matrix.d);
//   },
//   scaleTo: function (region) {
//     var matrix = region.getScreenCTM().inverse();
//     return this.scaleTransform(matrix);
//   }
// };