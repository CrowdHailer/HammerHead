var Hammerhead = (function(parent){
  var prototype = {
  };

  var DEFAULTS = {
    "throttleDelay": 300
  };

  var create = function(element, options){
    var temporary, current, HOME;
    options = _.extend({}, DEFAULTS, options);
    HOME = temporary = current = parent.ViewBox(element.getAttribute('viewBox'));

    // update = _.partial(element.setAttribute, 'viewBox');
    function update(viewBoxString){
      element.setAttribute('viewBox', viewBoxString);
    }
    update = _.throttle(update, options.throttleDelay);

    function translate(delta){
      temporary = current.translate(delta);
      update(temporary.toString());
      return this;
    }

    function drag(screenDelta){
      var delta = screenDelta.scaleTransform(element.getScreenCTM().inverse());
      return this.translate(delta);
    }

    function scale(magnfication, center){
      temporary = current.scale(magnfication, center);
      update(temporary.toString());
      return this;
    }

    function zoom(magnfication, screenCenter){
      var center = screenCenter.transform(element.getScreenCTM().inverse());
      return this.scale(magnfication, center);
    }

    function fix(){
      current = temporary;
      return this;
    }

    function home(){
      temporary = HOME;
      update(temporary.toString());
      return this;
    }

    var instance = Object.create(prototype);
    [translate, drag, scale, zoom, fix, home].forEach(function(privilaged){
      instance[privilaged.name] = privilaged;
    });
    return instance;
  };

  parent.MobileSVG = create;
  return parent;
}(Hammerhead || {}));

// var MobileSVG;
// (function(){
//   MobileSVG = function(element){
//     var temporaryViewBox, inverseScreenCTM, viewBox, HOME;
//     viewBox = ViewBox.fromString(element.getAttribute('viewBox'));
//     HOME = viewBox;
//     temporaryViewBox = viewBox;
//     var getInverseScreenCTM = function(){
//       var inverse = element.getScreenCTM().inverse();
//       // Windows Phone hack
//       if (!window.devicePixelRatio) { inverse = inverse.scale(2); }
//       return inverse;
//     };

//     this.updateCTM = function(){
//       inverseScreenCTM = getInverseScreenCTM();
//     };
//     this.updateCTM();

//     this.translate = function(delta){
//       temporaryViewBox = viewBox.translate(delta);
//       element.setAttribute('viewBox', temporaryViewBox.toString());
//       return this;
//     };

//     this.drag = function(screenDelta){
//       var delta = screenDelta.scaleTransform(inverseScreenCTM);
//       return this.translate(delta);
//     };

//     this.scale = function(center, magnfication){
//       temporaryViewBox = viewBox.scale(center, magnfication);
//       element.setAttribute('viewBox', temporaryViewBox.toString());
//       return this;
//     };

//     this.zoom = function(screenCenter, magnfication){
//       var center = screenCenter.transform(inverseScreenCTM);
//       return this.scale(center, magnfication);
//     };

//     this.fix = function(){
//       viewBox = temporaryViewBox;
//       return this;
//     };

//     this.home = function(){
//       viewBox = HOME;
//       element.setAttribute('viewBox', viewBox.toString());
//     };
//   };
// }());