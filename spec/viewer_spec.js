describe('viewer', function () {
  var svgString;
  var preventDefault = function(){ };

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

  it('create a view frame from valid input', function () {
    svgString = '<svg id="test" width="500" viewBox="0 0 2000 1000"></svg>';
    document.body.innerHTML += svgString;
    spyOn(window, 'viewFrame');
    viewer = new Viewer ('test');
    expect(viewFrame).toHaveBeenCalledWith(null, new Point(0,0), new Point(2000,1000));
    var fix = document.getElementById('test');
    fix.parentElement.removeChild(fix);
  });

  describe('valid properties' ,function () {
    var viewer, testSVG;
    beforeEach(function () {
      svgString = '<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>';
      document.body.innerHTML += svgString;
      testSVG = document.getElementById('test');
      testPath = document.getElementById('test-path');
      viewer = new Viewer ('test');
    });

    it('should be possible to drag the svg', function(){
      viewer.drag(250, -125);
      expect(testSVG.getAttribute('viewBox')).toEqual('-1000 500 2000 1000');
    });

    it('should be possible to zoom the svg', function() {
      viewer.zoom(0, 0, 2);
      expect(testSVG.getAttribute('viewBox')).toMatch(/-\d+\s-\d+\s1000\s500/);
    });

    it('should drag from the same origin for drag events', function() {
      var hammerHandle = viewer._test.hammertime;
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('dragstart', {preventDefault: preventDefault});
      hammerHandle.trigger('drag', {deltaX: 500, deltaY: 250, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toEqual('-2000 -1000 2000 1000');
      hammerHandle.trigger('drag', {deltaX: 200, deltaY: 100, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toEqual('-800 -400 2000 1000');
      hammerHandle.trigger('release', {});
    });

    it('should drag permanently on drag end events', function () {
      var hammerHandle = viewer._test.hammertime;
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('dragstart', {preventDefault: preventDefault});
      hammerHandle.trigger('dragend', {deltaX: 500, deltaY: 250, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toEqual('-2000 -1000 2000 1000');
      hammerHandle.trigger('drag', {deltaX: 200, deltaY: -100, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toEqual('-2800 -600 2000 1000');
      hammerHandle.trigger('release', {});
    });

    it('should zoom from the same reference for pinch events', function() {
      var hammerHandle = viewer._test.hammertime;
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('transformstart', {preventDefault: preventDefault});
      hammerHandle.trigger('pinch', {center:{pageX:0,  pageY: 0}, scale: 2, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toMatch(/-\d+\s-\d+\s1000\s500/);
      hammerHandle.trigger('pinch', {center:{pageX:500,  pageY: 0}, scale: 2, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toMatch(/\d+\s-\d+\s1000\s500/);
      hammerHandle.trigger('release', {});
    });

    it('should zoomg permanently on transformend events', function () {
      var hammerHandle = viewer._test.hammertime;
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('transformstart', {preventDefault: preventDefault});
      hammerHandle.trigger('transformend', {center:{pageX:0,  pageY: 0}, scale: 2, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toMatch(/-\d+\s-\d+\s1000\s500/);
      hammerHandle.trigger('pinch', {center:{pageX:0,  pageY: 0}, scale: 0.5, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toEqual('0 0 2000 1000');
      hammerHandle.trigger('release', {});
    });

    afterEach(function () {
      var fix = document.getElementById('test');
      fix.parentElement.removeChild(fix);
    });
  });
});