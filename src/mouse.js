(function(parent){
  function getWheelDelta(event){
    if (event.wheelDelta) {
      return event.wheelDelta;
    } else {
      return -event.detail * 40;
    }
  }


  function init(hammerhead){
    function handleMouseWheel(event){
      if (event.target.ownerSVGElement) {
        var delta = getWheelDelta(event);
        var scale = Math.pow(2,delta/720);
        console.log(scale);
        hammerhead.zoomIn(scale);
        hammerhead.fix();
      }
    }

    document.addEventListener("mousewheel", handleMouseWheel, false);
    document.addEventListener("DOMMouseScroll", handleMouseWheel, false);
    
  }

  parent.MouseWheel = init;
}(Hammerhead));