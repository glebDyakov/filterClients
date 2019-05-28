import React, {PureComponent} from 'react';

import moment from 'moment';

class ReservedCell extends PureComponent {

    render() {
        const {reservedTime, staffId, updateReservedId} = this.props;

        return (
            <div className='reserve'>
            <div className="notes color-grey"
                 style={{backgroundColor: "darkgrey"}}>

                <p className="notes-title"
                   style={{cursor: 'default'}}>
                    <span className=""
                  title="Онлайн-запись"/>
                    <span
                        className="service_time"
                    >{moment(reservedTime.startTimeMillis, 'x').format('HH:mm')}
                        -
                        {moment(reservedTime.endTimeMillis, 'x').format('HH:mm')}</span>

                </p>
                <p className="notes-container"
                   style={{height: (parseInt(((moment.utc(reservedTime.endTimeMillis - reservedTime.startTimeMillis, 'x').format('x') / 60000 / 15) - 1) * 20)) + "px"}}>
                                                                            <textarea
                                                                                style={{color: '#5d5d5d'}}>{reservedTime.description}</textarea>
                    <span className="delete-notes"
                          style={{right: '5px'}}
                          data-toggle="modal"
                          data-target=".delete-reserve-modal"
                          title="Удалить"
                          onClick={() => {
                              updateReservedId(reservedTime.reservedTimeId,staffId);
                          }}
                    />
                </p>
            </div>
        </div>
        );
    }
}
export default ReservedCell;