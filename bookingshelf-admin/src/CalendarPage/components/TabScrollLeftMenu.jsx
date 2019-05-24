import React, {PureComponent} from 'react';

import moment from 'moment';

class TabScrollLeftMenu extends PureComponent {

    shouldComponentUpdate() {
        return false;
    }

    render(){
        const { time } = this.props;

        return(
            <div className="expired ">
                {moment(time, "x").format('mm') === '00' ?
                    <div className={"hours" + " "}>
                        <span>{moment(time, "x").format('HH:mm')}</span></div>
                    : <div className="hours minutes">
                        <span>{moment(time, "x").format('HH:mm')}</span></div>
                }
            </div>
        );
    }
}
export default TabScrollLeftMenu;