/* MYSCRIPT.JS ======================================= */


/* Mobile Main Nav =================== 
$(function() {
	$(".keyboard-item").click(function() {
		$(this).toggleClass("toggle");
	});
});

*/


/* Pressed btn =================== 
$(function() {
	$(".keyboard-item.special").click(function() {
		$(this).toggleClass("pressed");
	});
});

*/


$(function() {
  window.input = document.getElementById('test');
  var pluginEl = document.getElementById('editor-keyboard-plugin');

  window.keyboardPlugin = initEditorKeyboard(pluginEl, (e)=>{input.value = e;});
  

});

var initEditorKeyboard = function initEditorKeyboard(pluginEl, callback) {

  var self;
  
  var tagsToReplace = {
     '&amp;':'&',
     '&lt;':'<',
     '&gt;':'>'
  };

  function replaceTag(tag) {
      return tagsToReplace[tag] || tag;
  }

  function safe_tags_replace(str) {
      return str.replace(str,replaceTag);
  }

  function GetElementInsideContainer(container, childID) {
      var elm = {};
      var elms = container.children;
      for (var i = 0; i < elms.length; i++) {
          if (elms[i].id === childID) {
              elm = elms[i];
              break;
          }
      }
      return elm;
  }

  var keysElements = [];
  for(var i =1; i < 6; i++) {
    keysElements.push({
      keySpec: GetElementInsideContainer(pluginEl, 'key-spec-' + i),
      subkeysElements: []
    });
    for(var j = 0; j<5; j++)
      keysElements[i-1].subkeysElements.push(GetElementInsideContainer(keysElements[i-1].keySpec.children[1], 'key-spec-' + i + '-' + j));
  }

  keysElements.forEach((element)=>{
    var startPoint;
    var prevPoint;
    var borders;
    var sIndex;

    var selected = function(index) {
      if(index != undefined) sIndex = index;

      for(var i = 0; i<element.subkeysElements.length; i++)  {
        if(i== sIndex) element.subkeysElements[i].classList.add('selected');
        else element.subkeysElements[i].classList.remove('selected');
      }

      return sIndex;
    };

    var moveSelect = function(e) {
      var currentPoint = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
      if(currentPoint[1]> borders.b) {
        if(currentPoint[0]> startPoint[0]) 
          selected(4);
        else 
          selected(3);
      }
      else if(currentPoint[1]< borders.t) {
        if(currentPoint[0]> startPoint[0]) 
          selected(2);
        else 
          selected(1);
      }
      else if(currentPoint[0]> borders.r) {
        if(currentPoint[1] < startPoint[1])
          selected(2)
        else
          selected(4);
      }
      else if(currentPoint[0] < borders.l) {
        if(currentPoint[1] < startPoint[1])
          selected(1)
        else
          selected(3);
      }
      else selected(0);

      prevPoint = currentPoint;
      //console.log('selected', selected);
    };

    var calcArea = function(startPoint, width, height) {
      return {
        t: -height/4 + startPoint[1],
        b: height/4 + startPoint[1],
        l: -width/4 + startPoint[0],
        r: width/4 + startPoint[0]   
      }
    };


    element.keySpec.addEventListener('touchstart', (e)=>{
      startPoint = [parseInt(e.changedTouches[0].clientX), parseInt(e.changedTouches[0].clientY)]
      //console.log(startPoint);

      borders = calcArea(startPoint, element.keySpec.offsetWidth, element.keySpec.offsetHeight);
      //console.log(borders);

      selected(0);

      element.keySpec.classList.add('pressed');
      element.keySpec.addEventListener('touchmove', moveSelect);    
    });

    element.keySpec.addEventListener('touchend', (e)=>{
      element.keySpec.removeEventListener('touchmove', moveSelect);   
      element.keySpec.classList.remove('pressed'); 
      callback(safe_tags_replace(element.subkeysElements[selected()].innerHTML));
      selected(0);
    });    
  });

  return {
      keysElements: keysElements
  }
}

