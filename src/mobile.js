var MobileSVG;
(function(){
  MobileSVG = function(element){
    var temporaryViewBox;
    var viewBoxString = element.getAttribute('viewBox');
    var viewBox = ViewBox.fromString(viewBoxString);

    this.translate = function(delta){
      temporaryViewBox = viewBox.translate(delta);
      element.setAttribute('viewBox', temporaryViewBox.toString());
      return this;
    };

    this.fix = function(){
      viewBox = temporaryViewBox;
    };

    this._test = {
      viewBox: viewBox
    };
  };
}());