var ViewFrame;
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

  ViewFrame = function(element, origin, size, inverseScreenCTM) {
    var HOME;
    if (origin === undefined) {
      var elementViewBox = getViewBox(element);
      origin = elementViewBox.origin;
      size = elementViewBox.size;
    }
    HOME = { origin: origin, size: size };

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
    this.updateScreenCTM = function(){
      return (inverseScreenCTM = element.getScreenCTM().inverse());
    };
    inverseScreenCTM = inverseScreenCTM || this.updateScreenCTM();
  };

  ViewFrame.prototype.drag = function(vector, permanent){
    vector = vector.scaleTransform(this.getInverseScreenCTM());
    return this.translate(vector, permanent);
  };

  ViewFrame.prototype.zoom = function(center, magnification, permanent){
    center = center.transform(this.getInverseScreenCTM());
    return this.scale(center, magnification, permanent);
  };

  ViewFrame.prototype.translate = function(vector, permanent){
    var newOrigin = this.getOrigin().add(vector);
    if (permanent) {
      this.setOrigin(newOrigin);
    } else{
      return new ViewFrame(this.getElement(), newOrigin, this.getSize(), this.getInverseScreenCTM());
    }
  };

  ViewFrame.prototype.scale = function(center, magnification, permanent){
    var newOrigin = this.getOrigin().subtract(center).multiply(magnification).add(center);
    var newSize = this.getSize().multiply(magnification);
    if (permanent) {
      this.setOrigin(newOrigin);
      this.setSize(newSize);
    } else{
      return new ViewFrame(this.getElement(), newOrigin, newSize, this.getInverseScreenCTM());
    }
  };

  ViewFrame.prototype.toString = function(){
    return [this.x0(), this.y0(), this.dX(), this.dY()].join(' ');
  };

  ViewFrame.prototype.home = function(destination){
    var target = destination || this.getHome();
    this.setOrigin(target.origin);
    this.setSize(target.size);
  };
}());
