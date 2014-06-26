var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem)
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};


function init(){
  //init data
  var json = bonjovi;
/*
{
   "data": {},
   "id": "root",
   "name": "Staten Danmark",
   "children": [
        {
          "id": "aar_2013",
          "name": "2013",
          "data": {
            "playcount": 607,
            "$area": 607
          },
          "children": [
            {
              "data": {
                "playcount": "317",
                "$color": "#4FB31F",
                "$area": 317
              },
              "id": "income_2013",
              "name": "Indtægter",
              "children": [
              {
                "children": [],
                "data": {
                  "playcount": "290",
                  "$color": "#F70707",
                  "image": "http://userserve-ak.last.fm/serve/300x300/8590515.jpg",
                  "$area": 290
                },
                "id": "albasum-Superunknown",
                "name": "Superunknown"
              }
              ]
            },
            {
              "children": [],
              "data": {
                "playcount": "290",
                "$color": "#F70707",
                "image": "http://userserve-ak.last.fm/serve/300x300/8590515.jpg",
                "$area": 290
              },
              "id": "expense_2013",
              "name": "Udgifter"
            }
          ]
        },
        {
          "children": [
            {
              "children": [],
              "data": {
                "playcount": "198",
       "penis":"hej",
                "$color": "#AE5032",
                "image": "http://userserve-ak.last.fm/serve/300x300/8599099.jpg",
                "$area": 198
              },
              "id": "album-On And On",
              "name": "On And On"
            },
            {
              "children": [],
              "data": {
                "playcount": "186",
                "$color": "#B34B32",
                "image": "http://userserve-ak.last.fm/serve/300x300/30082075.jpg",
                "$area": 186
              },
              "id": "album-Brushfire Fairytales",
              "name": "Brushfire Fairytales"
            }
          ],
          "data": {
            "playcount": 384,
            "$area": 384
          },
          "id": "artist_Jack Johnson",
          "name": "Jack Johnson"
        },
        {
          "children": [
            {
              "children": [],
              "data": {
                "playcount": "349",
                "$color": "#718D32",
                "image": "http://userserve-ak.last.fm/serve/300x300/21881921.jpg",
                "$area": 349
              },
              "id": "album-Mother Love Bone",
              "name": "Mother Love Bone"
            }
          ],
          "data": {
            "playcount": 349,
            "$area": 349
          },
          "id": "artist_Mother Love Bone",
          "name": "Mother Love Bone"
        }
      ]
};*/
  //end
    $jit.TM.Squarified.implement({
        'onLeftClick': function(elem) {
            //if is leaf
            var node = TreeUtil.getSubtree(this.tree, elem.parentNode.id);
            if(node.children && node.children.length == 0) {
                var oldparent = node, newparent = node;
                while(newparent.id != this.shownTree.id) {
                    oldparent = newparent;
                    newparent = TreeUtil.getParent(this.tree, newparent.id);
                }
                this.view(oldparent.id);
            } else {
              this.enter(elem);
            }
        }
    });
  //init TreeMap
  var tm = new $jit.TM.Squarified({

    //where to inject the visualization
    injectInto: 'infovis',
        //show only one tree level
    levelsToShow: 1,
    //parent box title heights
    titleHeight: 35,
    //enable animations
    animate: animate,
      //add cushion gradients
  //cushion: useGradients,
    //box offsets
    offset: 1,

    //Attach left and right click events
    Events: {
      enable: true,
      onClick: function(node) {
        if(node) tm.enter(node);
      },
      onRightClick: function() {
        tm.out();
      }
    },
    duration: 800,
    //Enable tips
    Tips: {
      enable: true,
      //add positioning offsets
      offsetX: 20,
      offsetY: 20,
      //implement the onShow method to
      //add content to the tooltip when a node
      //is hovered
      onShow: function(tip, node, isLeaf, domElement) {
        var html = "<div class=\"tip-title\">" + node.name
          + "</div><div class=\"tip-text\">";
        var data = node.data;
	       for (var key in data) {
	            if(key.indexOf('$')>=0){}else{
		               if(data.hasOwnProperty(key)){
	                    html +="<div id="+"+>"+key+" : "+ data[key]+"</div>";
      }
		}
	}
        tip.innerHTML =  html;
      }
    },
    //Add the name of the node in the correponding label
    //This method is called once, on label creation.
    onCreateLabel: function(domElement, node){
        domElement.innerHTML = node.name;
        var style = domElement.style;
        style.display = '';
        style.border = '1px solid transparent';
        domElement.onmouseover = function() {
          style.border = '1px solid #9FD4FF';
        };
        domElement.onmouseout = function() {
          style.border = '1px solid transparent';
        };
    }
  });

  tm.loadJSON(json);
  tm.refresh();
  //end
  //add events to radio buttons
  var sq = $jit.id('r-sq'),
      st = $jit.id('r-st'),
      sd = $jit.id('r-sd');
  var util = $jit.util;
  util.addEvent(sq, 'change', function() {
    if(!sq.checked) return;
    util.extend(tm, new $jit.Layouts.TM.Squarified);
    tm.refresh();
  });
  util.addEvent(st, 'change', function() {
    if(!st.checked) return;
    util.extend(tm, new $jit.Layouts.TM.Strip);
    tm.layout.orientation = "v";
    tm.refresh();
  });
  util.addEvent(sd, 'change', function() {
    if(!sd.checked) return;
    util.extend(tm, new $jit.Layouts.TM.SliceAndDice);
    tm.layout.orientation = "v";
    tm.refresh();
  });
  //add event to the back button
  var back = $jit.id('back');
  $jit.util.addEvent(back, 'click', function() {
    tm.out();
  });
}
