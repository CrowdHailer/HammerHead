describe('Point', function(){
  it('should be initialised with 2 coordinates', function(){
    var point = new Point(2,3);
    expect(point.x).toBe(2);
    expect(point.y).toBe(3);
  });

  it('should be able to add points', function () {
    var point1 = new Point(2,3);
    var point2 = new Point(3,-1);
    console.log(point1 + point2)

  });
});