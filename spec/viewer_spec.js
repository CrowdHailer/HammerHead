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
        Hammerhead('not-svg');
      }).toThrow(new Error('Id: not-svg is not a SVG element'));
    });
  });

  describe('valid properties' ,function(){
    var viewer, testSVG, preventDefault;
    beforeEach(function(){
      preventDefault = function(){};
      svgString = '<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>';
      document.body.innerHTML += svgString;
      testSVG = document.getElementById('test');
      testPath = document.getElementById('test-path');
      viewer = Hammerhead('test', {throttleDelay: 0, conditions: function(){ return true; }});
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
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('transformstart', {preventDefault: preventDefault});
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

    afterEach(function(){
      var fix = document.getElementById('test');
      fix.parentElement.removeChild(fix);
    });
  });

describe('api handle' ,function(){
    var viewer, testSVG, preventDefault, Pt;
    beforeEach(function(){
      preventDefault = function(){};
      svgString = '<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>';
      document.body.innerHTML += svgString;
      testSVG = document.getElementById('test');
      testPath = document.getElementById('test-path');
      viewer = Hammerhead('test', {throttleDelay: 0, conditions: function(){ return true; }});
      Pt = Hammerhead.Point;
    });

    it('should drag from the same origin for drag calls', function(){
      viewer.element.drag(Pt(500, 250));
      expect(testSVG.getAttribute('viewBox')).toEqual('-2000 -1000 2000 1000');
      viewer.element.drag(Pt(200, 100));
      expect(testSVG.getAttribute('viewBox')).toEqual('-800 -400 2000 1000');
    });

    it('should fix transformations', function(){
      viewer.element.drag(Pt(500, 250)).fix();
      expect(testSVG.getAttribute('viewBox')).toEqual('-2000 -1000 2000 1000');
      viewer.element.drag(Pt(200, 100));
      expect(testSVG.getAttribute('viewBox')).toEqual('-2800 -1400 2000 1000');
    });

    it('should zoom from the same reference forzoom calls', function(){
      viewer.element.zoom(2, Pt(0, 0));
      expect(testSVG.getAttribute('viewBox')).toMatch(/-\d+\s-\d+\s1000\s500/);
      viewer.element.zoom(2, Pt(0, 0));
      expect(testSVG.getAttribute('viewBox')).toMatch(/\d+\s-\d+\s1000\s500/);
    });

    afterEach(function(){
      var fix = document.getElementById('test');
      fix.parentElement.removeChild(fix);
    });
  });
  describe('TOP api handle' ,function(){
    var viewer, testSVG, preventDefault, Pt;
    beforeEach(function(){
      preventDefault = function(){};
      svgString = '<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>';
      document.body.innerHTML += svgString;
      testSVG = document.getElementById('test');
      testPath = document.getElementById('test-path');
      viewer = Hammerhead('test', {throttleDelay: 0, conditions: function(){ return true; }});
      Pt = Hammerhead.Point;
    });

    it('should drag from the same origin for drag calls', function(){
      viewer.drag(500, 250);
      expect(testSVG.getAttribute('viewBox')).toEqual('-2000 -1000 2000 1000');
      viewer.drag(200, 100);
      expect(testSVG.getAttribute('viewBox')).toEqual('-800 -400 2000 1000');
    });

    it('should fix transformations', function(){
      viewer.drag(500, 250).fix();
      expect(testSVG.getAttribute('viewBox')).toEqual('-2000 -1000 2000 1000');
      viewer.drag(200, 100);
      expect(testSVG.getAttribute('viewBox')).toEqual('-2800 -1400 2000 1000');
    });

    it('should zoom from the same reference forzoom calls', function(){
      viewer.zoomIn(2);
      expect(testSVG.getAttribute('viewBox')).toEqual('500 250 1000 500');
      viewer.zoomIn(2);
      expect(testSVG.getAttribute('viewBox')).toEqual('500 250 1000 500');
    });

    it('should have orthogonal drag handlers, default 100px', function(){
      viewer.dragX().fix();
      viewer.dragY();
      expect(testSVG.getAttribute('viewBox')).toEqual('-400 -400 2000 1000');
    });

    it('should have orthogonal drag handlers, accept pixel distance', function(){
      viewer.dragX(200).fix();
      viewer.dragY(200);
      expect(testSVG.getAttribute('viewBox')).toEqual('-800 -800 2000 1000');
    });

    it('should have a zoom in hander, default 1.25', function(){
      viewer.zoomIn();
      expect(testSVG.getAttribute('viewBox')).toEqual('200 100 1600 800');
    });

    it('should have a zoom out hander, default 0.8', function(){
      viewer.zoomOut();
      expect(testSVG.getAttribute('viewBox')).toEqual('-250 -125 2500 1250');
    });

    it('should zoom in and out the same amount', function(){
      viewer.zoomOut().fix().zoomIn();
      expect(testSVG.getAttribute('viewBox')).toEqual('0 0 2000 1000');
    });

    afterEach(function(){
      var fix = document.getElementById('test');
      fix.parentElement.removeChild(fix);
    });
  });
  describe('Initialisation options' ,function(){
    var viewer, testSVG, preventDefault;
    beforeEach(function(){
      preventDefault = function(){};
      svgString = '<svg id="test" width="500" viewBox="0 0 2000 1000"><path id="test-path"></path></svg>';
      document.body.innerHTML += svgString;
      testSVG = document.getElementById('test');
      testPath = document.getElementById('test-path');
    });

    it('should not make repeated calls to change the viewbox with a throttle limit', function(){
      viewer = Hammerhead('test', {throttleDelay: 20});
      var hammerHandle = viewer._test.hammertime;
      spyOn(testSVG, "setAttribute");
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      hammerHandle.trigger('drag', {deltaX: 50, deltaY: 25, preventDefault: preventDefault, timeStamp: 1});
      hammerHandle.trigger('drag', {deltaX: 50, deltaY: 25, preventDefault: preventDefault, timeStamp: 1});
      expect(testSVG.setAttribute.calls.length).toEqual(1);
      hammerHandle.trigger('release', {});
    });

    it('should be possible to overide the default drag functions', function(){
      viewer = Hammerhead('test', {throttleDelay: 0, dragX: 10, dragY: 10, conditions: function(){ return true; }});
      viewer.dragX().fix();
      viewer.dragY();
      expect(testSVG.getAttribute('viewBox')).toEqual('-40 -40 2000 1000');
    });

    it('should be possible to overide the default Zoom in scale', function(){
      viewer = Hammerhead('test', {throttleDelay: 0, zoomIn: 2, conditions: function(){ return true; }});
      viewer.zoomIn();
      expect(testSVG.getAttribute('viewBox')).toEqual('500 250 1000 500');
    });

    it('should be possible to overide the default Zoom out scale', function(){
      viewer = Hammerhead('test', {throttleDelay: 0, zoomOut: 0.5, conditions: function(){ return true; }});
      viewer.zoomOut();
      expect(testSVG.getAttribute('viewBox')).toEqual('-1000 -500 4000 2000');
    });

    it('should be able to execute given prefix function', function(){
      var dummy = {test: function(){}};
      spyOn(dummy, 'test');
      viewer = Hammerhead('test', {throttleDelay: 0, prefix: dummy.test});
      var hammerHandle = viewer._test.hammertime;
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      expect(dummy.test.calls.length).toEqual(1);
      hammerHandle.trigger('release', {});
      expect(dummy.test.calls.length).toEqual(1);
    });

    it('should be able to execute given postfix function', function(){
      var dummy = {test: function(){}};
      spyOn(dummy, 'test');
      viewer = Hammerhead('test', {throttleDelay: 0, postfix: dummy.test});
      var hammerHandle = viewer._test.hammertime;
      hammerHandle.trigger('touch', {target: testPath, preventDefault: preventDefault});
      expect(dummy.test.calls.length).toEqual(0);
      hammerHandle.trigger('release', {});
      expect(dummy.test.calls.length).toEqual(1);
    });

    afterEach(function(){
      var fix = document.getElementById('test');
      fix.parentElement.removeChild(fix);
    });
  });
});