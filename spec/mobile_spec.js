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
    mobileSVG = Hammerhead.MobileSVG(element, {throttleDelay: 0});
    delta = Hammerhead.Point(1, 1);
    center = Hammerhead.Point(0, 1);
    screenCenter = Hammerhead.Point(0, 0.5);
  });

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
    mobileSVG.scale(center, 2);
    expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '0 1 4 3');
  });

  it('should scale from the same start point', function(){
    mobileSVG.scale(center, 2).scale(center, 2);
    expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 4 3');
  });

  it('should fix a scaling', function(){
    mobileSVG.scale(center, 2).fix().scale(center, 2);
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
    mobileSVG.zoom(screenCenter, 2);
    expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '0 1 4 3');
  });

  it('should zoom from the same start point', function(){
    mobileSVG.zoom(screenCenter, 2).zoom(screenCenter, 2);
    expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 4 3');
  });

  it('should fix a zooming', function(){
    mobileSVG.zoom(screenCenter, 2).fix().zoom(screenCenter, 2);
    expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 2 1.5');
  });

  it('should home to its initial settings', function(){
    mobileSVG.translate(delta).fix().home();
    expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 8 6');
  });

});