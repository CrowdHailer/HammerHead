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
      return viewBox(newMinimal, newMaximal);
    },
    scale: function(scale, center){
      var boxScale = 1.0/scale;
      center = center || this.center();
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
    instance.setMinimal = function(min){ minimal = min; };
    instance.setMaximal = function(max){ maximal = max; };
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
var Hammerhead = (function(parent){
  var prototype = {
  };

  var DEFAULTS = {
    throttleDelay: 300,
    centerScale: 4
  };

  var create = function(element, options){
    var temporary, current, HOME;
    options = _.extend({}, DEFAULTS, options);
    HOME = temporary = current = parent.ViewBox(element.getAttribute('viewBox'));

    // update = _.partial(element.setAttribute, 'viewBox');
    function update(viewBoxString){
      element.setAttribute('viewBox', viewBoxString);
    }
    update = _.throttle(update, options.throttleDelay);

    function translate(delta){
      temporary = current.translate(delta);
      update(temporary.toString());
      return this;
    }

    function drag(screenDelta){
      var delta = screenDelta.scaleTransform(element.getScreenCTM().inverse());
      return this.translate(delta);
    }

    function scale(magnfication, center){
      temporary = current.scale(magnfication, center);
      update(temporary.toString());
      return this;
    }

    function zoom(magnfication, screenCenter){
      var center = screenCenter.transform(element.getScreenCTM().inverse());
      return this.scale(magnfication, center);
    }

    function fix(){
      current = temporary;
      return this;
    }

    function home(min, max){
      if (min && max) {
        temporary.setMinimal(min);
        temporary.setMaximal(max);
      } else {
        temporary = HOME;
      }
      update(temporary.toString());
      return this;
    }

    function goTo(target, magnfication){
      magnfication = magnfication || options.centerScale;
      var spacing = HOME.extent().multiply(1.0/(2*magnfication));
      temporary.setMinimal(target.subtract(spacing));
      temporary.setMaximal(target.add(spacing));
      update(temporary.toString());
      return this; 
    }

    var instance = Object.create(prototype);
    [translate, drag, scale, zoom, fix, home, goTo].forEach(function(privilaged){
      instance[privilaged.name] = privilaged;
    });
    return instance;
  };

  parent.MobileSVG = create;
  return parent;
}(Hammerhead || {}));

// var MobileSVG;
// (function(){
//   MobileSVG = function(element){
//     var temporaryViewBox, inverseScreenCTM, viewBox, HOME;
//     viewBox = ViewBox.fromString(element.getAttribute('viewBox'));
//     HOME = viewBox;
//     temporaryViewBox = viewBox;
//     var getInverseScreenCTM = function(){
//       var inverse = element.getScreenCTM().inverse();
//       // Windows Phone hack
//       if (!window.devicePixelRatio) { inverse = inverse.scale(2); }
//       return inverse;
//     };

//     this.updateCTM = function(){
//       inverseScreenCTM = getInverseScreenCTM();
//     };
//     this.updateCTM();

//     this.translate = function(delta){
//       temporaryViewBox = viewBox.translate(delta);
//       element.setAttribute('viewBox', temporaryViewBox.toString());
//       return this;
//     };

//     this.drag = function(screenDelta){
//       var delta = screenDelta.scaleTransform(inverseScreenCTM);
//       return this.translate(delta);
//     };

//     this.scale = function(center, magnfication){
//       temporaryViewBox = viewBox.scale(center, magnfication);
//       element.setAttribute('viewBox', temporaryViewBox.toString());
//       return this;
//     };

//     this.zoom = function(screenCenter, magnfication){
//       var center = screenCenter.transform(inverseScreenCTM);
//       return this.scale(center, magnfication);
//     };

//     this.fix = function(){
//       viewBox = temporaryViewBox;
//       return this;
//     };

//     this.home = function(){
//       viewBox = HOME;
//       element.setAttribute('viewBox', viewBox.toString());
//     };
//   };
// }());
var Hammerhead = (function(parent){
  var Pt = Hammerhead.Point;

  function getSVG (id) {
    var element = document.getElementById(id);
    if (element && element.tagName.toLowerCase() == 'svg') { return element; }
    throw 'Id: ' + id + ' is not a SVG element';
  }

  var prototype = {};
  var DEFAULTS = {
    dragX: 100,
    dragY: 100,
    zoomIn: 1.25,
    zoomOut: 0.8
  };

  function create(id, options){
    options = _.extend({}, DEFAULTS, options);
    // console.log(options);
    var element = getSVG(id);
    var mobileSVG = Hammerhead.MobileSVG(element, options);
    var hammertime = Hammer(document).on('touch', touchHandler);
    

    function touchHandler (event) {
      event.gesture.preventDefault();
      if (event.target.ownerSVGElement === element) { activityOn(hammertime); }  
    }

    function releaseHandler (event) {
      mobileSVG.fix();
      // mobileSVG.updateCTM();
      activityOff(hammertime);
    }

    function activityOn(instance){
      instance.on('dragstart drag transformstart pinch', gestureHandler);
      instance.on('release', releaseHandler);
    }

    function activityOff(instance){
      instance.off('dragstart drag transformstart pinch', gestureHandler);
      instance.off('release', releaseHandler);
    }

    var gestureHandler = function(event){
      var gesture = event.gesture;
      gesture.preventDefault();
      handlers[event.type](gesture);
    };

    var handlers = {
      dragstart: function(gesture){
        mobileSVG.fix();
      },
      drag: function(gesture){
        mobileSVG.drag(Pt(gesture.deltaX, gesture.deltaY));
      },
      transformstart: function(){
        mobileSVG.fix();
      },
      pinch: function(gesture){
        mobileSVG.zoom(gesture.scale, Pt(gesture.center.pageX, gesture.center.pageY));
      }
    };

    var instance = Object.create(prototype);
    instance.drag = function(x, y){ 
      mobileSVG.drag(Pt(x, y));
      return this;
    };
    instance.dragX = function(x){
      mobileSVG.drag(Pt(x || options.dragX, 0));
      return this;
    };
    instance.dragY = function(y){
      mobileSVG.drag(Pt(0, y || options.dragY));
      return this;
    };
    instance.zoom = function(x, y, m){
      mobileSVG.zoom(m, Pt(x, y));
    };
    instance.zoomIn = function(){
      mobileSVG.scale(options.zoomIn);
    };
    instance.zoomOut = function(){
      mobileSVG.scale(options.zoomOut);
    };
    instance.fix = function(){ mobileSVG.fix(); };
    instance._test = {
      hammertime: hammertime,
      handlers: handlers
    };
    return instance;
  }

  return _.extend(create, parent);
}(Hammerhead || {}));

// var old;
// (function (){

//   function isSVG (element) {
//     return element && element.tagName.toLowerCase() == 'svg';
//   }

//   function getSVG (id) {
//     var element = document.getElementById(id);
//     if (isSVG(element)) { return element; }  
//     throw 'Id: ' + id + ' is not a SVG element';
//   }

//   // function vectorizeGesture(gesture){
//   //   var delta = new Point(gesture.deltaX, gesture.deltaY);
//   //   var center = (gesture.center) ? (new Point(gesture.center.pageX, gesture.center.pageY)) : null;
//   //   return {delta: delta, center: center, magnification: gesture.scale};
//   // }

//   old = function (id) {
//     var lastEvent;
//     var element = getSVG(id);
//     var mobileSVG = new MobileSVG(element);
//     var hammertime = Hammer(document).on('touch', touchHandler);

//     var handlers = {
//       dragstart: function(gesture){
//         mobileSVG.fix();
//       },
//       drag: function(gesture){
//         mobileSVG.drag(new Point(gesture.deltaX, gesture.deltaY));
//       },
//       transformstart: function(){
//         mobileSVG.fix();
//       },
//       pinch: function(gesture){
//         mobileSVG.zoom(new Point(gesture.center.pageX, gesture.center.pageY), gesture.scale);
//       }
//     };

//     lastEvent = {gesture: {}};
//     var gestureHandler = function(event){
//       var gesture = event.gesture;
//       gesture.preventDefault();

//       var t1 = gesture.timeStamp || 1000;
//       var t0 = lastEvent.gesture.timeStamp || 0;

//       if (t1 - t0 > 300 || lastEvent.type !== event.type) {
//         handlers[event.type](gesture);
//       }
//       lastEvent = event;
//     };

//     function activityOn(instance){
//       instance.on('dragstart drag transformstart pinch', gestureHandler);
//       instance.on('release', releaseHandler);
//     }
//     function activityOff(instance){
//       instance.off('dragstart drag transformstart pinch', gestureHandler);
//       instance.off('release', releaseHandler);
//     }
//     function touchHandler (event) {
//       event.gesture.preventDefault();
//       if (event.target.ownerSVGElement === element) { activityOn(hammertime); }  
//     }
//     function releaseHandler (event) {
//       mobileSVG.fix();
//       mobileSVG.updateCTM();
//       activityOff(hammertime);
//     }
//     /* test-code */
//     this._test = {
//       hammertime: hammertime,
//       handlers: handlers
//     };
//     /* end-test-code */
//   };

// }());

//   // Doesnt work if target is svg
//   // Give argument to expand hammer instance
//   // return function will kill and home methods
//   // possibly take config map for shortcut keys
//   // include keystroke zoom and pan
//   // keep mouse handlers private
//   // Added mouse wheel support in configuration
//   // mobilise method auto called
//   // freeze method for swish loader
//   // Need to clear hammer for testing
