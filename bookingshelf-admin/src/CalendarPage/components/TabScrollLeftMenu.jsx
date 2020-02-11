import React, {PureComponent} from 'react';

import moment from 'moment';

class TabScrollLeftMenu extends PureComponent {
    render(){
        const { time } = this.props;

        return(
            <div className="cell expired">
                {moment(time, "x").format('mm') === '00' ?
                    <div className={"cell hours" + " "}>
                        <span>{moment(time, "x").format('HH:mm')}</span></div>
                    : <div className="cell hours minutes">
                        <span>{moment(time, "x").format('HH:mm')}</span></div>
                }
            </div>
        );
    }
}
export default TabScrollLeftMenu;