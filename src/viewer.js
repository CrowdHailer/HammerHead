var Hammerhead = (function(parent){
  var Pt = Hammerhead.Point;

  function getSVG (id) {
    var element = document.getElementById(id);
    if (element && element.tagName.toLowerCase() == 'svg') { return element; }
    throw 'Id: ' + id + ' is not a SVG element';
  }

  function drag(x, y){
    pt = Pt(x, y);
    this.element.drag(pt);
    return this;
  }

  function dragX(x){
    pt = Pt(x || this.options.dragX, 0);
    this.element.drag(pt);
    return this;
  }

  function dragY(y){
    pt = Pt(0, y || this.options.dragX);
    this.element.drag(pt);
    return this;
  }

  function zoom(m){
    this.element.scale(m);
  }

  var prototype = {
    drag: drag,
    dragX: dragX,
    dragY: dragY,
    zoom: zoom
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
    var element = getSVG(id);
    var mobileSVG = Hammerhead.MobileSVG(element, options);
    var hammertime = Hammer(document).on('touch', touchHandler);
    

    function touchHandler (event) {
      event.gesture.preventDefault();
      options.prefix();
      if (event.target.ownerSVGElement === element) { activityOn(hammertime); }  
    }

    function releaseHandler (event) {
      mobileSVG.fix();
      // mobileSVG.updateCTM();
      activityOff(hammertime);
      options.postfix();
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
    instance.element = mobileSVG;

    instance.zoomIn = function(){
      mobileSVG.scale(options.zoomIn);
    };
    instance.zoomOut = function(){
      mobileSVG.scale(options.zoomOut);
    };
    instance.fix = function(){ mobileSVG.fix(); };
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
