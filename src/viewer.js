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
    var element = getSVG(id);
    var viewFrame = new ViewFrame(element);
    var hammertime = Hammer(document, {preventDefault: true}).on('touch', touchHandler);

    dragHandler = function (event) {
      event.gesture.preventDefault();
      viewBoxString = viewFrame.drag(new Point(event.gesture.deltaX, event.gesture.deltaY)).toString();
      element.setAttribute('viewBox', viewBoxString);
    };

    dragendHandler = function (event) {
      event.gesture.preventDefault();
      viewBoxString = viewFrame.drag(new Point(event.gesture.deltaX, event.gesture.deltaY), true).toString();
      element.setAttribute('viewBox', viewBoxString);
    };

    dragstartHandler = function (event) {
      event.gesture.preventDefault();
    };

    pinchHandler = function (event) {
      event.gesture.preventDefault();
      viewBoxString = viewFrame.zoom(new Point(event.gesture.center.pageX, event.gesture.center.pageY), 1.0/event.gesture.scale).toString();
      element.setAttribute('viewBox', viewBoxString);
    };

    transformendHandler = function (event) {
      event.gesture.preventDefault();
      viewBoxString = viewFrame.zoom(new Point(event.gesture.center.pageX, event.gesture.center.pageY), 1.0/event.gesture.scale, true).toString();
      element.setAttribute('viewBox', viewBoxString);
    };
    function activityOn(instance){
      instance.on('drag', dragHandler);
      instance.on('dragstart', dragstartHandler);
      instance.on('dragend', dragendHandler);
      instance.on('pinch', pinchHandler);
      instance.on('transformend', transformendHandler);
      instance.on('release', releaseHandler);
    }
    function activityOff(instance){
      instance.off('drag', dragHandler);
      instance.off('dragstart', dragstartHandler);
      instance.off('dragend', dragendHandler);
      instance.off('pinch', pinchHandler);
      instance.off('transformend', transformendHandler);
      instance.off('release', releaseHandler);
    }
    function touchHandler (event) {
      event.gesture.preventDefault();
      if (event.target.ownerSVGElement === element) { activityOn(hammertime); }  
    }
    function releaseHandler (event) {
      activityOff(hammertime);  
    }
    this._test = {
      hammertime: hammertime
    };
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
