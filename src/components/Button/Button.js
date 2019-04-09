import React from 'react';
import './Button.css'

const Button = (props) => {
            return(
                <div className="bttn">
                    <input type='button' value={props.value.value} onClick={props.clicked} id={props.value.id}/>
                </div>
            )
}
export default Button;