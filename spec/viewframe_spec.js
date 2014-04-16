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

  describe('shallow transform', function () {
    it('should be able to translate', function () {
      var translation = new Point (100, 100);
      expect(frame.translate(translation).toString()).toEqual('100 200 800 600');
      expect(frame.toString()).toEqual('0 100 800 600');
    });
  });

  describe('deep transform', function () {
    it('should be able to translate permanently', function () {
      var translation = new Point (100, 100);
      frame.anchorTranslate(translation);
      expect(frame.left()).toEqual(100);
      expect(frame.bottom()).toEqual(200);
    });
  });
});