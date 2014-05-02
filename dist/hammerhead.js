function Point (x, y) {
  this.x = x.x || x.pageX || x.deltaX || x;
  this.y = x.y || x.pageY || x.deltaY || y;
}

Point.prototype = {
  constructor: Point,
  add: function (point) {
    return new Point(this.x + point.x, this.y + point.y);
  },
  subtract: function (point) {
    return new Point(this.x - point.x, this.y - point.y);
  },
  multiply: function (scalar) {
    return new Point(this.x * scalar, this.y * scalar);
  },
  mapTo: function(region){
    var matrix = region.getScreenCTM().inverse();
    return this.transform(matrix);
  },
  transform: function (matrix) {
    var x = this.x;
    var y = this.y;
    return new Point(x*matrix.a + matrix.e, y*matrix.d + matrix.f);
  },
  scaleTransform: function (matrix) {
    return new Point(this.x * matrix.a, this.y * matrix.d);
  },
  scaleTo: function (region) {
    var matrix = region.getScreenCTM().inverse();
    return this.scaleTransform(matrix);
  }
};
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

  ViewBox.fromString = function(viewBoxString){
    
    var returnInt = function(string) {
      return parseInt(string, 10);
    };

    var limits = viewBoxString.split(' ').map(returnInt);
    var minimal = new Point(limits[0], limits[1]);
    var delta = new Point(limits[2], limits[3]);
    var maximal = minimal.add(delta);
    return new this(minimal, maximal);
  };
}());
var MobileSVG;
(function(){
  MobileSVG = function(element){
    var temporaryViewBox, inverseScreenCTM;
    var viewBoxString = element.getAttribute('viewBox');
    var viewBox = ViewBox.fromString(viewBoxString);
    var HOME = viewBox;
    var getIverseScreenCTM = function(){
      var inverse = element.getScreenCTM().inverse();
      // Windows Phone hack
      if (!window.devicePixelRatio) { inverse = inverse.scale(2); }
      return inverse;
    };

    inverseScreenCTM = getIverseScreenCTM();

    this.translate = function(delta){
      temporaryViewBox = viewBox.translate(delta);
      element.setAttribute('viewBox', temporaryViewBox.toString());
      return this;
    };

    this.drag = function(screenDelta){
      var delta = screenDelta.scaleTransform(inverseScreenCTM);
      return this.translate(delta);
    };

    this.scale = function(center, magnfication){
      temporaryViewBox = viewBox.scale(center, magnfication);
      element.setAttribute('viewBox', temporaryViewBox.toString());
      return this;
    };

    this.zoom = function(screenCenter, magnfication){
      var center = screenCenter.transform(inverseScreenCTM);
      return this.scale(center, magnfication);
    };

    this.fix = function(){
      viewBox = temporaryViewBox;
      return this;
    };

    this.home = function(){
      viewBox = HOME;
      element.setAttribute('viewBox', viewBox.toString());
    };

    this._test = {
      viewBox: viewBox
    };
  };
}());
var Hammerhead;
(function (){

  function isSVG (element) {
    return element && element.tagName.toLowerCase() == 'svg';
  }

  function getSVG (id) {
    var element = document.getElementById(id);
    if (isSVG(element)) { return element; }  
    throw 'Id: ' + id + ' is not a SVG element';
  }

  Hammerhead = function (id) {
    var lastFrame;
    var element = getSVG(id);
    var mobileSVG = new MobileSVG(element);
    var hammertime = Hammer(document, {preventDefault: true}).on('touch', touchHandler);

    var handlers = {
      drag: function(gesture){
        return mobileSVG.drag(new Point(gesture.deltaX, gesture.deltaY));
      },
      dragend: function(gesture){
        return mobileSVG.drag(new Point(gesture.deltaX, gesture.deltaY)).fix();
      },
      pinch: function(gesture){
        mobileSVG.zoom(new Point(gesture.center.pageX, gesture.center.pageY), gesture.scale);
      },
      transformend: function(gesture){
        mobileSVG.zoom(new Point(gesture.center.pageX, gesture.center.pageY), event.gesture.scale).fix();
      }
    };

    var gestureHandler = function(event){
      var gesture = event.gesture;
      gesture.preventDefault();
      var handler = handlers[event.type];
      if (handler) { 
        lastFrame = handler(gesture);
      }
    };

    function activityOn(instance){
      instance.on('dragstart drag dragend pinch transformend', gestureHandler);
      instance.on('release', releaseHandler);
    }
    function activityOff(instance){
      instance.off('dragstart drag dragend pinch transformend', gestureHandler);
      instance.off('release', releaseHandler);
    }
    function touchHandler (event) {
      event.gesture.preventDefault();
      if (event.target.ownerSVGElement === element) { activityOn(hammertime); }  
    }
    function releaseHandler (event) {
      if (lastFrame) {
        mobileSVG.fix();
      }
      activityOff(hammertime);
    }
    /* test-code */
    this._test = {
      hammertime: hammertime
    };
    /* end-test-code */
  };

}());

  // Doesnt work if target is svg
  // Give argument to expand hammer instance
  // return function will kill and home methods
  // possibly take config map for shortcut keys
  // include keystroke zoom and pan
  // keep mouse handlers private
  // Added mouse wheel support in configuration
  // mobilise method auto called
  // freeze method for swish loader
  // Need to clear hammer for testing
