var Hammerhead = (function(parent){
  viewBoxPrototype = {
    x0: function(){ return this.getMinimal().x; },
    y0: function(){ return this.getMinimal().y; },
    x1: function(){ return this.getMaximal().x; },
    y1: function(){ return this.getMaximal().y; },
    dX: function(){ return this.x1() - this.x0(); },
    dY: function(){ return this.y1() - this.y0(); },
    toString: function(){
      return [this.x0(), this.y0(), this.dX(), this.dY()].join(' ');
    },
    translate: function(delta){
      var newMinimal = this.getMinimal().subtract(delta);
      var newMaximal = this.getMaximal().subtract(delta);
      return viewBox(newMinimal, newMaximal);
    },
    scale: function(center, scale){
      var boxScale = 1.0/scale;
      var newMinimal = this.getMinimal().subtract(center).multiply(boxScale).add(center);
      var newMaximal = this.getMaximal().subtract(center).multiply(boxScale).add(center);
      return viewBox(newMinimal, newMaximal);
    }
  };

  var viewBox = function(minimal, maximal){

    if (typeof minimal === 'string') { return fromString(minimal); }

    var instance = Object.create(viewBoxPrototype);
    instance.getMinimal = function(){ return minimal; };
    instance.getMaximal = function(){ return maximal; };
    return instance;
  };

  var fromString = function(viewBoxString){
    var returnInt = function(string) {
      return parseInt(string, 10);
    };

    var limits = viewBoxString.split(' ').map(returnInt);
    var minimal = parent.Point(limits[0], limits[1]);
    var delta = parent.Point(limits[2], limits[3]);
    var maximal = minimal.add(delta);
    return viewBox(minimal, maximal);

  };

  parent.ViewBox = viewBox;
  parent.ViewBox.fromString = fromString;

  return parent;
}(Hammerhead || {}));

// var ViewBox;
// (function(){
//   ViewBox = function(minimal, maximal){
//     this.getMinimal = function(){ return minimal; };
//     this.getMaximal = function(){ return maximal; };
//   };

//   ViewBox.prototype = {
//     constructor: ViewBox,
//     x0: function(){ return this.getMinimal().x; },
//     y0: function(){ return this.getMinimal().y; },
//     x1: function(){ return this.getMaximal().x; },
//     y1: function(){ return this.getMaximal().y; },
//     dX: function(){ return this.x1() - this.x0(); },
//     dY: function(){ return this.y1() - this.y0(); },
//     toString: function(){
//       return [this.x0(), this.y0(), this.dX(), this.dY()].join(' ');
//     },
//     translate: function(delta){
//       var newMinimal = this.getMinimal().subtract(delta);
//       var newMaximal = this.getMaximal().subtract(delta);
//       return new this.constructor(newMinimal, newMaximal);
//     },
//     scale: function(center, scale){
//       var boxScale = 1.0/scale;
//       var newMinimal = this.getMinimal().subtract(center).multiply(boxScale).add(center);
//       var newMaximal = this.getMaximal().subtract(center).multiply(boxScale).add(center);
//       return new this.constructor(newMinimal, newMaximal);
//     }
//   };

//   ViewBox.fromString = function(viewBoxString){
    
//     var returnInt = function(string) {
//       return parseInt(string, 10);
//     };

//     var limits = viewBoxString.split(' ').map(returnInt);
//     var minimal = new Point(limits[0], limits[1]);
//     var delta = new Point(limits[2], limits[3]);
//     var maximal = minimal.add(delta);
//     return new this(minimal, maximal);
//   };
// }());