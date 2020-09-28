import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { modalsActions } from '../../_actions/modals.actions';
import {withTranslation} from "react-i18next";

const CellReservedTime = (props) => {
  const { cell: reservedTime, workingStaffElement, dispatch, step, cellHeight, t } = props;
  const textAreaHeight = (parseInt(((
    moment.utc(reservedTime.endTimeMillis - reservedTime.startTimeMillis, 'x').format('x')
    / 60000 / step) - 1) * cellHeight));

  return (
    <div className='cell reserve'>
      <div className="cell notes color-grey"
        style={{ backgroundColor: 'darkgrey' }}>

        <p className={`notes-title ${textAreaHeight === 0 ? 'notes-title-bordered' : ''}`} style={{ cursor: 'default' }}>
          <span className="delete"
            style={{ right: '5px' }}
            data-toggle="modal"
            data-target=".delete-reserve-modal"
            title={t("Удалить")}
            onClick={() =>
              dispatch(modalsActions.togglePayload({
                reservedTimeId: reservedTime.reservedTimeId,
                reservedTimeStaffId: workingStaffElement.staffId,
              }),
              )}
          />
          <span className="" title={t("Онлайн-запись")}/>
          <span
            className="service_time"
          >
            {moment(reservedTime.startTimeMillis, 'x').format('HH:mm')} - {moment(reservedTime.endTimeMillis, 'x').format('HH:mm')}
          </span>

        </p>
        <p className="notes-container" style={{ background: "#b0b3b9", height: textAreaHeight+ 'px' }}>
          <span style={{ color: '#5d5d5d', fontSize: '10px' }}>{reservedTime.description}</span>
        </p>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  const {
    company,
  } = state;

  return {
    company,
  };
}

export default connect(mapStateToProps)(withTranslation("common")(CellReservedTime));
