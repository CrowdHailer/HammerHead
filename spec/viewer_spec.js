describe('viewer', function () {
  var svgString;

  describe('invalid svg situations', function () {
    it('should raise an exception if not given an element', function () {
      expect(function () {
        new Viewer('invalid');
      }).toThrow(new Error('Id: invalid is not a SVG element'));
    });

    it('should raise an exception if not given an svg', function () {
      svgString = '<p id="not-svg"></p>';
      document.body.innerHTML += svgString;
      expect(function () {
        new Viewer ('not-svg');
      }).toThrow(new Error('Id: not-svg is not a SVG element'));
    });

    it('should raise an expection if SVG has no viewbox', function () {
      svgString = '<svg id="no-viewbox"></svg>';
      document.body.innerHTML += svgString;
      expect(function () {
        new Viewer ('no-viewbox');
      }).toThrow(new Error('Id: no-viewbox has no viewBox attribute'));
    });
  });

  beforeEach(function () {
    svgString = '<svg id="test" viewBox="0 0 2000 1000"></svg>';
    svgStringNoViewBox = '<svg id="test"></svg>';

    document.body.innerHTML += svgString;
  });


  it('should return true if given svg element', function () {
    expect(new Viewer('test')).not.toBe(false);
  });
});