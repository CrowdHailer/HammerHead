var Hammerhead = (function(parent){
  var Pt = Hammerhead.Point;

  function getSVG (id) {
    var element = document.getElementById(id);
    if (element && element.tagName.toLowerCase() == 'svg') { return element; }
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
