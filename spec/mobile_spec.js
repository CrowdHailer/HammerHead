describe('Mobile SVG', function(){
  var element, mobileSVG, delta, center;
  beforeEach(function(){
    element = {
      getAttribute: function(){},
      setAttribute: function(){}
    };
    spyOn(element, 'getAttribute').andReturn('0 1 8 6');
    spyOn(element, 'setAttribute');
    mobileSVG = new MobileSVG(element);
    delta = new Point(1, 1);
    center = new Point(0, 1);
  });

  it('should read the viewbox attribute when not given specifics', function(){
    expect(element.getAttribute).toHaveBeenCalledWith('viewBox');
    expect(mobileSVG._test.viewBox.x0()).toEqual(0);
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

  it('should home to its initial settings', function(){
    mobileSVG.translate(delta).fix().home();
    expect(element.setAttribute.mostRecentCall.args[1]).toEqual('0 1 8 6');
  });

});