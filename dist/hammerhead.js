var Hammerhead = {};
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

(function(parent){
  var prototype = {
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
      var newViewBox = viewBox(newMinimal, newMaximal, this.getValidator());
      return newViewBox.valid()? newViewBox : null;
    },
    scale: function(scale, center){
      var boxScale = 1.0/scale;
      center = center || this.center();
      var newMinimal = this.getMinimal().subtract(center).multiply(boxScale).add(center);
      var newMaximal = this.getMaximal().subtract(center).multiply(boxScale).add(center);
      var newViewBox = viewBox(newMinimal, newMaximal, this.getValidator());
      return newViewBox.valid()? newViewBox : null;
    }
  };

  var viewBox = function(minimal, maximal, validator){
    validator = validator || function(){ return true; };
    if (typeof minimal === 'string') { return fromString(minimal, maximal); }

    var instance = Object.create(prototype);
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

  var fromString = function(viewBoxString, validator){
    var returnInt = function(string) { return parseInt(string, 10); };

    var limits  = viewBoxString.split(' ').map(returnInt),
        minimal = parent.Point(limits[0], limits[1]),
        delta   = parent.Point(limits[2], limits[3]),
        maximal = minimal.add(delta);
    return viewBox(minimal, maximal, validator);
  };

  parent.ViewBox = viewBox;
}(Hammerhead));

(function(parent){
  var prototype = {
  };

  var DEFAULTS = {
    throttleDelay: 300,
    centerScale: 4,
    maxZoom: 4,
  };

  var create = function(element, options){
    var temporary, current, HOME;
    DEFAULTS.conditions =  function(){
      var max = HOME.getMaximal();
      var min = HOME.getMinimal();
      var scaleLimit = (this.dX() >= HOME.dX()/options.maxZoom);
      var xLimit = (this.x0() >= min.x) && (this.x1() <= max.x);
      var yLimit = (this.y0() >= min.y) && (this.y1() <= max.y);
      return scaleLimit && xLimit && yLimit;
    }; 
    options = _.extend({}, DEFAULTS, options);

    HOME = temporary = current = parent.ViewBox(element.getAttribute('viewBox'), options.conditions);

    // update = _.partial(element.setAttribute, 'viewBox');
    function update(viewBoxString){
      element.setAttribute('viewBox', viewBoxString);
    }
    update = _.throttle(update, options.throttleDelay);

    function translate(delta){
      temporary = current.translate(delta) || temporary;
      update(temporary.toString());
      return this;
    }

    function drag(screenDelta){
      var delta = screenDelta.scaleTransform(element.getScreenCTM().inverse());
      return this.translate(delta);
    }

    function scale(magnfication, center){
      temporary = current.scale(magnfication, center) || temporary;
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

    instanceFunctions = {
      translate: translate, drag: drag, scale: scale,
      zoom: zoom, fix: fix, home: home, goTo: goTo
    };

    var instance = Object.create(prototype);
    _.each(instanceFunctions, function(privilaged, name){
      instance[name] = privilaged;
    });
    return instance;
  };

  parent.MobileSVG = create;
}(Hammerhead));

//     var getInverseScreenCTM = function(){
//       var inverse = element.getScreenCTM().inverse();
//       // Windows Phone hack
//       if (!window.devicePixelRatio) { inverse = inverse.scale(2); }
//       return inverse;
//     };



var Hammerhead = (function(parent){
  var Pt = Hammerhead.Point;

  function getSVG (id) {
    var element = document.getElementById(id);
    if (element && element.tagName.toLowerCase() === 'svg') { return element; }
    throw 'Id: ' + id + ' is not a SVG element';
  }

  function drag(x, y){
    this.element.drag(Pt(x, y));
    return this;
  }

  function dragX(x){
    return this.drag(x || this.options.dragX, 0);
  }

  function dragY(y){
    return this.drag(0, y || this.options.dragX);
  }

  function zoom(m){
    this.element.scale(m);
    return this;
  }

  function zoomIn(m){
    return this.zoom(m || this.options.zoomIn);
  }

  function zoomOut(m){
    return this.zoom(1.0/m || this.options.zoomOut);
  }

  function fix(){
    this.element.fix();
    return this;
  }

  var prototype = {
    drag: drag,
    dragX: dragX,
    dragY: dragY,
    zoom: zoom,
    zoomIn: zoomIn,
    zoomOut: zoomOut,
    fix: fix
  };

  var DEFAULTS = {
    dragX: 100,
    dragY: 100,
    zoomIn: 1.25,
    zoomOut: 0.8,
    prefix: function(){},
    postfix: function(){},
  };


  function create(id, options){
    options = _.extend({}, DEFAULTS, options);
    // console.log(options);
    var DOMElement = getSVG(id);
    var activeElement = Hammerhead.MobileSVG(DOMElement, options);
    var hammertime = Hammer(document).on('touch', touchHandler);
    
    function touchHandler (event) {
      event.gesture.preventDefault();
      options.prefix();
      if (event.target.ownerSVGElement === DOMElement) { activityOn(); }  
    }

    function releaseHandler (event) {
      activeElement.fix();
      activityOff(hammertime);
      options.postfix();
    }

    var handlers = {
      dragstart: function(gesture){
        activeElement.fix();
      },
      drag: function(gesture){
        activeElement.drag(Pt(gesture));
      },
      transformstart: function(){
        activeElement.fix();
      },
      pinch: function(gesture){
        activeElement.zoom(gesture.scale, Pt(gesture.center));
      }
    };

    var gestures = _.keys(handlers).join(' ');

    function activityOn(){
      hammertime.on(gestures, gestureHandler);
      hammertime.on('release', releaseHandler);
    }

    function activityOff(){
      hammertime.off(gestures, gestureHandler);
      hammertime.off('release', releaseHandler);
    }

    var gestureHandler = function(event){
      var gesture = event.gesture;
      gesture.preventDefault();
      handlers[event.type](gesture);
    };


    var instance = Object.create(prototype);
    instance.element = activeElement;
    instance.options = options;
    instance._test = {
      hammertime: hammertime,
      handlers: handlers
    };
    return instance;
  }

  return _.extend(create, parent);
}(Hammerhead));

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

(function(parent){
  function getWheelDelta(event){
    if (event.wheelDelta) {
      return event.wheelDelta;
    } else {
      return -event.detail * 40;
    }
  }


  function init(hammerhead){
    function handleMouseWheel(event){
      if (event.target.ownerSVGElement) {
        var delta = getWheelDelta(event);
        var scale = Math.pow(2,delta/720);
        console.log(scale);
        hammerhead.zoomIn(scale);
        hammerhead.fix();
      }
    }

    document.addEventListener("mousewheel", handleMouseWheel, false);
    document.addEventListener("DOMMouseScroll", handleMouseWheel, false);
    
  }

  parent.MouseWheel = init;
}(Hammerhead));