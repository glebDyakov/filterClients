  
import React, {Component} from 'react';
class Loading extends Component{
 
  render(){
    return(
      <div className="loader" >
        <div className="l_main">
          <div className="l_square"><span></span><span></span><span></span></div>
          <div className="l_square"><span></span><span></span><span></span></div>
          <div className="l_square"><span></span><span></span><span></span></div>
          <div className="l_square"><span></span><span></span><span></span></div>
        </div>
      </div>
    )
  }
}
export default Loading;