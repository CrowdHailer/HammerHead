(function(parent){
  var prototype = {
    add: function(other){
      return create(this.x + other.x, this.y + other.y);
    },
    subtract: function(other){
      return create(this.x - other.x, this.y - other.y);
    },
    multiply: function(scalar){
      return create(this.x * scalar, this.y * scalar);
    },
    transform: function (matrix) {
      return create(this.x * matrix.a + matrix.e, this.y * matrix.d + matrix.f);
    },
    scaleTransform: function (matrix) {
      return create(this.x * matrix.a, this.y * matrix.d);
    }
  };

  var create = function(first, orthogonal){
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

    var instance = Object.create(prototype);
    instance.x = x;
    instance.y = y;
    return instance;
  };

  parent.Point = create;
}(Hammerhead));
