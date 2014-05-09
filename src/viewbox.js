var Hammerhead = (function(parent){
  viewBoxPrototype = {
    x0: function(){ return this.getMinimal().x; },
    y0: function(){ return this.getMinimal().y; },
    x1: function(){ return this.getMaximal().x; },
    y1: function(){ return this.getMaximal().y; },
    dX: function(){ return this.x1() - this.x0(); },
    dY: function(){ return this.y1() - this.y0(); },
    xMid: function(){ return 0.5 * (this.x0() + this.x1()); },
    yMid: function(){ return 0.5 * (this.y0() + this.y1()); },
    center: function(){ return this.getMinimal().add(this.getMaximal()).multiply(0.5); },
    extent: function(){ return this.getMaximal().subtract(this.getMinimal()); },
    toString: function(){
      return [this.x0(), this.y0(), this.dX(), this.dY()].join(' ');
    },
    translate: function(delta){
      var newMinimal = this.getMinimal().subtract(delta);
      var newMaximal = this.getMaximal().subtract(delta);
      return viewBox(newMinimal, newMaximal, this.getValidator());
    },
    scale: function(scale, center){
      var boxScale = 1.0/scale;
      center = center || this.center();
      var newMinimal = this.getMinimal().subtract(center).multiply(boxScale).add(center);
      var newMaximal = this.getMaximal().subtract(center).multiply(boxScale).add(center);
      return viewBox(newMinimal, newMaximal, this.getValidator());
    }
  };

  var viewBox = function(minimal, maximal, validator){
    if (typeof minimal === 'string') { return fromString(minimal); }

    var instance = Object.create(viewBoxPrototype);
    instance.getMinimal = function(){ return minimal; };
    instance.getMaximal = function(){ return maximal; };
    instance.setMinimal = function(min){ minimal = min; };
    instance.setMaximal = function(max){ maximal = max; };
    instance.getValidator = function(){ return validator; };
    instance.valid = function(){
      return validator.call(instance);
    };
    return instance;
  };

  var fromString = function(viewBoxString){
    var returnInt = function(string) { return parseInt(string, 10); };

    var limits  = viewBoxString.split(' ').map(returnInt),
        minimal = parent.Point(limits[0], limits[1]),
        delta   = parent.Point(limits[2], limits[3]),
        maximal = minimal.add(delta);
    return viewBox(minimal, maximal);
  };

  parent.ViewBox = viewBox;
  return parent;
}(Hammerhead || {}));
