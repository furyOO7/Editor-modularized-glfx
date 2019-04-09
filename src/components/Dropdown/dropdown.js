import React from 'react';
import  './dropdown.css'

const DropDown = (props) => {
    return ( 
    <div className="dropdown-main-container">
    <select onClick={props.dropdownClick}>
      {props.dropdown.map((element, i) => {
        return <option key={i + element.id}>{element.value}</option>;
      })}
    </select>
  </div> 
  );
}
 
export default DropDown;