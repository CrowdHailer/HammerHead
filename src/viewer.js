function Viewer (id) {
  var element = document.getElementById(id);

  var isSVG = function (element) {
    return element && element.tagName.toLowerCase() == 'svg';
  };

  if (isSVG(element)) {
    console.log('narp');
    this.element = element;
  } else {
    throw 'Id: ' + id + 'is not a SVG element';
  }
  
}