describe('Point', function(){
  it('should be initialised with 2 coordinates', function(){
    var point = new Point(2,3);
    expect(point.x).toBe(2);
    expect(point.y).toBe(3);
  });

  it('should be able to add points', function () {
    var point1 = new Point(2,3);
    var point2 = new Point(3,-1);
    var newPoint = point1.add(point2);
    expect(newPoint.x).toEqual(5);
    expect(newPoint.y).toEqual(2);
  });

  it('should be able to subtract points', function () {
    var point1 = new Point(2,3);
    var point2 = new Point(3,-1);
    var newPoint = point1.subtract(point2);
    expect(newPoint.x).toEqual(-1);
    expect(newPoint.y).toEqual(4);
  });

  it('should be possible to scale a point', function () {
    var point = new Point(2,3);
    var scale = 2;
    var newPoint = point.multiply(scale);
    expect(newPoint.x).toEqual(4);
    expect(newPoint.y).toEqual(6);
  });

  it('should be possible to scale a point by a fraction', function () {
    var point = new Point(2,3);
    var scale = 0.5;
    var newPoint = point.multiply(scale);
    expect(newPoint.x).toEqual(1);
    expect(newPoint.y).toEqual(1.5);
  });

  it('should be possible to map to a svg element', function () {
    var point = new Point(2,3);
    var element = {
      getScreenCTM: function () {
        return {a:2, b:0, c:0, d:0}
      }
    };
    var newPoint = point.mapTo(element);
  });
});