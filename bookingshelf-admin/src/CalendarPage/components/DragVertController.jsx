import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { appointmentActions, calendarActions } from '../../_actions';
import { isAvailableTime } from '../../_helpers/available-time';
import moment from 'moment';
import CheckModal from '../../_components/modals/CheckModal';

class DragVertController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientSubmitModal: false,
    }
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  componentDidUpdate() {
    if (this.props.changingVisit && !this.state.clientSubmitModal) {
      document.addEventListener('mousemove', this.handleMouseMove, false);
      document.addEventListener('mouseup', this.handleMouseUp, false);
    } else {
      document.removeEventListener('mousemove', this.handleMouseMove, false);
      document.removeEventListener('mouseup', this.handleMouseUp, false);
    }
  }

  handleMouseMove(e) {
    const {
      cellHeight, step, changingPos, offsetHeight, minTextAreaHeight, maxTextAreaHeight, textAreaId
    } = this.props;
    const node = document.getElementById(textAreaId);
    const appointmentId = textAreaId.split('-')[0];
    const serviceTimeNode = document.getElementById(`${appointmentId}-service-time`);

    // 'res' = начальная высота div'a + кол-во пикселов смещения
    const res = offsetHeight + e.pageY - changingPos;
    if (res > minTextAreaHeight && res <= maxTextAreaHeight) {
      node.style.height = res + 'px';
      // currentTarget.style.bottom = -(res - 2) + 'px';

      const [firstTime] = serviceTimeNode.innerHTML.split('-');
      const resultSecondTime = Math.ceil((res + 10) / cellHeight);
      const firstTimeMoment = moment(firstTime, 'HH:mm');

      for (let i = 0; i < resultSecondTime; i++) {
        firstTimeMoment.add(step, 'minutes');
      }

      const updatedSecondTime = firstTimeMoment.format('HH:mm');

      serviceTimeNode.innerHTML = `${firstTime}- ${updatedSecondTime}`;
    }
  }

  handleMouseUp({ makeMouseUpUpdating }) {
    const {
      appointments, cellHeight, staff, reservedTime, timetable, changingVisit, offsetHeight, textAreaId, step, booktimeStep, existingAppointmentIgnored,
    } = this.props;
    const { clientSubmitModal } = this.state;
    const newOffsetHeight = document.getElementById(textAreaId).offsetHeight;
    const offsetDifference = Math.round((newOffsetHeight - offsetHeight) / cellHeight);

    let newDuration = (step * 60 * offsetDifference);


    let currentTotalDuration = changingVisit.duration;
    if (changingVisit.hasCoAppointments) {
      appointments.map((staffAppointment) => {
        staffAppointment.appointments.forEach((appointment) => {
          if (appointment.coAppointmentId === changingVisit.appointmentId) {
            currentTotalDuration += appointment.duration;
          }
        });
      });
    }

    const startTime = changingVisit.appointmentTimeMillis;
    const endTime = changingVisit.appointmentTimeMillis + ((currentTotalDuration + newDuration) * 1000);

    const staffWithTimetable = timetable && timetable.find((item) => item.staffId === changingVisit.staffId);

    const isOwnInterval = (i) => changingVisit.appointmentTimeMillis <= i &&
      (changingVisit.appointmentTimeMillis + (currentTotalDuration * 1000)) > i;

    const shouldDrag = isAvailableTime(
      startTime, endTime, staffWithTimetable,
      appointments,
      reservedTime, staff, isOwnInterval, existingAppointmentIgnored
    );
    if (!shouldDrag && !clientSubmitModal) {
        if (existingAppointmentIgnored) {
          this.setState({ clientSubmitModal: true })
        }
    } else if (shouldDrag || makeMouseUpUpdating) {
      this.setState({ clientSubmitModal: false })
      if (changingVisit.hasCoAppointments) {
        const coAppointments = [];
        appointments.map((staffAppointment) => {
          staffAppointment.appointments.sort((b, a) => a.appointmentId - b.appointmentId).forEach((appointment) => {
            if (appointment.coAppointmentId === changingVisit.appointmentId) {
              coAppointments.push(appointment);
            }
          });
        });
        coAppointments.push(changingVisit);

        let shouldUpdateDuration = true;
        if (newDuration > 0) {
          this.props.dispatch(calendarActions.updateAppointment(
            changingVisit.appointmentId,
            JSON.stringify({ duration: changingVisit.duration + newDuration }),
            false,
            true,
          ));
        } else {
          let timeout = 0;
          coAppointments.forEach((coAppointment) => {
            if (shouldUpdateDuration) {
              newDuration = coAppointment.duration + newDuration;
              if (newDuration > booktimeStep) {
                shouldUpdateDuration = false;
                setTimeout(() => {
                  this.props.dispatch(calendarActions.updateAppointment(
                    coAppointment.appointmentId,
                    JSON.stringify({ duration: newDuration }),
                    false,
                    true,
                  ));
                }, 1000 * timeout);
              } else {
                newDuration-=booktimeStep;

                setTimeout(() => {
                  this.props.dispatch(calendarActions.updateAppointment(
                    coAppointment.appointmentId,
                    JSON.stringify({ duration: booktimeStep }),
                    false,
                    true,
                  ));
                }, 1000 * timeout);
                timeout++;
              }
            }
          });
        }
      } else {
        this.props.dispatch(calendarActions.updateAppointment(
          changingVisit.appointmentId,
          JSON.stringify({ duration: changingVisit.duration + newDuration }),
          false,
          true,
        ));
      }

      this.props.dispatch(appointmentActions.togglePayload({
        changingVisit: null,
        currentTarget: null,
        changingPos: null,
        offsetHeight: null,
        minTextAreaHeight: null,
        maxTextAreaHeight: null,
        textAreaId: null,
      }));
    }
  }

  render() {
    const { clientSubmitModal } = this.state
    return (
      clientSubmitModal && ReactDOM.createPortal(
        <div className="check-client-submit-container">
          <CheckModal
            closeHandler={() => this.setState({ clientSubmitModal: false })}
            submitHandler={() => this.handleMouseUp({ makeMouseUpUpdating: true })}
            // buttons={[
            //   {
            //     handler: this.addAppointment,
            //     params: this.props,
            //     innerText: "Подтвердить",
            //     className: "button",
            //     additionalHandler: () => this.setState({ clientSubmitModal: false }),
            //   },
            //   {
            //     handler: () => this.setState({ clientSubmitModal: false }),
            //     innerText: t("Отмена"),
            //     className: "gray-button",
            //   },
            // ]}
          />
          <div onClick={() => this.setState({ clientSubmitModal: false })}>
            <div className="check-submit-mask" />
          </div>
        </div>,
        document.getElementById('modal-root')
      )
    );
  }
}

function mapStateToProps(state) {
  const {
    calendar: { appointments, reservedTime },
    staff: { timetable, staff },
    appointment: {
      changingVisit, currentTarget, changingPos, offsetHeight, minTextAreaHeight, maxTextAreaHeight, textAreaId,
    },
  } = state;

  return {
    appointments, reservedTime, timetable, staff, changingVisit, currentTarget, changingPos, offsetHeight,
    minTextAreaHeight, maxTextAreaHeight, textAreaId,
  };
}

export default connect(mapStateToProps)(DragVertController);
