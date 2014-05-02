var MobileSVG;
(function(){
  MobileSVG = function(element){
    var temporaryViewBox;
    var viewBoxString = element.getAttribute('viewBox');
    var viewBox = ViewBox.fromString(viewBoxString);
    var HOME = viewBox;

    this.translate = function(delta){
      temporaryViewBox = viewBox.translate(delta);
      element.setAttribute('viewBox', temporaryViewBox.toString());
      return this;
    };

    this.scale = function(center, magnfication){
      temporaryViewBox = viewBox.scale(center, magnfication);
      element.setAttribute('viewBox', temporaryViewBox.toString());
      return this;
    };

    this.fix = function(){
      viewBox = temporaryViewBox;
    };

    this.home = function(){
      viewBox = HOME;
      element.setAttribute('viewBox', viewBox.toString());
    };

    this._test = {
      viewBox: viewBox
    };
  };
}());