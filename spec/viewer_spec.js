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
      var fix = document.getElementById('not-svg');
      fix.parentElement.removeChild(fix);
    });

    it('should raise an expection if SVG has no viewbox', function () {
      svgString = '<svg id="no-viewbox"></svg>';
      document.body.innerHTML += svgString;
      expect(function () {
        new Viewer ('no-viewbox');
      }).toThrow(new Error('Id: no-viewbox has no viewBox attribute'));
      var fix = document.getElementById('no-viewbox');
      fix.parentElement.removeChild(fix);
    });
  });

  describe('valid properties' ,function () {
    beforeEach(function () {
      svgString = '<svg id="test" viewBox="0 0 2000 1000"></svg>';
      document.body.innerHTML += svgString;
    });


    it('create a view frame from valid input', function () {
      spyOn(window, 'viewFrame');
      new Viewer ('test');
      expect(viewFrame).toHaveBeenCalledWith(new Point(0,0), new Point(2000,1000));
    });

    it('should be able to transpose points', function () {
      var element = document.getElementById('test');
      console.log(element.getCTM());
      console.log(element.getScreenCTM());
      console.log(document.getElementsByTagName('svg').length);
    });

    afterEach(function () {
      var fix = document.getElementById('test');
      fix.parentElement.removeChild(fix);
    });
  });
});