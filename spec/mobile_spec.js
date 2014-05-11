describe('Mobile SVG', function(){
  var element, mobileSVG, delta, center;
  beforeEach(function(){
    element = {
      getAttribute: function(){},
      setAttribute: function(){},
      getScreenCTM: function(){}
    };
    var inverse = function(){ return {a: 2, b: 0, c: 0, d: 2, e: 0, f: 0}; };
    spyOn(element, 'getAttribute').andReturn('0 1 8 6');
    spyOn(element, 'setAttribute');
    spyOn(element, 'getScreenCTM').andReturn({inverse: inverse});
    mobileSVG = Hammerhead.MobileSVG(element, {throttleDelay: 0, conditions: function(){ return true; }});
    delta = Hammerhead.Point(1, 1);
    center = Hammerhead.Point(0, 1);
    screenCenter = Hammerhead.Point(0, 0.5);
  });

  describe('aspect manipulation', function(){
    it('should translate in SVG units', function(){
      mobileSVG.translate(delta);
      expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '-1 0 8 6');
    });

    it('should translate from the same start point', function(){
      mobileSVG.translate(delta).translate(delta);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('-1 0 8 6');
    });

    it('should fix a translation', function(){
      mobileSVG.translate(delta).fix().translate(delta);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('-2 -1 8 6');
    });

    it('should scale in SVG units', function(){
      mobileSVG.scale(2, center);
      expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '0 1 4 3');
    });

    it('should scale from the same start point', function(){
      mobileSVG.scale(2, center).scale(2, center);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 4 3');
    });

    it('should fix a scaling', function(){
      mobileSVG.scale(2, center).fix().scale(2, center);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 2 1.5');
    });

    it('should drag in Screen units', function(){
      mobileSVG.drag(delta);
      expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '-2 -1 8 6');
    });

    it('should drag from the same start point', function(){
      mobileSVG.drag(delta).drag(delta);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('-2 -1 8 6');
    });

    it('should fix a drag', function(){
      mobileSVG.drag(delta).fix().drag(delta);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('-4 -3 8 6');
    });

    it('should zoom in SVG units', function(){
      mobileSVG.zoom(2, screenCenter);
      expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '0 1 4 3');
    });

    it('should zoom from the same start point', function(){
      mobileSVG.zoom(2, screenCenter).zoom(2, screenCenter);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 4 3');
    });

    it('should fix a zooming', function(){
      mobileSVG.zoom(2, screenCenter).fix().zoom(2, screenCenter);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 2 1.5');
    });
  });

  describe('specifying destinations', function(){
    it('should home to its initial settings', function(){
      mobileSVG.translate(delta).fix().home();
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 8 6');
    });

    it('should home to a given set of points', function(){
      var min = Hammerhead.Point(1, 1);
      var max = Hammerhead.Point(2, 2);
      mobileSVG.home(min, max);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('1 1 1 1');
    });

    it('should center to a given point at default magnification x4', function(){
      var target = Hammerhead.Point(5, 5);
      mobileSVG.goTo(target);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('4 4.25 2 1.5');
    });

    it('should center to a given point at given magnification', function(){
      var target = Hammerhead.Point(5, 5);
      mobileSVG.goTo(target, 2);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('3 3.5 4 3');
    });

    it('should allow overwrite of default magnification', function(){
      var target = Hammerhead.Point(5, 5);
      mobileSVG = Hammerhead.MobileSVG(element, {throttleDelay: 0, centerScale: 2});
      mobileSVG.goTo(target);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('3 3.5 4 3');
    });
  });

  describe('limited zoom and pan', function(){
    it('should limit zoom in', function(){
      mobileSVG = Hammerhead.MobileSVG(element, {throttleDelay: 0});
      mobileSVG.scale(2).fix();
      expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '2 2.5 4 3');
      mobileSVG.scale(2).fix();
      expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '3 3.25 2 1.5');
      mobileSVG.scale(2);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('3 3.25 2 1.5');
    });

    it('should limit x+ drag', function(){
      mobileSVG = Hammerhead.MobileSVG(element, {throttleDelay: 0});
      var pt = Hammerhead.Point(8, 0);
      mobileSVG.translate(pt);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 8 6');
    });

    it('should limit x- drag', function(){
      mobileSVG = Hammerhead.MobileSVG(element, {throttleDelay: 0});
      var pt = Hammerhead.Point(-8, 0);
      mobileSVG.translate(pt);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 8 6');
    });

    it('should limit y+ drag', function(){
      mobileSVG = Hammerhead.MobileSVG(element, {throttleDelay: 0});
      var pt = Hammerhead.Point(0, 8);
      mobileSVG.translate(pt);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 8 6');
    });

    it('should limit y- drag', function(){
      mobileSVG = Hammerhead.MobileSVG(element, {throttleDelay: 0});
      var pt = Hammerhead.Point(0, -8);
      mobileSVG.translate(pt);
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 8 6');
    });

    it('should be possible to set max zoom factor', function(){
      mobileSVG = Hammerhead.MobileSVG(element, {throttleDelay: 0, maxZoom: 2});
      mobileSVG.scale(2).fix();
      expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '2 2.5 4 3');
      mobileSVG.scale(2).fix();
      expect(element.setAttribute.mostRecentCall.args[1]).toEqual('2 2.5 4 3');

    });
  });
});