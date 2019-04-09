import React from 'react';
import './SelectedElement.css'

const SelectedElement = (props) => {
    let SelectedEle = props.selected.map((el, i) => {
        let id = el.getAttribute('id');
       let textindex = id.indexOf('text');
       if(textindex > -1){
        id = id.slice(textindex, textindex+7)
       }
       else{
        textindex = id.indexOf('perm');
        if(textindex > -1){
            id = id.slice(textindex, textindex+7)
        }
       }
        
        return (
            <p>{id}</p>
        )
    }) 
    return ( 
        <div className="selectedEle-main">
           {SelectedEle}
        </div>
     );
}
 
export default SelectedElement;