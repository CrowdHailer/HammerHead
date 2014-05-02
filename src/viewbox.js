var ViewBox;
(function(){
  ViewBox = function(minimal, maximal){
    this.x0 = function(){ return minimal.x; };
    this.y0 = function(){ return minimal.y; };

    this.x1 = function(){ return maximal.x; };
    this.y1 = function(){ return maximal.y; };
  };
  
  ViewBox.prototype = {
    dX: function(){ return this.x1() - this.x0(); },
    dY: function(){ return this.y1() - this.y0(); },
    toString: function(){
      return [this.x0(), this.y0(), this.dX(), this.dY()].join(' ');
    }
  };
}());