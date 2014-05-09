describe('ViewBox', function(){
  var minimal, maximal, viewBox, newViewBox;
  beforeEach(function(){
    minimal = Hammerhead.Point(0, 1);
    maximal = Hammerhead.Point(8, 7);
    viewBox = Hammerhead.ViewBox(minimal, maximal);
  });

  it('should be able to set minimum and maximum values', function(){
    viewBox.setMinimal(Hammerhead.Point(-1, -1));
    viewBox.setMaximal(Hammerhead.Point(6, 6));
    expect(viewBox.toString()).toEqual('-1 -1 7 7');
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

  it('should give a xMid value', function(){
    expect(viewBox.xMid()).toEqual(4);
  });

  it('should give a yMid value', function(){
    expect(viewBox.yMid()).toEqual(4);
  });

  it('should return a center point', function(){
    expect(viewBox.center().x).toEqual(4);
  });

  it('should return an extent vector', function(){
    expect(viewBox.extent().x).toEqual(8);
  });

  it('should return a viewBox string', function(){
    expect(viewBox.toString()).toEqual('0 1 8 6');
  });

  it('should translate', function(){
    delta = Hammerhead.Point(1, 1);
    newViewBox = viewBox.translate(delta);
    expect(newViewBox.toString()).toEqual('-1 0 8 6');
  });

  it('should scale to a given centerpoint', function(){
    center = Hammerhead.Point(0, 1);
    newViewBox = viewBox.scale(2, center);
    expect(newViewBox.toString()).toEqual('0 1 4 3');
  });

  it('should accept an optional validation arguemt to limit viewbox dragging', function(){
    delta = Hammerhead.Point(1, 1);
    var check = function(){
      return (this.x0() === 0);
    };
    viewBox = Hammerhead.ViewBox(minimal, maximal, check);
    newViewBox = viewBox.translate(delta);
    expect(viewBox.toString()).toEqual('0 1 8 6');
    expect(newViewBox.toString()).toEqual('0 1 8 6');
  });

  it('should accept an optional validation arguemt to limit viewbox zooming', function(){
    var check = function(){
      return (this.y0() === 1);
    };
    viewBox = Hammerhead.ViewBox(minimal, maximal, check);
    newViewBox = viewBox.scale(2);
    expect(viewBox.toString()).toEqual('0 1 8 6');
    expect(newViewBox.toString()).toEqual('0 1 8 6');
  });

  it('should scale to viewbox center given no center argument', function(){
    newViewBox = viewBox.scale(2);
    expect(newViewBox.toString()).toEqual('2 2.5 4 3');
  });

  it('should build a viewbox from a string', function(){
    newViewBox = Hammerhead.ViewBox('1 2 3 4');
    expect(newViewBox.x0()).toEqual(1);
    expect(newViewBox.y1()).toEqual(6);
  });
});