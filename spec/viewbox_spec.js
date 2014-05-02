describe('ViewBox', function(){
  var minimal, maximal, viewbox;
  beforeEach(function(){
    minimal = new Point(0, 1);
    maximal = new Point(8, 7);
    viewbox = new ViewBox(minimal, maximal);
  });

  it('should give a x0 value', function(){
    expect(viewbox.x0()).toEqual(0);
  });

  it('should give a y0 value', function(){
    expect(viewbox.y0()).toEqual(1);
  });

  it('should give a x1 value', function(){
    expect(viewbox.x1()).toEqual(8);
  });

  it('should give a y1 value', function(){
    expect(viewbox.y1()).toEqual(7);
  });

  it('should give a dX value', function(){
    expect(viewbox.dX()).toEqual(8);
  });

  it('should give a dY value', function(){
    expect(viewbox.dY()).toEqual(6);
  });

  it('should return a viewBox string', function(){
    expect(viewbox.toString()).toEqual('0 1 8 6');
  });
});