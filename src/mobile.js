var MobileSVG;
(function(){
  MobileSVG = function(element){
    var temporaryViewBox, inverseScreenCTM;
    var viewBoxString = element.getAttribute('viewBox');
    var viewBox = ViewBox.fromString(viewBoxString);
    var HOME = viewBox;
    var getIverseScreenCTM = function(){
      var inverse = element.getScreenCTM().inverse();
      // Windows Phone hack
      if (!window.devicePixelRatio) { inverse = inverse.scale(2); }
      return inverse;
    };

    inverseScreenCTM = getIverseScreenCTM();

    this.translate = function(delta){
      temporaryViewBox = viewBox.translate(delta);
      element.setAttribute('viewBox', temporaryViewBox.toString());
      return this;
    };

    this.drag = function(screenDelta){
      var delta = screenDelta.scaleTransform(inverseScreenCTM);
      return this.translate(delta);
    };

    this.scale = function(center, magnfication){
      temporaryViewBox = viewBox.scale(center, magnfication);
      element.setAttribute('viewBox', temporaryViewBox.toString());
      return this;
    };

    this.fix = function(){
      viewBox = temporaryViewBox;
      return this;
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