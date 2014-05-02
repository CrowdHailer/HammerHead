function Point (x, y) {
  this.x = x;
  this.y = y;
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
var ViewFrame;
(function(){
  function returnInt (string) {
    return parseInt(string, 10);
  }

  function getViewBox (element) {
    var viewBoxString = element.getAttribute('viewBox');
    if (!viewBoxString) { throw 'Id: ' + element.id + ' has no viewBox attribute'; }
    var viewBox = viewBoxString.split(' ').map(returnInt);
    var origin = new Point(viewBox[0], viewBox[1]);
    var size = new Point(viewBox[2], viewBox[3]);
    return {origin: origin, size: size};
  }

  ViewFrame = function(element, origin, size, inverseScreenCTM) {
    var HOME;
    if (origin === undefined) {
      var elementViewBox = getViewBox(element);
      origin = elementViewBox.origin;
      size = elementViewBox.size;
    }
    HOME = { origin: origin, size: size };

    this.dX = function () { return size.x;   };
    this.dY = function () { return size.y;   };
    this.x0 = function () { return origin.x; };
    this.y0 = function () { return origin.y; };

    this.getOrigin = function(){ return origin; };
    this.getSize   = function(){ return size;   };

    this.setOrigin = function(point){ origin = point; };
    this.setSize = function(point){ size = point; };
    this.setViewBox = function(viewBoxString){
      viewBoxString = viewBoxString || this.toString();
      element.setAttribute('viewBox', viewBoxString);
    };

    this.getHome = function(){ return HOME; };
    this.getElement = function(){ return element; };

    this.getInverseScreenCTM = function(){ return inverseScreenCTM; };
    this.updateScreenCTM = function(){
      var inverse = element.getScreenCTM().inverse();
      if (!window.devicePixelRatio) {
        inverse = inverse.scale(2);
      }
      inverseScreenCTM = inverse;
      return inverse;
    };
    inverseScreenCTM = inverseScreenCTM || this.updateScreenCTM();
  };

  ViewFrame.prototype.drag = function(vector, permanent){
    vector = vector.scaleTransform(this.getInverseScreenCTM());
    return this.translate(vector, permanent);
  };

  ViewFrame.prototype.zoom = function(center, magnification, permanent){
    center = center.transform(this.getInverseScreenCTM());
    return this.scale(center, magnification, permanent);
  };

  ViewFrame.prototype.translate = function(vector, permanent){
    var newOrigin = this.getOrigin().subtract(vector);
    if (permanent) {
      this.setOrigin(newOrigin);
      this.setViewBox();
      return this;
    } else{
      var temp = new ViewFrame(this.getElement(), newOrigin, this.getSize(), this.getInverseScreenCTM());
      this.setViewBox(temp.toString());
      return temp;
    }
  };

  ViewFrame.prototype.scale = function(center, magnification, permanent){
    var newOrigin = this.getOrigin().subtract(center).multiply(magnification).add(center);
    var newSize = this.getSize().multiply(magnification);
    if (permanent) {
      this.setOrigin(newOrigin);
      this.setSize(newSize);
      this.setViewBox();
      this.updateScreenCTM();
      return this;
    } else{
      var temp = new ViewFrame(this.getElement(), newOrigin, newSize, this.getInverseScreenCTM());
      this.setViewBox(temp.toString());
      return temp;
    }
  };

  ViewFrame.prototype.toString = function(){
    return [this.x0(), this.y0(), this.dX(), this.dY()].join(' ');
  };

  ViewFrame.prototype.home = function(destination){
    var target = destination || this.getHome();
    this.setOrigin(target.origin);
    this.setSize(target.size);
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
    var scaling, lastFrame;
    var element = getSVG(id);
    var viewFrame = new ViewFrame(element);
    var hammertime = Hammer(document, {preventDefault: true}).on('touch', touchHandler);

    var handlers = {
      drag: function(gesture){
        viewFrame.drag(new Point(gesture.deltaX, gesture.deltaY));
      },
      dragend: function(gesture){
        viewFrame.drag(new Point(gesture.deltaX, gesture.deltaY), true);
      }
    };

    var gestureHandler = function(event){
      var gesture = event.gesture;
      gesture.preventDefault();
      //timecheck here
      console.log(event.type);
      handlers[event.type](gesture);
    };

    // dragHandler = function (event) {
    //   event.gesture.preventDefault();
    //   viewFrame.drag(new Point(event.gesture.deltaX, event.gesture.deltaY));
    // };

    // dragendHandler = function (event) {
    //   event.gesture.preventDefault();
    //   viewFrame.drag(new Point(event.gesture.deltaX, event.gesture.deltaY), true);
    // };

    dragstartHandler = function (event) {
      event.gesture.preventDefault();
    };

    pinchHandler = function (event) {
      event.gesture.preventDefault();
      lastFrame = viewFrame.zoom(new Point(event.gesture.center.pageX, event.gesture.center.pageY), 1.0/event.gesture.scale);
      scaling = true;
    };

    transformendHandler = function (event) {
      event.gesture.preventDefault();
      viewFrame.zoom(new Point(event.gesture.center.pageX, event.gesture.center.pageY), 1.0/event.gesture.scale, true);
      scaling = false;
    };

    function activityOn(instance){
      instance.on('drag dragend', gestureHandler);
      instance.on('dragstart', dragstartHandler);
      // instance.on('dragend', dragendHandler);
      instance.on('pinch', pinchHandler);
      instance.on('transformend', transformendHandler);
      instance.on('release', releaseHandler);
    }
    function activityOff(instance){
      instance.off('drag dragend', gestureHandler);
      instance.off('dragstart', dragstartHandler);
      // instance.off('dragend', dragendHandler);
      instance.off('pinch', pinchHandler);
      instance.off('transformend', transformendHandler);
      instance.off('release', releaseHandler);
    }
    function touchHandler (event) {
      event.gesture.preventDefault();
      if (event.target.ownerSVGElement === element) { activityOn(hammertime); }  
    }
    function releaseHandler (event) {
      if (scaling) { alert('boo'); };
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
