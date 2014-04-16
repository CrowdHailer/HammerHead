describe("Viewframe", function () {
  beforeEach(function () {
    origin = new Point (0, 0);
    size = new Point (800, 600);
    frame = new viewFrame (origin, size);
  });

  it('should be initialized with a size and position', function () {
    expect(frame.getOrigin()).toBe(origin);
  });

  describe('Dimensions', function () {
    it('should be possible to read the width', function () {
      expect(frame.getWidth()).toEqual(800);
    });
  });
});