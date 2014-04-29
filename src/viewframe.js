var viewFrame;
(function(){
  function returnInt (string) {
    return parseInt(string, 10);
  }

  function getViewBox (element) {
    var viewBoxString = element.getAttribute('viewBox');
    if (!viewBoxString) { throw 'Id: ' + element.id + ' has no viewBox attribute'; }
    var viewBox = viewBoxString.split(' ').map(returnInt);
    var origin = new Point(viewBox[0], viewBox[1]);
    var size = new Point(viewBox[2], viewBox[3]);
    return {origin: origin, size: size};
  }

  viewFrame = function(element, origin, size) {
    var HOME, inverseScreenCTM;
    if (origin === undefined) {
      var elementViewBox = getViewBox(element);
      origin = elementViewBox.origin;
      size = elementViewBox.size;
    }
    HOME = { origin: origin, size: size };
    inverseScreenCTM = element.getScreenCTM().inverse();

    this.dX = function () { return size.x;   };
    this.dY = function () { return size.y;   };
    this.x0 = function () { return origin.x; };
    this.y0 = function () { return origin.y; };

    this.getOrigin = function(){ return origin; };
    this.getSize   = function(){ return size;   };

    this.setOrigin = function(point){ origin = point; };
    this.setSize = function(point){ size = point; };

    this.getHome = function(){ return HOME; };
    this.getElement = function(){ return element; };
    this.getInverseScreenCTM = function(){ return inverseScreenCTM; };
  };

  viewFrame.prototype.drag = function(vector, permanent){
    vector = 1;
  };

  viewFrame.prototype.translate = function(vector, permanent){
    var newOrigin = this.getOrigin().add(vector);
    if (permanent) {
      this.setOrigin(newOrigin);
    } else{
      return new viewFrame(this.getElement(), newOrigin, this.getSize());
    }
  };

  viewFrame.prototype.scale = function(center, magnification, permanent){
    var newOrigin = this.getOrigin().subtract(center).multiply(magnification).add(center);
    var newSize = this.getSize().multiply(magnification);
    if (permanent) {
      this.setOrigin(newOrigin);
      this.setSize(newSize);
    } else{
      return new viewFrame(this.getElement(), newOrigin, newSize);
    }
  };

  viewFrame.prototype.toString = function(){
    return [this.x0(), this.y0(), this.dX(), this.dY()].join(' ');
  };

  viewFrame.prototype.home = function(destination){
    var target = destination || this.getHome();
    this.setOrigin(target.origin);
    this.setSize(target.size);
  };
}());
