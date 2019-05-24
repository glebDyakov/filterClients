import React, {PureComponent} from 'react';
import pure from 'recompose/pure';
import moment from 'moment';

const DefaultCell = ({currentTime,notExpired,workingTimeEnd,clDate,workingStaffElement,numbers,changeTime,time})=> (

            <div
                id={currentTime <= moment().format("x") && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : ''}
                className={`col-tab ${currentTime <= moment().format("x")
                && currentTime >= moment().subtract(15, "minutes").format("x") ? 'present-time ' : ''}
                ${currentTime < parseInt(moment().format("x")) ? '' : ""}
                ${!notExpired && "expired"}
                ${clDate && 'closedDateTick'}`}
                onClick={() => notExpired && changeTime(currentTime, workingStaffElement, numbers, false, null)}
            ><span
                className={moment(time, 'x').format("mm") === "00" && notExpired ? 'visible-fade-time':'fade-time' }>{moment(time, 'x').format("HH:mm")}</span>
            </div>
        );
export default pure(DefaultCell);