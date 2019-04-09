import React, { Component } from "react";
import "./Adjust.css";
import Slider from "../slider/slider";
import $ from "jquery";



class Adjust extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props);
    this.applyFilter = this.applyFilter.bind(window)
    this.currentId = this.props.selected.element[0].id
    this.texture =  this.props.canvas.texture(this.props.selected.element[0]);
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
        }
      ],
      changedElement: null,
    };
  }

componentDidMount() {
 if(this.props.selected.element[0].getAttribute('data-adjust')){
   let data_adjust = JSON.parse(this.props.selected.element[0].getAttribute('data-adjust'));
   let adjust = [...this.state.adjust]
 let newArray  = adjust.map(el => {
    for(let i in data_adjust){
     if(data_adjust[i].name === el.name){
      data_adjust[i].functionName = el.functionName
      return data_adjust[i]
     }
    }
})
this.setState({
  adjust: newArray
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

applyFilter = (element) => {
  let adjust = [...this.state.adjust];
  let x = this.props.canvas.draw(this.texture);
  let ajustObj = [];
  let currentItem=document.querySelector("#"+this.currentId)
  adjust.forEach((el) => {
    if(el.name !== 'triangleBlur'){
      x[el.functionName](parseFloat(el.range)/100, 0).update();  
      let objAdj = {};
      objAdj.name = el.name;
      objAdj.range = el.range;
      ajustObj.push(objAdj)  
     }
     else{
         x[el.functionName](parseFloat(el.range), 0).update();
         let objAdj = {};
      objAdj.name = el.name;
      objAdj.range = el.range;
      ajustObj.push(objAdj);
     }
  
  });
  let imgID = this.props.selected.element[0].getAttribute('id');
  if(document.getElementById(imgID) !== null && document.getElementById(imgID).tagName === 'IMG'){
    let getClass =  this.props.selected.element[0].getAttribute('class');
    let getId =  this.props.selected.element[0].getAttribute('id');
    this.props.selected.element[0].parentElement.appendChild(this.props.canvas);
    this.props.canvas.classList.add(getClass);
    this.props.canvas.setAttribute('id',getId)
    this.props.selected.element[0].remove(); 
  }
  currentItem.setAttribute("data-adjust",JSON.stringify({...ajustObj}))
}

resetHandler = () => {
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
