function Viewer (id) {
  var element = document.getElementById(id);

  var isSVG = function (element) {
    return element && element.tagName.toLowerCase() == 'svg';
  };

  var getViewFrame = function(element) {
    var viewBox = element.getAttribute('viewBox');
    if (viewBox === null) { return false; }
    console.log(viewBox);
    viewBox = viewBox.split(' ').map(returnInt);
    var origin = new Point(viewBox[0], viewBox[1]);
    var size = new Point(viewBox[2], viewBox[3]);
    console.log('here');
    return new viewFrame(origin,size);
  };

  var returnInt = function (element){
    return parseInt(element,10);
  };

  if (isSVG(element)) {
    this.element = element;
  } else {
    throw 'Id: ' + id + ' is not a SVG element';
  }

  if (getViewFrame(element) === false) {
    throw 'Id: ' + id + ' has no viewBox attribute';
  }
  
}