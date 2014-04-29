describe("Viewframe", function () {
  describe('viewfram given explicit parameter', function(){
    var origin, size, frame, SVGElement;
    beforeEach(function () {
      origin = new Point (0, 100);
      size = new Point (800, 600);
      frame = new viewFrame (SVGElement, origin, size);
    });

    describe('Dimensions', function () {
      
      [['dY',600], ['dX',800], ['x0',0], ['y0', 100]].forEach(function (dimension) {
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

      it('should translate from the anchor point', function () {
        var translation1 = new Point (100, 100);
        var translation2 = new Point (200, -100);
        frame.translate(translation1);
        expect(frame.translate(translation2).toString()).toEqual('200 0 800 600');
      });

      it('should scale to a point', function () {
        var point = new Point (0, 100);
        expect(frame.scale(point, 0.5).toString()).toEqual('0 100 400 300');
      });
      it('should scale to a point', function () {
        var point = new Point (800, 700);
        expect(frame.scale(point, 0.5).toString()).toEqual('400 400 400 300');
      });
    });

    describe('deep transform', function () {
      it('should be able to translate permanently', function () {
        var translation = new Point (100, 100);
        frame.translate(translation, true);
        expect(frame.x0()).toEqual(100);
        expect(frame.y0()).toEqual(200);
      });

      it('should multitranslate', function () {
        var translation1 = new Point (100, 100);
        var translation2 = new Point (200, -100);
        frame.translate(translation1, true);
        frame.translate(translation2, true);
        expect(frame.x0()).toEqual(300);
        expect(frame.y0()).toEqual(100);
      });

      it('should be able to scale Permanently', function () {
        var center = new Point (0, 100);
        frame.scale(center, 2, true);
        expect(frame.toString()).toEqual('0 100 1600 1200');
      });
    });

    it('should have a permanent home value', function () {
      var translation = new Point (100, 100);
      frame.translate(translation, true);
      frame.home();
      expect(frame.toString()).toEqual('0 100 800 600');
    });

    it('should be able to home to a point', function () {
      var location = new Point (-100, 200);
      var extent = new Point (400, 400);
      frame.home({origin: location, size: extent});
      expect(frame.toString()).toEqual('-100 200 400 400');
    });
  });
});