describe("Viewframe", function () {
  var element, origin, size;
  beforeEach(function(){
    element = {
      getAttribute: function(){ return '1 2 3 4'; },
      setAttribute: function(){ return true; },
      getScreenCTM: function(){
        return {
          inverse: function(){ return {a: 2, b: 0, c: 0, d: 2, e: 0, f: 0}; }
        };
      }
    };
    origin = new Point (0, 1);
    size = new Point (8, 6);
  });

  describe('initialising the viewFrame', function(){
    it('should read the viewbox charachteristics when not given specifics', function(){
      var frame = new ViewFrame(element);
      expect(frame.x0()).toEqual(1);
      expect(frame.y0()).toEqual(2);
      expect(frame.dX()).toEqual(3);
      expect(frame.dY()).toEqual(4);
    });

    it('should use origin and size arguments if provided', function(){
      frame = new ViewFrame (element, origin, size);
      expect(frame.x0()).toEqual(0);
      expect(frame.y0()).toEqual(1);
      expect(frame.dX()).toEqual(8);
      expect(frame.dY()).toEqual(6);
    });

    it('should return a viewBox string', function(){
      frame = new ViewFrame (element, origin, size);
      expect(frame.toString()).toBe('0 1 8 6');
    });
  });

  describe('transformations in SVG pixels', function(){
    beforeEach(function () {
      frame = new ViewFrame (element, origin, size);
    });

    it('should translate temporarily when permanent argument untrue', function(){
      expect(frame.translate(new Point(1, 1)).toString()).toEqual('-1 0 8 6');
      expect(frame.toString()).toEqual('0 1 8 6');
    });

    it('should translate permanently when permanent argument true', function(){
      frame.translate(new Point(1, 1), true);
      expect(frame.toString()).toEqual('-1 0 8 6');
    });

    it('should scale temporarily when permanent argument untrue', function(){
      expect(frame.scale(new Point(0, 1), 0.5).toString()).toEqual('0 1 4 3');
      expect(frame.toString()).toEqual('0 1 8 6');
    });

    it('should scale permanently when permanent argument true', function(){
      frame.scale(new Point(0, 1), 0.5, true);
      expect(frame.toString()).toEqual('0 1 4 3');
    });
  });

  describe('moving in page pixels', function(){
    beforeEach(function () {
      frame = new ViewFrame (element, origin, size);
    });

    it('should drag temporarily when permanent argument untrue', function(){
      expect(frame.drag(new Point(1, 1)).toString()).toEqual('-2 -1 8 6');
      expect(frame.toString()).toEqual('0 1 8 6');
    });

    it('should drag permanently when permanent argument true', function(){
      frame.drag(new Point(1, 1), true);
      expect(frame.toString()).toEqual('-2 -1 8 6');
    });

    it('should zoom temporarily when permanent argument untrue', function(){
      expect(frame.zoom(new Point(0, 0.5), 0.5).toString()).toEqual('0 1 4 3');
      expect(frame.toString()).toEqual('0 1 8 6');
    });

    it('should zoom permanently when permanent argument true', function(){
      frame.zoom(new Point(0, 0.5), 0.5, true);
      expect(frame.toString()).toEqual('0 1 4 3');
    });
  });

  describe('moving to a target view', function(){
    beforeEach(function () {
      frame = new ViewFrame (element, origin, size);
    });

    it('should home to its initial values if no argument given', function(){
      frame.translate(new Point(1, 1), true);
      frame.home();
      expect(frame.toString()).toEqual('0 1 8 6');
    });

    it('should set viewbox values when they are provided', function(){
      frame.home({origin: new Point(-1, 2), size: new Point(4, 5)});
      expect(frame.toString()).toEqual('-1 2 4 5');
    });
  });
});