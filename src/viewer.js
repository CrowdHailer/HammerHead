function Viewer (id) {
  var element = document.getElementById(id);

  var isSVG = function (element) {
    return element && element.tagName.toLowerCase() == 'svg';
  };

  var getViewFrame = function(element) {
    var viewBox = element.getAttribute('viewBox');
    if (viewBox === null) { return false; }
    viewBox.split();
    console.log(viewBox);
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