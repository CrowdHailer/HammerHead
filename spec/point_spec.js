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

  describe('geometric operations', function(){
    var point1, point2, newPoint;
    beforeEach(function(){
      point1 = Hammerhead.Point(2, 3);
      point2 = Hammerhead.Point(3, -1);
    });

    it('adding points', function(){
      newPoint = point1.add(point2);
      expect(newPoint.x).toEqual(5);
      expect(newPoint.y).toEqual(2);
    });

    it('subtracting points', function(){
      newPoint = point1.subtract(point2);
      expect(newPoint.x).toEqual(-1);
      expect(newPoint.y).toEqual(4);
    });

    it('scalar multiplication', function(){
      newPoint = point1.multiply(0.5);
      expect(newPoint.x).toEqual(1);
      expect(newPoint.y).toEqual(1.5);
    });

    it('transform by matrix', function(){
      var matrix = {a:2, b:0, c:0, d:2, e:1, f:3};
      expect(point1.transform(matrix)).toEqual(Hammerhead.Point(5, 9));
    });

    it('scale by matrix', function(){
      var matrix = {a:2, b:0, c:0, d:2, e:1, f:3};
      expect(point1.scaleTransform(matrix)).toEqual(Hammerhead.Point(4, 6));
    });
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

});