describe('Point', function(){
  it('should be initialised with 2 coordinates', function(){
    var point = new Point(2,3);
    expect(point.x).toBe(2);
    expect(point.y).toBe(3);
  });
});