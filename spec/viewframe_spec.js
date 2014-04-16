describe("Viewframe", function () {
  var origin, size, frame;
  beforeEach(function () {
    origin = new Point (0, 0);
    size = new Point (800, 600);
    frame = new viewFrame (origin, size);
  });

  describe('Dimensions', function () {
    [['height',600], ['width',800]].forEach(function (dimension) {
      it('should have a '+dimension[0], function(){
        expect(frame[dimension[0]]()).toEqual(dimension[1]);
      });
    }); 
  });
});