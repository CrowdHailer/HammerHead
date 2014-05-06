var MobileSVG;
(function(){
  MobileSVG = function(element){
    var temporaryViewBox, inverseScreenCTM, viewBox, HOME;
    viewBox = ViewBox.fromString(element.getAttribute('viewBox'));
    HOME = viewBox;
    temporaryViewBox = viewBox;
    var getInverseScreenCTM = function(){
      var inverse = element.getScreenCTM().inverse();
      // Windows Phone hack
      if (!window.devicePixelRatio) { inverse = inverse.scale(2); }
      return inverse;
    };

    this.updateCTM = function(){
      inverseScreenCTM = getInverseScreenCTM();
    };
    this.updateCTM();

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

    this.zoom = function(screenCenter, magnfication){
      var center = screenCenter.transform(inverseScreenCTM);
      return this.scale(center, magnfication);
    };

    this.fix = function(){
      viewBox = temporaryViewBox;
      return this;
    };

    this.home = function(){
      viewBox = HOME;
      element.setAttribute('viewBox', viewBox.toString());
    };
  };
}());