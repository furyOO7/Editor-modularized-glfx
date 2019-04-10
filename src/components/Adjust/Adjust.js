import React, { Component } from "react";
import "./Adjust.css";
import Slider from "../slider/slider";
import $ from "jquery";
import { resolve } from "dns";
import { reject } from "q";



class Adjust extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    // this.applyFilter = this.applyFilter.bind(window)
    
    this.state = {
      adjust: [
        {
          name: "brightness",
          range: 0,
          functionName: "brightnessContrast"
        },
        {
          name: "contrast",
          range: 0,
          functionName: "brightnessContrast"
        },
        {
          name: "hue",
          range: 0,
          functionName: "hueSaturation"
        },
        {
          name: "saturation",
          range: 0,
          functionName: "hueSaturation"
        },
        {
          name: "vibrance",
          range: 0,
          functionName: "vibrance"
        },
        {
          name: "noise",
          range: 0,
          functionName: "noise"
        },
        {
          name: "sepia",
          range: 0,
          functionName: "sepia"
        },
        {
          name: "triangleBlur",
          range: 0,
          functionName: "triangleBlur"
        },
        {
          name: "ink",
          range: 0,
          functionName: "ink"
        }
      ],
      changedElement: null,
    };
    this.loopCanvasElement =  null;
    this.currentId = this.props.selected.element[0].id;
     if (this.props.selected.element[0].tagName === 'IMG') {
      this.texture = this.props.canvas.texture(this.props.selected.element[0]);
    } 
    if (this.props.selected.element[0].tagName === 'CANVAS') {
      this.props.selected.allImageElement.forEach(el => {
        if(el.getAttribute('id') === this.props.selected.element[0].getAttribute('id')){
          this.loopCanvasElement = el;
          this.texture = this.props.canvas.texture(el);
        }
      })
      
    }
  }

componentDidMount() {
 if(this.props.selected.element[0].getAttribute('data-adjust')){
   let data_adjust = JSON.parse(this.props.selected.element[0].getAttribute('data-adjust'));
   let adjust = [...this.state.adjust]
 let newArray  =  [];
 adjust.map(el => {
    for(let i in data_adjust){
     if(data_adjust[i].name === el.name){
      data_adjust[i].functionName = el.functionName
      newArray.push(data_adjust[i])
     }
    }
})
this.setState({
  adjust: newArray
}, () => { 
  this.props.selected.element[0].parentElement.appendChild(this.loopCanvasElement);
  this.props.selected.element[0].remove();
  this.applyFilter()
})
 }

}


  slidderChangeHandler = (event, element) => {
    // event.persist();
    let temp = element;
    let adjust = [...this.state.adjust];
    adjust.map(el => {
      if (el.name === element.name) {
        el.range = event.target.value;
      }
    });
    adjust =  [...this.state.adjust]
    this.setState({ adjust: adjust, changedElement: element }, () => {
     this.applyFilter(temp);
     
    });
};

/* Applying filter on image */
applyFilter = (element) => {
  let adjust = [...this.state.adjust];
  let x = this.props.canvas.draw(this.texture);
  let ajustObj = [];
  
  adjust.forEach((el) => {
    let objAdj = {};
    if(el.name !== 'triangleBlur'){
      x[el.functionName](parseFloat(el.range)/100, 0).update();  
      objAdj.name = el.name;
      objAdj.range = el.range;
      ajustObj.push(objAdj)  
     }
     else{
      x[el.functionName](parseFloat(el.range), 0).update();
      objAdj.name = el.name;
      objAdj.range = el.range;
      ajustObj.push(objAdj);
     }  
  });
 
  let imgID = this.props.selected.element[0].getAttribute('id');
if(document.getElementById(imgID) !== null && document.getElementById(imgID).tagName === 'IMG'){
   this.appendCanvas(this.props.selected.element[0]).then(val => {
    if(val === 'Appended'){
      console.log(this.currentId);
      
      let currentItem=document.querySelector("#"+this.currentId)
      currentItem.setAttribute("data-adjust",JSON.stringify({...ajustObj}))
    }
  })
}
if(document.getElementById(imgID).tagName === 'CANVAS'){
      let currentItem=document.querySelector("#"+this.currentId)      
      currentItem.setAttribute("data-adjust",JSON.stringify({...ajustObj}))
}
if(this.loopCanvasElement){
  this.appendCanvas(this.loopCanvasElement).then(val => {
   if(val === 'Appended'){
     let currentItem=document.querySelector("#"+this.currentId)
     currentItem.setAttribute("data-adjust",JSON.stringify({...ajustObj}))
   }
 })
}
}

appendCanvas = (element)=>{  
  return new Promise((resolve, reject) => {
    let getClass = element.getAttribute('class');
    let getId =  element.getAttribute('id');
    document.getElementById(getId).parentElement.appendChild(this.props.canvas);
    this.props.canvas.classList.add(getClass);
    this.props.canvas.setAttribute('id',getId)
    element.remove(); 
    resolve("Appended")
  })
  
 
}

/* resetHandler = () => {
  let image = this.props.selected.canvaselement
  let  imgId = '#' + image.attr('id');
  let adjust = [...this.state.adjust];
    console.log(adjust)
    adjust.map(el => {
        el.range = 0
    });
    this.setState({
      adjust: adjust
    },() => {
      window.caman(imgId, function() { 
        this.reset()
      })
    })
  
} */


resetHandler = () => {
  let adjust = [...this.state.adjust]
  const shouldResetWork = adjust.every(el => el.range === 0  )
   adjust = [...this.state.adjust];
    adjust.forEach(el => {
      if(el.range !== 0){
        el.range = 0
      }
    })
if(this.props.selected.element[0].tagName === 'CANVAS'){
  this.setState({ adjust: adjust }, () => {
    this.applyFilter();
  });
}
else{
  if(!shouldResetWork){
    this.texture = this.props.canvas.texture(this.props.selected.element[0]);
    let x = this.props.canvas.draw(this.texture);
    this.setState({ adjust: adjust }, () => {
      this.applyFilter();
    });
  }else{
    alert("There is nothing to reset")
  }
}

 /*  let image = this.props.selected.canvaselement
  let  imgId = '#' + image.attr('id');
  let adjust = [...this.state.adjust];
    console.log(adjust)
    adjust.map(el => {
        el.range = 0
    });
    this.setState({
      adjust: adjust
    },() => {
      window.caman(imgId, function() { 
        this.reset()
      })
    })
   */
} 

  render() {
    let slider = this.state.adjust.map((element, i) => {
      if(element.name === 'brightness' ||  element.name === 'contrast' || element.name === 'saturation' ||  element.name === 'hue' ||  
      element.name === 'vibrance' ||  element.name === 'exposure'){
        return (
          <Slider
            SliderRange={element}
            draggged={(event, element) =>
              this.slidderChangeHandler(event, element)
            }
            min="-100" max="100" step='1' slidertype={element.name}
            key={element.name + i}
         
          />
        );
      }else{
        return (
          <Slider
            SliderRange={element}
            draggged={(event, element) =>
              this.slidderChangeHandler(event, element)
            }
            min="0" max="100" step='1' slidertype={element.name}
            key={element.name + i}
          />
        );
      }
    
    });
    return (
      <React.Fragment>
    <div className="adjust-main-container">{slider}</div>
    <button onClick={this.resetHandler}>Reset</button>
    </React.Fragment>
    )
  }
}


export default Adjust;
