describe('viewer', function () {
  var svgString;
  beforeEach(function () {
    svgString = '<svg id="test"></svg>';
    document.body.innerHTML += svgString;
  });

  it('should raise an exception if not given an svg', function () {
    expect(function () {
      new Viewer('INVALID');
    }).toThrow();
  });

  it('should return true if given svg element', function () {
    expect(new Viewer('test')).toBe(false);
  });
});