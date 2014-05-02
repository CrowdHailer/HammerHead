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
      var handler = handlers[event.type];
      if (handler) { handler(gesture); }
    };

    // dragHandler = function (event) {
    //   event.gesture.preventDefault();
    //   viewFrame.drag(new Point(event.gesture.deltaX, event.gesture.deltaY));
    // };

    // dragendHandler = function (event) {
    //   event.gesture.preventDefault();
    //   viewFrame.drag(new Point(event.gesture.deltaX, event.gesture.deltaY), true);
    // };

    // dragstartHandler = function (event) {
    //   event.gesture.preventDefault();
    // };

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
      instance.on('dragstart drag dragend', gestureHandler);
      // instance.on('dragstart', dragstartHandler);
      // instance.on('dragend', dragendHandler);
      instance.on('pinch', pinchHandler);
      instance.on('transformend', transformendHandler);
      instance.on('release', releaseHandler);
    }
    function activityOff(instance){
      instance.off('dragstart drag dragend', gestureHandler);
      // instance.off('dragstart', dragstartHandler);
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
