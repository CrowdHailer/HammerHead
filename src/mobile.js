var MobileSVG;
(function(){
  MobileSVG = function(element){
    var viewBoxString = element.getAttribute('viewBox');
    var viewBox = ViewBox.fromString(viewBoxString);

    this._test = {
      viewBox: viewBox
    };
  };
}());