(function(parent){
  var prototype = {
  };

  var DEFAULTS = {
    throttleDelay: 300,
    centerScale: 4,
    maxZoom: 4,
  };

  var create = function(element, options){
    var temporary, current, HOME;
    DEFAULTS.conditions =  function(){
      var max = HOME.getMaximal();
      var min = HOME.getMinimal();
      var scaleLimit = (this.dX() >= HOME.dX()/options.maxZoom);
      var xLimit = (this.x0() >= min.x) && (this.x1() <= max.x);
      var yLimit = (this.y0() >= min.y) && (this.y1() <= max.y);
      return scaleLimit && xLimit && yLimit;
    }; 
    options = _.extend({}, DEFAULTS, options);

    HOME = temporary = current = parent.ViewBox(element.getAttribute('viewBox'), options.conditions);

    // update = _.partial(element.setAttribute, 'viewBox');
    function update(viewBoxString){
      element.setAttribute('viewBox', viewBoxString);
    }
    update = _.throttle(update, options.throttleDelay);

    function translate(delta){
      temporary = current.translate(delta) || temporary;
      update(temporary.toString());
      return this;
    }

    function drag(screenDelta){
      var delta = screenDelta.scaleTransform(element.getScreenCTM().inverse());
      return this.translate(delta);
    }

    function scale(magnfication, center){
      temporary = current.scale(magnfication, center) || temporary;
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

    function home(min, max){
      if (min && max) {
        temporary.setMinimal(min);
        temporary.setMaximal(max);
      } else {
        temporary = HOME;
      }
      update(temporary.toString());
      return this;
    }

    function goTo(target, magnfication){
      magnfication = magnfication || options.centerScale;
      var spacing = HOME.extent().multiply(1.0/(2*magnfication));
      temporary.setMinimal(target.subtract(spacing));
      temporary.setMaximal(target.add(spacing));
      update(temporary.toString());
      return this; 
    }

    instanceFunctions = {
      translate: translate, drag: drag, scale: scale,
      zoom: zoom, fix: fix, home: home, goTo: goTo
    };

    var instance = Object.create(prototype);
    _.each(instanceFunctions, function(privilaged, name){
      instance[name] = privilaged;
    });
    return instance;
  };

  parent.MobileSVG = create;
}(Hammerhead));

//     var getInverseScreenCTM = function(){
//       var inverse = element.getScreenCTM().inverse();
//       // Windows Phone hack
//       if (!window.devicePixelRatio) { inverse = inverse.scale(2); }
//       return inverse;
//     };


