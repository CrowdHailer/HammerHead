var ViewBox;
(function(){
  ViewBox = function(minimal, maximal){
    this.getMinimal = function(){ return minimal; };
    this.getMaximal = function(){ return maximal; };
  };

  ViewBox.prototype = {
    constructor: ViewBox,
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
      return new this.constructor(newMinimal, newMaximal);
    },
    scale: function(center, scale){
      var boxScale = 1.0/scale;
      var newMinimal = this.getMinimal().subtract(center).multiply(boxScale).add(center);
      var newMaximal = this.getMaximal().subtract(center).multiply(boxScale).add(center);
      return new this.constructor(newMinimal, newMaximal);
    }
  };
}());