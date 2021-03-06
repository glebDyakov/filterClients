import React from 'react';
import moment from 'moment';

import Popover from '../../../../_components/Popover';
import { withTranslation } from 'react-i18next';
import { access } from '../../../../_helpers/access';
import { PAYMENT_TYPES } from '../../../../_constants';

class CellAppointmentHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.POPOVER_PROPS_BY_TYPE = {
      [PAYMENT_TYPES.CARD]: { className: 'no-cash-payment', title: this.props.t('Оплата картой'), minWidth: '55px' },
      [PAYMENT_TYPES.CASH]:  { className: 'cash-payment', title: this.props.t('Оплата наличными'), minWidth: '55px' },
      [PAYMENT_TYPES.INSURANCE]: { className: 'insurance-payment', title: this.props.t('Оплата по страховке'), minWidth: '55px' },
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.appointment.appointmentTimeMillis !== prevProps.appointment.appointmentTimeMillis || this.props.totalDuration !== prevProps.totalDuration) {
      document.getElementById(`${this.props.appointment.appointmentId}-service-time`).innerHTML = `${moment(this.props.appointment.appointmentTimeMillis, 'x').format('HH:mm')} - ${moment(this.props.appointment.appointmentTimeMillis, 'x').add(this.props.totalDuration, 'seconds').format('HH:mm')}`;
    }
  }


  getColorClass() {
    const { appointment } = this.props;

    switch (appointment.status) {
      case 'C':
        return 'clientIsCome';
      case 'N':
        return 'clientNotCome';
      case 'O':
        return 'clientConfirmed';
      case 'W':
        return 'waitClient';
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
          {!appointment.intersected && (
              <React.Fragment>
                {appointment.online && <Popover props={{ className: 'globus', title: t('Онлайн-запись') }}/>}

                {!!appointment.discountPercent &&
                <Popover props={{ className: 'percentage', title: `${appointment.discountPercent}%`, minWidth: '30px' }}/>
                }

                {!appointment.clientId &&
                <Popover props={{ className: 'no-client-icon', title: t('Визит от двери'), minWidth: '55px' }}/>
                }

                {!appointment.online && <Popover props={{ className: 'pen', title: t('Запись через журнал') }}/>}

                {appointment.hasCoAppointments && <Popover props={{ className: 'super-visit', title: t('Мультивизит') }}/>}

                <Popover props={this.POPOVER_PROPS_BY_TYPE[appointment.paymentType]}
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
