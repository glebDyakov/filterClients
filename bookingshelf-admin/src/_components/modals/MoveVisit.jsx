import React from 'react';
import { connect } from 'react-redux';
import { appointmentActions } from '../../_actions/appointment.actions';
import {withTranslation} from "react-i18next";

class MoveVisit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
    this.checkForWarning = this.checkForWarning.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.movingVisit && (newProps.staffKey !== null && newProps.staffKey > -1)) {
      this.checkForWarning(newProps);
    }
  }

  checkForWarning(props) {
    const { appointments, servicesList, movingVisit, getByStaffKey, staffKey, prevVisitStaffId } = props;
    const staffWithAppointments = appointments && appointments.find((item) => item.staff.staffId === prevVisitStaffId);
    const allVisits = [movingVisit];
    if (staffWithAppointments) {
      staffWithAppointments.appointments && staffWithAppointments.appointments.forEach((item) => {
        if (item.coAppointmentId === movingVisit.appointmentId) {
          allVisits.push(item);
        }
      });
    }

    const newStaffId = getByStaffKey(staffKey);
    const isExtraText = allVisits.some((appointment) => {
      const activeService = servicesList && servicesList.find((serviceListItem) => serviceListItem.serviceId === appointment.serviceId);
      return activeService.staffs.every((staff) => staff.staffId !== newStaffId);
    });

    this.setState({ isExtraText });
  }

  render() {
    const { isExtraText } = this.state;
    const { t } = this.props;
    return (
      <div className="modal fade move-visit-modal">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">{t("Перенести выбранный визит?")}</h4>
              <button type="button" className="close" onClick={this.handleNo} data-dismiss="modal" />
            </div>
            <div className="modal-body">
              <div className="extra-text">
                {isExtraText ? t('Данный сотрудник не оказывает услугу или одну из выбранных услуг, вы уверены что хотите перенести визит?') : ''}
              </div>
              <div className="form-group mr-3 ml-3">
                <button type="button" className="button" onClick={this.handleYes} data-dismiss="modal">{t("Перенести")}</button>
                <button type="button" className="gray-button" onClick={this.handleNo} data-dismiss="modal">{t("Отмена")}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  handleYes() {
    const {
      moveVisit,
      movingVisit,
      movingVisitDuration,
      prevVisitStaffId,
      staffKey,
      selectedDaysKey,
      time,
    } = this.props;

    moveVisit({
      movingVisit,
      movingVisitDuration,
      prevVisitStaffId,
      staffKey,
      selectedDaysKey,
      time,
    });
  }

  handleNo() {
    this.props.dispatch(appointmentActions.togglePayload({ movingVisit: null, movingVisitDuration: null, prevVisitStaffId: null, draggingAppointmentId: null, isStartMovingVisit: false }));
  }
}

function mapStateToProps(state) {
  const {
    calendar: { appointments },
    services: { servicesList },
    appointment: {
      movingVisit,
      movingVisitDuration,
      prevVisitStaffId,
      staffKey,
      selectedDaysKey,
      time,
    },
  } = state;

  return {
    appointments,
    servicesList,
    movingVisit,
    movingVisitDuration,
    prevVisitStaffId,
    staffKey,
    selectedDaysKey,
    time,
  };
}

const connectedApp = connect(mapStateToProps)(withTranslation("common")(MoveVisit));
export { connectedApp as MoveVisit };
