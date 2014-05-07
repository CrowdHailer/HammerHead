describe('Point', function(){
  var point;
  describe('initialisation', function(){
    it('from 2 coordinates', function(){
      point = Hammerhead.Point(2, 3);
      expect(point.x).toBe(2);
      expect(point.y).toBe(3);
    });

    it('from another point', function(){
      var pointInit = Hammerhead.Point(2, 3);
      point = Hammerhead.Point(pointInit);
      expect(point.x).toBe(2);
      expect(point.y).toBe(3);
      point.x = 4;
      expect(pointInit).not.toEqual(point);
    });

    it('from a screen point', function(){
      point = Hammerhead.Point({pageX: 2, pageY: 3});
      expect(point.x).toBe(2);
      expect(point.y).toBe(3);
    });

    it('should be possible to initialize from a displacement vector', function(){
      point = Hammerhead.Point({deltaX: 2, deltaY: 3});
      expect(point.x).toBe(2);
      expect(point.y).toBe(3);
    });
  });



  xit('should be able to add points', function(){
    var point1 = new Point(2,3);
    var point2 = new Point(3,-1);
    var newPoint = point1.add(point2);
    expect(newPoint.x).toEqual(5);
    expect(newPoint.y).toEqual(2);
  });

  xit('should be able to subtract points', function(){
    var point1 = new Point(2,3);
    var point2 = new Point(3,-1);
    var newPoint = point1.subtract(point2);
    expect(newPoint.x).toEqual(-1);
    expect(newPoint.y).toEqual(4);
  });

  xit('should be possible to scale a point', function(){
    var point = new Point(2,3);
    var scale = 2;
    var newPoint = point.multiply(scale);
    expect(newPoint.x).toEqual(4);
    expect(newPoint.y).toEqual(6);
  });

  xit('should be possible to scale a point by a fraction', function(){
    var point = new Point(2,3);
    var scale = 0.5;
    var newPoint = point.multiply(scale);
    expect(newPoint.x).toEqual(1);
    expect(newPoint.y).toEqual(1.5);
  });

  xit('should be possible to map to a svg element', function(){
    var screenPoint = new Point(2,3);
    svgString = '<svg id="test" viewBox="0 0 2000 1000" width="200"></svg>';
    document.body.innerHTML += svgString;
    var element = document.getElementById('test');
    var newPoint = screenPoint.mapTo(element);
    console.log(screenPoint);
    console.log(newPoint);
    var fix = document.getElementById('test');
    fix.parentElement.removeChild(fix);
  });

  xit('should be possible to transform by matrix', function(){
    var screenPoint = new Point(2,3);
    var matrix = {a:2, b:0, c:0, d:2, e:1, f:3};
    expect(screenPoint.transform(matrix)).toEqual(new Point(5, 9));
  });

  xit('should be possible to scale by a matrix', function(){
    var delta = new Point(2,3);
    var matrix = {a:2, b:0, c:0, d:2, e:1, f:3};
    expect(delta.scaleTransform(matrix)).toEqual(new Point(4, 6));
  });
});