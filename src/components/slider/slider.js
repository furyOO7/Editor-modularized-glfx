import React from 'react';
import './slider.css'

const slider = (props) => {
  return (
    <div className="slidecontainer">
      <span className="trans">{props.slidertype}</span>
      <input type="range" min={props.min} max={props.max} step={props.step} value={props.SliderRange.range} className="slider" id={props.SliderRange.name} 
      onChange={(event) => props.draggged(event, props.SliderRange)}
      // onMouseUp = {props.mouseLeft}
      onClick={(event) => props.draggged(event, props.SliderRange)}
      />
      <span>{props.SliderRange.range}</span>
    </div>

    );
}
 
export default slider;