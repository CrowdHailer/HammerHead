var MobileSVG;
(function(){
  MobileSVG = function(element){
    var temporaryViewBox;
    var viewBoxString = element.getAttribute('viewBox');
    var viewBox = ViewBox.fromString(viewBoxString);

    this.translate = function(delta){
      temporaryViewBox = viewBox.translate(delta);
      element.setAttribute('viewBox', temporaryViewBox.toString());
    };

    this._test = {
      viewBox: viewBox
    };
  };
}());