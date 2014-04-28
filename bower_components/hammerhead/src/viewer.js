(function (){

  function isSVG (element) {
    return element && element.tagName.toLowerCase() == 'svg';
  }

  function getSVG (id) {
    var element = document.getElementById(id);
    if (isSVG(element)) { return element; }  
    throw 'Id: ' + id + ' is not a SVG element';
  }

  function returnInt (string) {
    return parseInt(string, 10);
  }

  function getViewFrame (element) {
    var viewBoxString = element.getAttribute('viewBox');
    if (!viewBoxString) { throw 'Id: ' + element.id + ' has no viewBox attribute'; }
    var viewBox = viewBoxString.split(' ').map(returnInt);
    var origin = new Point(viewBox[0], viewBox[1]);
    var size = new Point(viewBox[2], viewBox[3]);
    return new viewFrame(origin, size);
  }


  Viewer = function (id) {
    var element = getSVG(id);
    var viewFrame = getViewFrame(element);
    var hammertime = Hammer(document).on('touch', touchHandler);

    drag = function (deltaX, deltaY) {
      var screenVector = new Point(deltaX, deltaY);
      var SVGVector = screenVector.scaleTo(element).multiply(-1);
      var viewBoxString = viewFrame.translate(SVGVector).toString();
      element.setAttribute('viewBox', viewBoxString);
    };

    fixedDrag = function (deltaX, deltaY) {
      var screenVector = new Point(deltaX, deltaY);
      var SVGVector = screenVector.scaleTo(element).multiply(-1);
      viewFrame.anchor.translate(SVGVector);
      var viewBoxString = viewFrame.toString();
      element.setAttribute('viewBox', viewBoxString);
    };

    zoom = function (centerX, centerY, zoomFactor) {
      var screenCenter = new Point(centerX, centerY);
      var SVGCenter = screenCenter.mapTo(element);
      var scaleFactor = 1.0/zoomFactor;
      var viewBoxString = viewFrame.scale(SVGCenter, scaleFactor).toString();
      element.setAttribute('viewBox', viewBoxString);
    };

    fixedZoom = function (centerX, centerY, zoomFactor) {
      var screenCenter = new Point(centerX, centerY);
      var SVGCenter = screenCenter.mapTo(element);
      var scaleFactor = 1.0/zoomFactor;
      viewFrame.anchor.scale(SVGCenter, scaleFactor);
      var viewBoxString = viewFrame.toString();
      element.setAttribute('viewBox', viewBoxString);
    };

    dragHandler = function (event) {
      drag(event.gesture.deltaX, event.gesture.deltaY);
    };

    dragendHandler = function (event) {
      fixedDrag(event.gesture.deltaX, event.gesture.deltaY);
    };

    pinchHandler = function (event) {
      zoom(event.gesture.center.pageX, event.gesture.center.pageY, event.gesture.scale);
    };

    transformendHandler = function (event) {
      fixedZoom(event.gesture.center.pageX, event.gesture.center.pageY, event.gesture.scale);
    };
    function activityOn(instance){
      instance.on('drag', dragHandler);
      instance.on('dragend', dragendHandler);
      instance.on('pinch', pinchHandler);
      instance.on('transformend', transformendHandler);
      instance.on('release', releaseHandler);
    }
    function activityOff(instance){
      instance.off('drag', dragHandler);
      instance.off('dragend', dragendHandler);
      instance.off('pinch', pinchHandler);
      instance.off('transformend', transformendHandler);
      instance.off('release', releaseHandler);
    }
    function touchHandler (event) {
      if (event.target.ownerSVGElement === element) { activityOn(hammertime); }  
    }
    function releaseHandler (event) {
      activityOff(hammertime);  
    }
    this.drag = drag;
    this.zoom = zoom;
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
