import React, {PureComponent} from 'react';

class TabScrollLeftMenu extends PureComponent {
    render(){
        const { time } = this.props;

        return(
            <div className="cell expired">
                {time.split(':')[1] === '00' ?
                    <div className={"cell hours" + " "}>
                        <span>{time}</span></div>
                    : <div className="cell hours minutes">
                        <span>{time}</span></div>
                }
            </div>
        );
    }
}
export default TabScrollLeftMenu;