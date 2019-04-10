import React, { Component } from "react";
import "./App.css";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import DragSelect from "dragselect";
import Button from "./components/Button/Button";
import Slider from "./components/slider/slider";
import Dropdown from "./components/Dropdown/dropdown";
import Adjust from "./components/Adjust/Adjust";
import { debug } from "util";
import fx from 'glfx';
/* import SelectedElement from './components/SelectedElement/SelectedElement'; */
// import Caman from 'caman'

// --> OFF'

/* eslint no-undef: 0 */
// eslint-disable-next-line
class App extends Component {
  state = {
    btn: [
      { value: "Add Element", id: "" },
      { value: "Group", id: "group" },
      { value: "UngroupAll", id: "ungroup" },
      { value: "Ungroup", id: "ungroupIndivi" },
      { value: "Delete", id: "delete" },
      { value: "Copy", id: "copy" },
      { value: "Adjust", id: "adjust" }
      // { value: "Undo", id: "undo" },
      // { value: "Redo", id: "redo" }
    ],
    dropdown: [
      { value: "Postion", id: "" },
      { value: "Forwards", id: "fwd" },
      { value: "To Front", id: "front" },
      { value: "Backwards", id: "bkwd" },
      { value: "To Back", id: "Back" },
      { value: "Top", id: "top" },
      { value: "Middle", id: "middle" },
      { value: "Bottom", id: "bottom" },
      { value: "Left", id: "left" },
      { value: "Centre", id: "centre" },
      { value: "Right", id: "right" }
    ],
    slidder: {
      range: 0,
      selected: []
    },
    flip: [
      { value: "Flip", id: "" },
      { value: "Horizontal", id: "hori" },
      { value: "Vertical", id: "veri" }
    ],
    adjust: false,
    image: {
      src: null,
      element: null,
      canvaselement: null,
      dataUrl: null,
      allImageElement: []
    },
    platform: null
  };
 base_URL = "http://localhost:3000/";
  constructor(props) {
    super(props);
    var ds;
    this.ds = ds;
    var /* permID ,*/ deleteElm, history;
    this.copyArr = [];
     this.idArray = [];
    this.positionElement = "";
    this.history = history;
    this.deleteElm = deleteElm;
    this.canvas = null;
    Array.prototype.hasMin = function(attrib) {
      return this.reduce(function(prev, curr) {
        return prev[attrib] < curr[attrib] ? prev : curr;
      });
    };

    Array.prototype.hasMax = function(attrib) {
      return this.reduce(function(prev, curr) {
        return prev[attrib] > curr[attrib] ? prev : curr;
      });
    };
    window.caman = Caman;
    try {
      this.canvas = fx.canvas();
      
 } catch (e) {
     alert(e);
     return;
 }
  }

  componentDidMount() {
     this.platform = window.platform
     let image = {...this.state.image}
     image.allImageElement = document.querySelectorAll('img')
     this.setState({ image: image });
  /*   var idArray = []; */
    /* var permIdarray = []; */
    this.ds = new DragSelect({
      selectables: document.getElementsByClassName("ele-select"),
      area: document.getElementById("canvas"),
      onElementSelect: element => {
        /*  if($(element).attr('class').indexOf('flippable') > -1 || 
        $(element).attr('id').indexOf('canvas1') > -1) */
        if (
          $(element)
            .attr("class")
            .indexOf("flippable") > -1
        ) {
          this.canvas = fx.canvas();
          $("#adjust").css({
            opacity: 1,
            disabled: false
          });
        };
        this.positionElement = element;
        let slidder = { ...this.state.slidder };
        slidder.selected.push(element);
        slidder.selected = [...new Set(slidder.selected)];
        slidder.range = Math.trunc($(element).css("opacity") * 100);
        this.setState({
          slidder: slidder,
          platform: this.platform,
        });
        this.idArray.push(this.ds.getSelection());
        this.copyArr.push(element);        
      }
    });
    $(".text").draggable({
      cursor: "move"
    });
    $("#canvas").on("mousedown", ".main-container", e => {
      /* this.ds.clearSelection() */
  let allElements = [...document.querySelectorAll('.ele-select')] 
  for(let i = 0;i<allElements.length;i++){
  if(allElements[i].getAttribute('class').indexOf('ds-selected') > -1){
    $(allElements[i]).removeClass('ds-selected')
    break;
  }
  }
      $("#ungroupIndivi").css({
        opacity: 0
      });
      $("#delete").css({
        opacity: 0
      });
      $("#adjust").css({
        opacity: 0,
        disabled: true
      });
      let slidder = { ...this.state.slidder };
      slidder.selected = [];
      this.setState({
        slidder: slidder,
        adjust: false
      });
      if (
        $(e.target)
          .attr("class")
          .indexOf("main-container") > -1 &&
        $(e.target)
          .attr("class")
          .indexOf("flippable-ele") <= -1 &&
        $(e.target)
          .attr("class")
          .indexOf("flippable") <= -1 
      ) {
        // this.canvasToimg(e);
        if ($(".wrapped").length > 0) {
         
          this.unwrapAll();
        }
        this.ds.start();
      } else {
        // this.canvasToimg(e);
        this.deleteElm = e.target;
        $("#delete").css({
          opacity: 1
        })  
              
        if ($(e.target)[0].nodeName === 'CANVAS' || $(e.target).parent().attr("class").indexOf("perm") > -1 ||
          $(e.target).attr("class").indexOf("perm") > -1 ||
          ($(e.target).attr("class").indexOf("flippable-ele") > -1 &&
            $(e.target).parent().attr("class").indexOf("perm") > -1)) {
          $("#ungroupIndivi").css({
            opacity: 1
          });
          // this.canvasToimg(e);
        }
        this.idArray = [];
        this.ds.stop();
        this.ds.break();
      }
    });
    $("#canvas").on("mouseup", e => {
      if (this.idArray.length > 1) {
        this.check(this.idArray);
      }
      this.ds.stop();
      this.ds.start();
    });

    var map = {}; // You could also use an array
    onkeydown = onkeyup = event => {
      /*  event = event || event; // to deal with IE */
      map[event.keyCode] = event.type === "keydown";
      this.keyEventCheck(event, map);
    };
  }
  
  keyEventCheck = (event, map) => {
/*    console.log(event,map, this.state.platform); */
    if (this.deleteElm && map[46]) {
      this.deleteElme(event);
    }
    if (map[17] && map[18] && map[221] && this.positionElement) {
      this.dropdownClickHandler(event, "To Front");
    }
    if (map[17] && map[18] && map[219] && this.positionElement) {
      this.dropdownClickHandler(event, "To Back");
    }
    if (map[17] && map[221] && this.positionElement) {
      this.dropdownClickHandler(event, "Forwards");
    }
    if (map[17] && map[219] && this.positionElement) {
      this.dropdownClickHandler(event, "Backwards");
    }
    if(map[17] && map[67]){
      this.duplicateElement()
    }

    map = {};
  };
  addElement = () => {
    if ($(".main-container").children().length) {
      var x = $(".text:last");
      var top = parseFloat(x.css("top").slice(0, -2));
      // x = x.attr("id").slice(-1);
      $(".main-container").append(
        "<div class='text ele-select'>" + Math.random().toFixed(2) + "</div>"
      );
      // $(".text:last").attr("id", "text" + ++x);
      this.uuidv4().then(val => {
        $(".text:last").attr("id", "text" + val);
        $(".text:last").css({
          top: top + 27
        });
        $(".text:last").draggable({
          cursor: "move"
        });
        this.ds.addSelectables(document.getElementsByClassName("ele-select"));
      });
    } else {
      $(".main-container").append(
        "<div class='text ele-select'>" + Math.random().toFixed(2) + "</div>"
      );
      $(".text").attr("id", "text" + 1);
      $(".text:last").draggable({
        cursor: "move"
      });
      this.ds.addSelectables(document.getElementsByClassName("ele-select"));
    }
  };

  setElemPosition = (el, i, wrappedPostion) => {
    return new Promise((resolve, reject) => {
      var indivElePos = {};
      indivElePos.top = el.top;
      indivElePos.left = el.left;
      indivElePos.diffTop =
        indivElePos.top < wrappedPostion.wrappedTop.top
          ? wrappedPostion.wrappedTop.top - indivElePos.top
          : indivElePos.top - wrappedPostion.wrappedTop.top;
      indivElePos.diffLeft =
        indivElePos.left < wrappedPostion.wrappedLeft.left
          ? wrappedPostion.wrappedLeft.left - indivElePos.left
          : indivElePos.left - wrappedPostion.wrappedLeft.left;
      $("#" + el.id).css({
        top: indivElePos.diffTop,
        left: indivElePos.diffLeft
      });
      console.log("indivElePos", indivElePos);
      resolve(indivElePos);
    });
  };

  check = idArr => {
    console.log(idArr[0]);
    if (idArr[0].length > 1 && idArr !== "permGroup") {
      var valTemp = idArr[0].map(value => {
        return "#" + $(value).attr("id");
      });
      var valString = valTemp.toString();
      $(valString).wrapAll('<div class="wrapped ele-select ds-selected"></div>');
      valTemp.forEach(element => {
        $(element).draggable("disable");
        this.ds.removeSelectables($(element), true);
      });
      $(".wrapped").draggable({
        cursor: "move"
      });
      var ch = $(".wrapped").children();
      let childArray = [];
      ch.each((i, el) => {
        childArray.push(el);
      });
      var wrappedPostion = {
        totalHeight: 0,
        totalWidth: 0,
        totalDiffLeft: 0,
        totalDiffTop: 0
      };
      var postionArray = childArray.map(element => {
        var obj = {};
        obj.id = $(element).attr("id");
        obj.top = parseFloat(
          $(element)
            .css("top")
            .slice(0, -2)
        );
        obj.left = parseFloat(
          $(element)
            .css("left")
            .slice(0, -2)
        );
        obj.height = $(element).outerHeight();
        obj.width = $(element).outerWidth();
        obj.right = obj.left + obj.width;
        obj.bottom = obj.top + obj.height;
        if (wrappedPostion.totalWidth < $(element).outerWidth()) {
          wrappedPostion.totalWidth = $(element).outerWidth();
        }
        return obj;
      });
      /* var wrappedDetails = {}; */
      postionArray.sort((a, b) => (b.top < a.top ? 1 : -1));
      console.log("postionArray after sorting", postionArray);
      wrappedPostion.wrappedTop = postionArray.hasMin("top");
      wrappedPostion.wrappedLeft = postionArray.hasMin("left");
      wrappedPostion.wrappedRight = postionArray.hasMax("right");
      wrappedPostion.wrappedBottom = postionArray.hasMax("bottom");
      console.log(wrappedPostion);
      $(".wrapped").css({
        top: wrappedPostion.wrappedTop.top,
        left: wrappedPostion.wrappedLeft.left,
        width:
          wrappedPostion.wrappedRight.right - wrappedPostion.wrappedLeft.left,
        height:
          wrappedPostion.wrappedBottom.bottom - wrappedPostion.wrappedTop.top
      });
      postionArray.map(async (el, i) => {
        await this.setElemPosition(el, i, wrappedPostion).then(val => {
          postionArray[i].diffTop = val.diffTop;
          postionArray[i].diffLeft = val.diffLeft;
          if (wrappedPostion.totalDiffLeft < val.diffLeft) {
            wrappedPostion.totalDiffLeft = val.diffLeft;
          }
          console.log("setElemPosition postionArray", postionArray);
          console.log("setElemPosition wrappedPostion", wrappedPostion);
        });
      });
    } else {
      // console.log(idArr)
      if (idArr === "permGroup") {
        var count = 0;
        Array.prototype.slice
          .call(document.querySelectorAll(".wrapped"))
          .forEach(wrapped => {
            Array.prototype.slice
              .call($(".wrapped").children())
              .forEach(wrappedChild => {
                if (
                  $(wrappedChild)
                    .attr("id")
                    .indexOf("perm") > -1
                ) {
                  count++;
                }
              });
          });
        if (count === 0) {
          $(".wrapped").toggleClass("wrapped perm-wrapped");
          var cnt = $(".perm-wrapped");
          cnt.each((i, el) => {
            $(el).attr("id", "perm-select" + i);
          });
          cnt.children().each((i, el) => {
            $(el).removeClass("ele-select");
          });
          /* cnt.css({
            "z-index": 1
          }) */
          Array.prototype.slice
            .call(document.querySelectorAll(".perm-wrapped"))
            .forEach(wrapped => {
              this.ds.addSelectables(wrapped);
              this.ds.removeSelectables(wrapped.children, true);
            });
            //this.ds.clearSelection()
  
        } else {
          alert("Kindly ungroup and then group");
        }
      }
    }
  };
  /* To unnwrap permanent */
  unwrapPer = permID => {
    let val = null;
    if (
      $(permID)
        .attr("class")
        .indexOf("perm") > -1
    ) {
       val = $(permID).attr("id");
    } else {
       val = $(permID)
        .parent()
        .attr("id");
    }
    permID = "";
    var cnt = $("#" + val);

    cnt.children().each((i, el) => {
      var parent = $(el)
        .parent()
        .position();
      var pTop = parent.top;
      var pLeft = parent.left;
      console.log($(el).parent(), parent);
      console.log(pTop, pLeft);
      $(el).css({
        top:
          parseFloat(
            $(el)
              .css("top")
              .slice(0, -2)
          ) + pTop,
        left:
          parseFloat(
            $(el)
              .css("left")
              .slice(0, -2)
          ) + pLeft
      });
      $(el)
        .draggable()
        .draggable("enable");
      $(el).addClass("ele-select");
      this.ds.addSelectables(el);
    });
    cnt.children().unwrap();
  };

  /* working unWrapAll */
  unwrapAll = (val, event) => {
    let /* wrappedTop, wrappedLeft, */ cnt;
    if (val === "perm-ungroup") {
      cnt = $(".perm-wrapped");
    } else {
       cnt = $(".wrapped");
     /* wrappedTop = parseFloat(
        $(".wrapped")
          .css("top")
          .slice(0, -2)
      );
      wrappedLeft = parseFloat(
        $(".wrapped")
          .css("left")
          .slice(0, -2)
      ); */
      // console.log(wrappedTop, wrappedLeft)
    }
    cnt.children().each((i, el) => {
      var parent = $(el)
        .parent()
        .position();
      var pTop = parent.top;
      var pLeft = parent.left;
      $(el).css({
        top:
          parseFloat(
            $(el)
              .css("top")
              .slice(0, -2)
          ) + pTop,
        left:
          parseFloat(
            $(el)
              .css("left")
              .slice(0, -2)
          ) + pLeft
      });
      $(el)
        .draggable()
        .draggable("enable");
      $(el).addClass("ele-select");
      this.ds.addSelectables(el);
    });
    cnt.children().unwrap();
  };
  deleteElme = e => {
    if (e.keyCode === 46 || e.type === "click") {
      if (
        $(this.deleteElm)
          .parent()
          .attr("class") !== "main-container"
      ) {
        $(this.deleteElm)
          .parent()
          .remove();
      } else {
        $(this.deleteElm).remove();
      }
      this.positionElement = "";
    }
  };

  duplicateElement = (copyArr) => {
    let ele = [...document.getElementsByClassName('ds-selected')]
    if(ele.length > 0){
      let cln = ele[0].cloneNode(true);
      let orgEleId = (ele[0].getAttribute('id'));
      ele[0].parentNode.insertBefore(cln, ele[0].nextSibling);
      if(orgEleId !== null){
        this.uuidv4().then(val => {        
          cln.setAttribute('id', 'cloned-'+ orgEleId  + val)
          if(orgEleId.indexOf('perm') > -1){
          let perm_child = [...cln.childNodes]
            perm_child.forEach((el,i) => {
              let orgId = el.getAttribute('id')
              this.uuidv4().then(val => {    
                el.setAttribute('id', 'cloned-'+ orgId  + val)
              })
            })
          }
          cln.classList.add('cloned-'+ val);
          $(cln).draggable({
            cursor: "move"
          });
          this.ds.addSelectables(document.getElementsByClassName("ele-select"));

          ele[0].classList.remove("ds-selected");
          
      })  
    }
      else{
        this.uuidv4().then(val => {        
          cln.setAttribute('id', 'cloned-'+ 'wrapped'  + val)
          cln.classList.add('cloned-'+ val);
          $(cln).draggable({
            cursor: "move"
          });
      })
         this.ds.addSelectables(document.getElementsByClassName("ele-select"));
         ele[0].classList.remove("ds-selected");
          
         let perm_child = [...cln.childNodes]
         perm_child.forEach((el,i) => {
           let orgId = el.getAttribute('id')
           this.uuidv4().then(val => {    
             el.setAttribute('id', 'cloned-'+ orgId  + val)
           })
         })
    }  
    }
  }

  uuidv4 = () => {
    var store = "";
    return new Promise((resolve, reject) => {
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        store = store.concat(v.toString(16));
      });
      resolve(store);
    });
  };

  clickHandler = (val, event) => {
    // console.log(val);
    if (val.value === "Add Element") {
      this.addElement();
    }
    if (val.value === "Group") {
      this.check("permGroup");
    }
    if (val.value === "UngroupAll") {
      this.unwrapAll("perm-ungroup");
    }
    if (val.value === "Delete") {
      this.deleteElme(event);
    }
    if (val.value === "Ungroup") {
      console.log(this.deleteElm);
      if (
        $(this.deleteElm)
          .parent()
          .attr("class")
          .indexOf("perm") > -1 ||
        $(this.deleteElm)
          .attr("class")
          .indexOf("perm") > -1
      ) {
        this.unwrapPer(this.deleteElm);
      }
    }
    if (val.value === "Copy") {
      // console.log(this.copyArr);
      
      this.duplicateElement(this.copyArr);
      this.copyArr = [];
    }
    if (val.value === "Adjust") {
      let image = {...this.state.image}
      image.element = $(this.deleteElm).children();
      // image.src = $(this.deleteElm).children()[0].currentSrc
      this.setState(
        { 
          adjust: true, 
          image: image
        }
      );
    }
  };
  canvasToimg = (e) => {
    if(this.state.image.element !== null){
     let canvass = $('canvas');
     let dataURL= canvass[0].toDataURL();
      let img = document.createElement('IMG')
      img.id = $(this.state.image.element).attr('id');
      $(img).addClass($(this.state.image.element).attr('class'));
      img.src = dataURL
      $(canvass).parent().append(img)
       $(canvass).remove();
       let image = {...this.state.image}
      image.element = null;
      image.src = null
      this.setState({
        image: image
      })
    }
  }
  imgTocanvas = (element) => {
  let pHeight = $(element).get(0).offsetHeight
  let pWidth = $(element).get(0).offsetWidth
 let image = $(element).children();
let currentSrc = image[0].currentSrc
 let imgId = null;
 if(image[0].nodeName === "IMG"){
  imgId = "#" + image.attr("id");
  let canvas = document.createElement("canvas");
  this.uuidv4().then( (val) => {
    canvas.id = "canvas" + val;
    let p = $(imgId).parent();
    p.append($(canvas));
    $('#' + canvas.id).addClass('flippable-ele');
    /* $('#' + canvas.id).css({
      height: pHeight,
      width: pWidth
    }); */
    $(imgId).remove();
    let ctx = canvas.getContext('2d');
    ctx.canvas.height = pHeight;
    ctx.canvas.width = pWidth
    let img = new Image();
    img.crossOrigin = '';
    img.src = currentSrc;
    
    
    /* img.height = '100%';
    img.width = '100%';
    let height = $('#' + canvas.id).height()
    let width = $('#' + canvas.id).width()
    console.log(height, width); */
    
    img.onload = function() {
      ctx.drawImage(img, 0,0,pWidth,pHeight); 
  }
  let canvasImg = {...this.state.image}
  canvasImg.canvaselement =  $('#' + canvas.id);
  this.setState({ image: canvasImg });
  
  })
  
 }
 
}
  
  dropdownClickHandler = (event, val) => {
    // console.log(event.target.value, val);
    // console.log(this.positionElement);
    if (this.positionElement) {
      if (event.target.value === "Backwards" || val === "Backwards") {
        $(this.positionElement).insertBefore($(this.positionElement).prev());
      }
      if (event.target.value === "Forwards" || val === "Forwards") {
        $(this.positionElement).insertAfter($(this.positionElement).next());
      }
      if (event.target.value === "To Back" || val === "To Back") {
        if (
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("wrapped") <= -1 &&
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("perm") <= -1
        ) {
          $(this.positionElement).insertBefore(
            $(this.positionElement).parent()[0].firstChild
          );
        }
      }
      if (event.target.value === "To Front" || val === "To Front") {
        if (
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("wrapped") <= -1 &&
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("perm") <= -1
        ) {
          $(this.positionElement).insertAfter(
            $(this.positionElement).parent()[0].lastChild
          );
        }
      }
      if (event.target.value === "Top") {
        let parentPostion
          /* childPosition = {}; */
        if (
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("wrapped") > -1 &&
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("perm-wrapped") <= -1
        ) {
          parentPostion = {
            parent: $(this.positionElement).parent()
          };
          $(parentPostion.parent)
            .children()
            .each((i, val) => {
              $(val).css({
                top: 0
              });
            });
          this.unwrapAll();
          this.check(this.copyArr);
        } else {
          $(this.positionElement).css({
            top: 0
          });
        }
      }
      if (event.target.value === "Left") {
        let parentPostion
          /* childPosition = {}; */
        if (
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("wrapped") > -1 &&
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("perm-wrapped") <= -1
        ) {
          parentPostion = {
            parent: $(this.positionElement).parent()
          };
          $(parentPostion.parent)
            .children()
            .each((i, val) => {
              $(val).css({
                left: 0
              });
            });
          this.unwrapAll();
          this.check(this.copyArr);
        } else {
          $(this.positionElement).css({
            left: 0
          });
        }
      }
      if (event.target.value === "Bottom") {
        let parentPostion,
          childPosition = {};
        parentPostion = {
          parent: $(this.positionElement).parent(),
          height: $(this.positionElement)
            .parent()
            .outerHeight()
        };
        if (
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("wrapped") > -1 &&
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("perm-wrapped") <= -1
        ) {
          $(parentPostion.parent)
            .children()
            .each((i, val) => {
              childPosition = {
                height: $(val).outerHeight()
              };
              $(val).css({
                top: parentPostion.height - childPosition.height
              });
            });
          this.unwrapAll();
          this.check(this.copyArr);
        } else {
          childPosition = {
            height: $(this.positionElement).outerHeight()
          };
          $(this.positionElement).css({
            top: parentPostion.height - childPosition.height
          });
        }
      }
      if (event.target.value === "Right") {
        let parentPostion,
          childPosition = {};
        parentPostion = {
          parent: $(this.positionElement).parent(),
          width: $(this.positionElement)
            .parent()
            .outerWidth()
        };
        if (
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("wrapped") > -1 &&
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("perm-wrapped") <= -1
        ) {
          $(parentPostion.parent)
            .children()
            .each((i, val) => {
              childPosition = {
                width: $(val).outerWidth()
              };
              $(val).css({
                left: parentPostion.width - childPosition.width
              });
            });
          this.unwrapAll();
          this.check(this.copyArr);
        } else {
          childPosition = {
            width: $(this.positionElement).outerWidth()
          };
          $(this.positionElement).css({
            left: parentPostion.width - childPosition.width
          });
        }
      }
      if (event.target.value === "Centre") {
        let parentPostion,
          childPosition = {};
        parentPostion = {
          parent: $(this.positionElement).parent(),
          width:
            $(this.positionElement)
              .parent()
              .outerWidth() / 2
        };
        if (
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("wrapped") > -1 &&
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("perm-wrapped") <= -1
        ) {
          $(parentPostion.parent)
            .children()
            .each((i, val) => {
              childPosition = {
                width: $(val).outerWidth() / 2
              };
              $(val).css({
                left: parentPostion.width - childPosition.width
              });
            });
          this.unwrapAll();
          this.check(this.copyArr);
        } else {
          childPosition = {
            width: $(this.positionElement).outerWidth() / 2
          };
          $(this.positionElement).css({
            left: parentPostion.width - childPosition.width
          });
        }
      }
      if (event.target.value === "Middle") {
        let parentPostion,
          childPosition = {};
        parentPostion = {
          parent: $(this.positionElement).parent(),
          height:
            $(this.positionElement)
              .parent()
              .outerHeight() / 2
        };
        if (
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("wrapped") > -1 &&
          $(this.positionElement)
            .parent()
            .attr("class")
            .indexOf("perm-wrapped") <= -1
        ) {
          $(parentPostion.parent)
            .children()
            .each((i, val) => {
              childPosition = {
                height: $(val).outerHeight() / 2
              };
              $(val).css({
                top: parentPostion.height - childPosition.height
              });
            });
          this.unwrapAll();
          this.check(this.copyArr);
        } else {
          childPosition = {
            height: $(this.positionElement).outerHeight() / 2
          };
          $(this.positionElement).css({
            top: parentPostion.height - childPosition.height
          });
        }
      }
      if (
        event.target.value === "Horizontal" ||
        event.target.value === "Vertical"
      ) {
        let numberPattern = /[-+]?\d+\.?[-+]?\d+|[-+]?\d+/g;
        let transformMatrixArr = $(this.positionElement)
          .css("transform")
          .match(numberPattern);
        if (transformMatrixArr !== null) {
          transformMatrixArr = transformMatrixArr.filter((element, i) => {
            if (i === 0 || i === 3) {
              return element;
            }
          });

          this.flipElement(transformMatrixArr, event.target.value);
        }
      }
    }
  };
  /* function to flip element */
  flipElement = (transformMatrixArr, flipTye) => {
    let f = -1,
      x,
      y;
    if (flipTye === "Horizontal") {
      transformMatrixArr.map((el, i) => {
        // console.log(i);
        if (i === 0) {
          x = el * f;
        } else {
          y = parseFloat(el);
        }
      });
    } else {
      transformMatrixArr.map((el, i) => {
        // console.log(i);
        if (i === 1) {
          y = el * f;
        } else {
          x = parseFloat(el);
        }
      });
    }
    $(this.positionElement).css({
      transform: "scale(" + x + "," + y + ")"
      /*   transition:"scaleAnimate 0.8s ease-in-out .8s" */
    });
  };
  slidderChangeHandler = event => {
    let slidder = { ...this.state.slidder };
    slidder.range = event.target.value;
    this.setState(
      {
        slidder: slidder
      },
      () => {
        $(this.state.slidder.selected).css({
          opacity: this.state.slidder.range / 100
        });
      }
    );
  };
  
  
  render() {
    var button = this.state.btn.map((element, i) => {
      return (
        <Button
          value={element}
          clicked={event => this.clickHandler(element, event)}
          key={i + element}
        />
      );
    });

    // For displaying selected Element
    /* var SelectedEle = this.state.slidder.selected ? <SelectedElement selected={this.state.slidder.selected} /> : null */

    return (
      <React.Fragment>
        {button}
        <Dropdown
          dropdown={this.state.dropdown}
          dropdownClick={this.dropdownClickHandler}
        />
        <Dropdown
          dropdown={this.state.flip}
          dropdownClick={this.dropdownClickHandler}
        />
        {this.state.slidder.selected.length > 0 ? (
          <Slider
            SliderRange={this.state.slidder}
            draggged={event => this.slidderChangeHandler(event)}
            min="0" max="100" step="1" slidertype="Tranparency"
          />
        ) : null}
     {/*    {SelectedEle} */}
        {this.state.adjust ? <Adjust selected={this.state.image} canvas={this.canvas} /> : null}
        <div id="canvas">
          <div className="main-container">
            <div className="text ele-select" id="text1" draggable="true">
              Some text
            </div>
            <div className="text ele-select" id="text2" draggable="true">
              Another text
            </div>
            <div className="text ele-select flippable" id="text3">
              {/*  <canvas id="canvas1" className="flippable-ele"></canvas> */}
              <img
                id="img-01"
                className="flippable-ele"
                src="assets/imgage1.jpeg"
                alt="Italian Trulli"
                width="70px"
                height="70px"
              />
            </div>
            <div className="text ele-select flippable" id="text4">
              {/*  <canvas id="canvas1" className="flippable-ele"></canvas> */}
              <img
                id="img-02"
                className="flippable-ele"
                src="assets/imgage2.jpeg"
                alt="Italian Trulli"
                width="70px"
                height="70px"
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default App;
