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
