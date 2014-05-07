describe('ViewBox', function(){
  var minimal, maximal, viewBox;
  beforeEach(function(){
    minimal = Hammerhead.Point(0, 1);
    maximal = Hammerhead.Point(8, 7);
    viewBox = Hammerhead.ViewBox(minimal, maximal);
  });

  it('should give a x0 value', function(){
    expect(viewBox.x0()).toEqual(0);
  });

  it('should give a y0 value', function(){
    expect(viewBox.y0()).toEqual(1);
  });

  it('should give a x1 value', function(){
    expect(viewBox.x1()).toEqual(8);
  });

  it('should give a y1 value', function(){
    expect(viewBox.y1()).toEqual(7);
  });

  it('should give a dX value', function(){
    expect(viewBox.dX()).toEqual(8);
  });

  it('should give a dY value', function(){
    expect(viewBox.dY()).toEqual(6);
  });

  it('should return a viewBox string', function(){
    expect(viewBox.toString()).toEqual('0 1 8 6');
  });

  it('should translate', function(){
    delta = Hammerhead.Point(1, 1);
    var newViewBox = viewBox.translate(delta);
    expect(newViewBox.toString()).toEqual('-1 0 8 6');
  });

  it('should scale to a centerpoint', function(){
    center = Hammerhead.Point(0, 1);
    var newViewBox = viewBox.scale(center, 2);
    expect(newViewBox.toString()).toEqual('0 1 4 3');
  });

  it('should build a viewbox from a string', function(){
    var newViewBox = Hammerhead.ViewBox.fromString('1 2 3 4');
    expect(newViewBox.x0()).toEqual(1);
    expect(newViewBox.y1()).toEqual(6);
  });

  it('should directly build a viewbox from a string', function(){
    var newViewBox = Hammerhead.ViewBox('1 2 3 4');
    expect(newViewBox.x0()).toEqual(1);
    expect(newViewBox.y1()).toEqual(6);
  });
});