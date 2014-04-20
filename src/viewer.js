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
    this.element = getSVG(id);
    this.viewFrame = getViewFrame(this.element);
  };

}());

// function xViewer (id) {
//   var element = document.getElementById(id);

//   var isSVG = function (element) {
//     return element && element.tagName.toLowerCase() == 'svg';
//   };

//   var getViewFrame = function(element) {
//     var viewBox = element.getAttribute('viewBox');
//     if (viewBox === null) { return false; }
//     viewBox = viewBox.split(' ').map(returnInt);
//     var origin = new Point(viewBox[0], viewBox[1]);
//     var size = new Point(viewBox[2], viewBox[3]);
//     return new viewFrame(origin,size);
//   };

//   var returnInt = function (element){
//     return parseInt(element,10);
//   };

//   if (isSVG(element)) {
//     this.element = element;
//   } else {
//     throw 'Id: ' + id + ' is not a SVG element';
//   }

//   if (getViewFrame(element) === false) {
//     throw 'Id: ' + id + ' has no viewBox attribute';
//   }
//   // Give argument to expand hammer instance
//   // return function will kill and home methods
//   // possibly take config map for shortcut keys
//   // include keystroke zoom and pan
//   // keep mouse handlers private
//   // Added mouse wheel support in configuration
//   // mobilise method auto called
//   // freeze method for swish loader
  
// }