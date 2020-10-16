import React from 'react';
import moment from 'moment';

import Popover from '../../../../_components/Popover';
import { withTranslation } from 'react-i18next';
import { access } from '../../../../_helpers/access';

class CellAppointmentHeader extends React.PureComponent {
  componentDidUpdate(prevProps) {
    if (this.props.appointment.appointmentTimeMillis !== prevProps.appointment.appointmentTimeMillis || this.props.totalDuration !== prevProps.totalDuration) {
      document.getElementById(`${this.props.appointment.appointmentId}-service-time`).innerHTML = `${moment(this.props.appointment.appointmentTimeMillis, 'x').format('HH:mm')} - ${moment(this.props.appointment.appointmentTimeMillis, 'x').add(this.props.totalDuration, 'seconds').format('HH:mm')}`;
    }
  }

  isVisitStarted(visitTime) {
    return +moment().format('x') >= visitTime;
  }

  getColorClass() {
    const { appointment } = this.props;
    if (this.isVisitStarted(appointment.appointmentTimeMillis)) {
      if (!appointment.clientNotCome) return 'clientIsCome';
      else if (appointment.clientNotCome) return 'clientNotCome';
    } else {
      if (!appointment.clientNotCome && !appointment.clientConfirmed) return 'waitClient';
      else if (!appointment.clientNotCome && appointment.clientConfirmed) return 'clientConfirmed';
    }
  }

  render() {
    const {
      toggleSelectedNote, appointment, resultTextAreaHeight, totalDuration,
      updateAppointmentForDeleting, workingStaffElement, t,
    } = this.props;


    return (
      <p
        className={`notes-title ${this.getColorClass() + "-background"}${
          appointment.duration <= 900 ? ' notes-title-bordered' : ''
        }`}
        onClick={toggleSelectedNote}
        style={{
          borderRadius: (resultTextAreaHeight === 0 ? '5px' : ''),
        }}
      >
        <span className="notes-buttons-container">
          {appointment.online && <Popover props={{ className: 'globus', title: t('Онлайн-запись') }}/>}

          {!!appointment.discountPercent &&
          <Popover props={{ className: 'percentage', title: `${appointment.discountPercent}%`, minWidth: '30px' }}/>
          }

          {!appointment.clientId &&
          <Popover props={{ className: 'no-client-icon', title: t('Визит от двери'), minWidth: '55px' }}/>
          }

          {!appointment.online && <Popover props={{ className: 'pen', title: t('Запись через журнал') }}/>}

          {appointment.hasCoAppointments && <Popover props={{ className: 'super-visit', title: t('Мультивизит') }}/>}

          <Popover props={appointment.cashPayment
            ? { className: 'cash-payment', title: t('Оплата наличными'), minWidth: '55px' }
            : { className: 'no-cash-payment', title: t('Оплата картой'), minWidth: '55px' }}
          />

          {access(15) && !appointment.coappointment && (
            <React.Fragment>
              <Popover props={{
                'className': 'delete',
                'data-toggle': 'modal',
                'data-target': '.delete-notes-modal',
                'title': t('Отменить встречу'),
                'onClick': () => updateAppointmentForDeleting({
                  ...appointment,
                  staffId: workingStaffElement.staffId,
                }),
              }}/>

              {/* {appointment.clientId && <Popover props={{*/}
              {/*    className: `${appointment.regularClient ? 'old' : 'new'}-client-icon`,*/}
              {/*    title: appointment.regularClient ? 'Подтвержденный клиент' : 'Новый клиент',*/}
              {/*    minWidth: '100px'*/}
              {/* }}/>}*/}
            </React.Fragment>
          )}
        </span>

        <span id={`${appointment.appointmentId}-service-time`} className="service_time">
          {moment(appointment.appointmentTimeMillis, 'x').format('HH:mm')}&nbsp;-&nbsp;{
          moment(appointment.appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')
        }
        </span>
      </p>
    );
  };
}

export default withTranslation('common')(CellAppointmentHeader);
