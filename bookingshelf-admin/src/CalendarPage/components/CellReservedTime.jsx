import React from 'react';
import { connect } from 'react-redux';
import moment from "moment";
import {modalsActions} from "../../_actions/modals.actions";

const CellReservedTime = (props) => {
    const { cell: reservedTime, workingStaffElement, dispatch } = props;

    const textAreaHeight = (parseInt(((moment.utc(reservedTime.endTimeMillis - reservedTime.startTimeMillis, 'x').format('x') / 60000 / 15) - 1) * 20))

    return (
        <div className='cell reserve'>
            <div className="cell notes color-grey"
                 style={{backgroundColor: "darkgrey"}}>

                <p className="notes-title" style={{cursor: 'default'}}>
                            <span className="delete"
                                  style={{right: '5px'}}
                                  data-toggle="modal"
                                  data-target=".delete-reserve-modal"
                                  title="Удалить"
                                  onClick={() =>
                                      dispatch(modalsActions.togglePayload({
                                          reservedTimeId: reservedTime.reservedTimeId,
                                          reservedTimeStaffId: workingStaffElement.staffId
                                      })
                                  )}
                            />
                    <span className="" title="Онлайн-запись"/>
                    <span
                        className="service_time"
                    >
                                    {moment(reservedTime.startTimeMillis, 'x').format('HH:mm')} - {moment(reservedTime.endTimeMillis, 'x').format('HH:mm')}
                                </span>

                </p>
                <p className="notes-container" style={{height: textAreaHeight+ "px"}}>
                    <span style={{color: '#5d5d5d', fontSize: '10px'}}>{reservedTime.description}</span>
                </p>
            </div>
        </div>
    );
}

export default connect()(CellReservedTime);