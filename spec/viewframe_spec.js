describe("Viewframe", function () {
  var origin, size, frame;
  beforeEach(function () {
    origin = new Point (0, 100);
    size = new Point (800, 600);
    frame = new viewFrame (origin, size);
  });

  describe('Dimensions', function () {
    
    [['height',600], ['width',800], ['left',0], ['bottom', 100]].forEach(function (dimension) {
      it('should have a '+dimension[0], function(){
        expect(frame[dimension[0]]()).toEqual(dimension[1]);
      });
    });

    it('should be able to give an attribute string', function (){
      expect(frame.toString()).toBe('0 100 800 600');
    });
  });
});