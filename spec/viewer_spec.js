describe('Hammerhead', function(){
  describe('invalid svg situations', function(){
    it('should raise an exception if not given an element', function(){
      spyOn(document, "getElementById").andReturn(null);
      expect(function(){
        Hammerhead('invalid');
      }).toThrow(new Error('Id: invalid is not a SVG element'));
    });

    it('should raise an exception if not given an svg', function(){
      spyOn(document, "getElementById").andReturn({tagName: 'p'});
      expect(function(){
        new Hammerhead ('not-svg');
      }).toThrow(new Error('Id: not-svg is not a SVG element'));
    });
  });

  xdescribe('valid properties' ,function(){
    var viewer, testSVG, preventDefault;
    beforeEach(function(){
      preventDefault = function(){};
      svgString = '<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>';
      document.body.innerHTML += svgString;
      testSVG = document.getElementById('test');
      testPath = document.getElementById('test-path');
      viewer = new Hammerhead ('test');
    });

    it('should drag from the same origin for drag events', function(){
      var hammerHandle = viewer._test.hammertime;
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('dragstart', {preventDefault: preventDefault});
      hammerHandle.trigger('drag', {deltaX: 500, deltaY: 250, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toEqual('-2000 -1000 2000 1000');
      hammerHandle.trigger('drag', {deltaX: 200, deltaY: 100, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toEqual('-800 -400 2000 1000');
      hammerHandle.trigger('release', {});
    });

    it('should drag permanently on drag end events', function(){
      var hammerHandle = viewer._test.hammertime;
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('dragstart', {preventDefault: preventDefault});
      hammerHandle.trigger('drag', {deltaX: 500, deltaY: 250, preventDefault: preventDefault});
      hammerHandle.trigger('release', {});
      expect(testSVG.getAttribute('viewBox')).toEqual('-2000 -1000 2000 1000');
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('dragstart', {preventDefault: preventDefault});
      hammerHandle.trigger('drag', {deltaX: 200, deltaY: -100, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toEqual('-2800 -600 2000 1000');
      hammerHandle.trigger('release', {});
    });

    it('should zoom from the same reference for pinch events', function(){
      var hammerHandle = viewer._test.hammertime;
      // console.log(1);
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      // console.log(2);
      hammerHandle.trigger('transformstart', {preventDefault: preventDefault});
      // console.log(3);
      hammerHandle.trigger('pinch', {center:{pageX:0,  pageY: 0}, scale: 2, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toMatch(/-\d+\s-\d+\s1000\s500/);
      hammerHandle.trigger('pinch', {center:{pageX:500,  pageY: 0}, scale: 2, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toMatch(/\d+\s-\d+\s1000\s500/);
      hammerHandle.trigger('release', {});
    });

    it('should zoom permanently on release events', function(){
      var hammerHandle = viewer._test.hammertime;
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('pinch', {center:{pageX:0,  pageY: 0}, scale: 2, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toMatch(/-\d+\s-\d+\s1000\s500/);
      hammerHandle.trigger('release', {});
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('pinch', {center:{pageX:0,  pageY: 0}, scale: 0.5, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toEqual('0 0 2000 1000');
      hammerHandle.trigger('release', {});
    });

    it('should clean up temporary transform events', function(){
      var hammerHandle = viewer._test.hammertime;
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('dragstart', {preventDefault: preventDefault});
      hammerHandle.trigger('drag', {deltaX: 500, deltaY: 250, preventDefault: preventDefault});
      hammerHandle.trigger('release', {});
      expect(testSVG.getAttribute('viewBox')).toEqual('-2000 -1000 2000 1000');
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('dragstart', {preventDefault: preventDefault});
      hammerHandle.trigger('drag', {deltaX: 200, deltaY: -100, preventDefault: preventDefault});
      expect(testSVG.getAttribute('viewBox')).toEqual('-2800 -600 2000 1000');
      hammerHandle.trigger('release', {});
    });

    it('should not make repeated calls to change the viewbox', function(){
      var hammerHandle = viewer._test.hammertime;
      spyOn(viewer._test.handlers, "drag");
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('drag', {deltaX: 500, deltaY: 250, preventDefault: preventDefault, timeStamp: 1});
      hammerHandle.trigger('drag', {deltaX: 500, deltaY: 250, preventDefault: preventDefault, timeStamp: 1});
      expect(viewer._test.handlers.drag.calls.length).toEqual(1);
    });

    afterEach(function(){
      var fix = document.getElementById('test');
      fix.parentElement.removeChild(fix);
    });
  });
});