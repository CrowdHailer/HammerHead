describe('Mobile SVG', function(){
  var element, mobileSVG;
  beforeEach(function(){
    element = {
      getAttribute: function(){},
      setAttribute: function(){}
    };
    spyOn(element, 'getAttribute').andReturn('0 1 8 6');
    spyOn(element, 'setAttribute');
    mobileSVG = new MobileSVG(element);
  });
  it('should read the viewbox attribute when not given specifics', function(){
    expect(element.getAttribute).toHaveBeenCalledWith('viewBox');
    expect(mobileSVG._test.viewBox.x0()).toEqual(0);
  });

  it('should translate in SVG units', function(){
    delta = new Point(1, 1);
    mobileSVG.translate(delta);
    expect(element.setAttribute).toHaveBeenCalledWith('viewBox', '-1 0 8 6');
  });

});