import React, { useState } from 'react';
import moment from 'moment';
import { appointmentActions, calendarActions } from '../../../_actions';
import { access } from '../../../_helpers/access';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

const CellAppointmentModal = (props) => {
  const {
    isWeekBefore,
    dispatch,
    isStartMovingVisit,
    appointment,
    settings,
    totalDuration,
    currentAppointments,
    handleUpdateClient,
    appointmentServices,
    workingStaffElement,
    currentTime,
    startMovingVisit,
    changeTime,
    updateAppointmentForDeleting,
    services,
    totalAmount,
    numbers,
    staff,
    t,
  } = props;

  const activeStaff = staff && staff.find((item) => workingStaffElement.staffId === item.staffId);

  const companyTypeId = settings && settings.companyTypeId;

  const [isOpenDropdownSelectClientStatus, setOpenDropdown] = useState();

  const handleOpenSelectDropdown = () => {
    setOpenDropdown(true);
  };

  const handleCloseSelectDropdown = () => {
    setOpenDropdown(false);
  };

  const currentAppointmentStatus = getCurrentAppointmentStatus(appointment);
  const currentAppointmentStatusString = getCurrentAppointmentStatusToString(currentAppointmentStatus);

  return (!isStartMovingVisit &&
    <div onMouseDown={(e) => e.preventDefault()} className="cell msg-client-info">
      <div className={'cell msg-inner' + (appointment.clientId ? '' : ' pt-0')}>
        <p>
          <p className="new-text">{t('Запись')}&nbsp;
            <p className="visit-time">
              {moment(appointment.appointmentTimeMillis, 'x').format('HH:mm')}&nbsp;-&nbsp;{
              moment(appointment.appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')
            }
            </p>
          </p>
          <button type="button" onClick={() => {
            dispatch(appointmentActions.toggleSelectedNote(null));
            dispatch(appointmentActions.toggleStartMovingVisit(false));
          }} className="close"/>
        </p>

        <div className="dropdown-client-container">
          <p
            onClick={isOpenDropdownSelectClientStatus ? handleCloseSelectDropdown : handleOpenSelectDropdown}
            className={'dropdown-selected-item' + (isOpenDropdownSelectClientStatus ? ' opened' : '') +
            (" " + currentAppointmentStatus)}
          >
            {t(currentAppointmentStatusString)}
          </p>

          {isOpenDropdownSelectClientStatus &&
          <div className="dropdown-selected">
            {appointment.status !== 'W' &&
            <p className="dropdown-item" onClick={() => {
              const params = currentAppointments.map((item) => {
                return {
                  ...item,
                  status: "W",
                };
              });
              dispatch(calendarActions.editAppointment2(JSON.stringify(params), currentAppointments[0].appointmentId));

              handleCloseSelectDropdown();
            }
            }>
              {t('Ожидание клиента')}
            </p>
            }


            {appointment.status !== 'O' &&
            <p className="dropdown-item" onClick={() => {
              const params = currentAppointments.map((item) => {
                return {
                  ...item,
                  status: "O",
                };
              });
              dispatch(calendarActions.editAppointment2(JSON.stringify(params), currentAppointments[0].appointmentId));
              handleCloseSelectDropdown();
            }
            }>
              {t('Клиент подтвердил')}
            </p>}

            {appointment.status !== 'N' &&
            <p className="dropdown-item" onClick={() => {
              const params = currentAppointments.map((item) => {
                return {
                  ...item,
                  status: "N",
                };
              });
              dispatch(calendarActions.editAppointment2(JSON.stringify(params), currentAppointments[0].appointmentId));
              handleCloseSelectDropdown();
            }}>
              {t('Клиент не пришел')}
            </p>}

            {appointment.status !== 'C' &&
            <p className="dropdown-item" onClick={() => {
              const params = currentAppointments.map((item) => {
                return {
                  ...item,
                  status: "C",
                };
              });
              dispatch(calendarActions.editAppointment2(JSON.stringify(params), currentAppointments[0].appointmentId));
              handleCloseSelectDropdown();
            }}>
              {t('Клиент пришел')}
            </p>}
          </div>
          }
        </div>

        <p
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          className="client-name-book"
        >
          <span className="client-title">{t('Клиент')}:</span>
        </p>

        {!appointment.clientId &&
        <p className="name">{t('Без клиента')}</p>}

        {appointment.clientId &&
        <p
          data-target=".client-detail"
          onClick={(e) => {
            if (access(4)) {
              $('.client-detail').modal('show');
              handleUpdateClient(appointment.clientId);
            }
          }}
          className="name"
        >
          {appointment.clientFirstName
            ? (appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : ''))
            : t('Без клиента')
          }
        </p>
        }
        {access(12) && appointment.clientId && <p>{appointment.clientPhone}</p>}
        {companyTypeId === 2 && appointment.carBrand &&
        <p>
          <strong>Марка авто: </strong>
          {appointment.carBrand}
        </p>
        }
        {companyTypeId === 2 && appointment.carNumber &&
        <p>
          <strong>Гос. номер: </strong>
          {appointment.carNumber}
        </p>
        }

        <div className="cash-choice">
          <div style={{ position: 'relative' }} className="check-box">
            <label>
              {t('Безналичный расчет')}
              <input
                className="form-check-input" type="checkbox"
                checked={!appointment.cashPayment}
                onChange={() => {
                  const cashPayment = !currentAppointments[0].cashPayment;
                  const params = currentAppointments.map((item) => {
                    return {
                      ...item,
                      cashPayment: cashPayment,
                    };
                  });
                  dispatch(calendarActions.editAppointment2(
                    JSON.stringify(params),
                    currentAppointments[0].appointmentId,
                  ));
                }}
                // onChange={() => this.setBookingCode('left', true)}
              />
              <span className="check-box-circle"/>
            </label>
          </div>
          <div style={{ position: 'relative' }} className="check-box">
            <label>
              {t('Наличный расчет')}
              <input
                className="form-check-input" type="checkbox"
                checked={appointment.cashPayment}
                onChange={() => {
                  const cashPayment = !currentAppointments[0].cashPayment;
                  const params = currentAppointments.map((item) => {
                    return {
                      ...item,
                      cashPayment: cashPayment,
                    };
                  });
                  dispatch(calendarActions.editAppointment2(
                    JSON.stringify(params),
                    currentAppointments[0].appointmentId,
                  ));
                }}
                // checked={!booking.bookingCode.includes('left')} onChange={() => this.setBookingCode('right', true)}
              />
              <span className="check-box-circle"/>
            </label>
          </div>
        </div>


        {/* <div className="check-box calendar-client-checkbox red-text">*/}
        {/*    <p className="title mb-3">Интервал онлайн-записи</p>*/}
        {/*    <div style={{ position: 'relative' }} className="check-box">*/}
        {/*        <label>*/}
        {/*            {0*/}
        {/*              ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }}
        className="loader"><img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
        </div>*/}
        {/*              : <React.Fragment>*/}
        {/*                  <input className="form-check-input" type="checkbox" checked={!1}
        onChange={() => this.handleServiceCheckboxChange('serviceIntervalOn')}/>*/}
        {/*                  <span className="check"/>*/}
        {/*              </React.Fragment>*/}
        {/*            }*/}
        {/*            15 минут*/}
        {/*        </label>*/}
        {/*    </div>*/}
        {/*    <div style={{ position: 'relative' }} className="check-box">*/}
        {/*        <label>*/}
        {/*            {0*/}
        {/*              ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }}
        className="loader"><img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/>
        </div>*/}
        {/*              : <React.Fragment>*/}
        {/*                  <input className="form-check-input" type="checkbox" checked={1}
         onChange={() => this.handleServiceCheckboxChange('serviceIntervalOn')}/>*/}
        {/*                  <span className="check"/>*/}
        {/*              </React.Fragment>*/}
        {/*            }*/}
        {/*            Равен времени услуги*/}
        {/*        </label>*/}
        {/*    </div>*/}

        {/* </div>*/}

        {appointment.clientId && <hr className="block-line"/>}

        <p
          className="client-name-book">{appointmentServices.length > 1 ? t('Список услуг') + ':' : t('Услуга') + ':'}</p>
        {appointmentServices.map((service, i) => {
          const details = services && services.servicesList &&
            (services.servicesList.find((service) => service.serviceId === appointment.serviceId) || {}).details;
          return (
            <p key={`msg-info-service-name-${i}`} className="service-name">
              {service.serviceName} {details ? `(${details})` : ''}
              <span style={{ display: 'inline-block', textAlign: 'left' }}>
                {String(service.price) ? service.price : service.priceFrom} {service.currency} {
                !!service.discountPercent &&
                <span style={{
                  display: 'inline',
                  textAlign: 'left',
                  color: 'rgb(212, 19, 22)',
                }}>
                      ({service.totalAmount} {service.currency})
                    </span>
              }
              </span>
              {!!service.discountPercent &&
              <span style={{ textAlign: 'left', fontSize: '13px', color: 'rgb(212, 19, 22)' }}>
                  {`${(service.discountPercent === (appointment && appointment.clientDiscountPercent))
                    ? t('Скидка клиента')
                    : t('Единоразовая скидка')
                  }: ${service.discountPercent}%`
                  }
                </span>
              }
            </p>
          );
        })
        }

        <p className="all-price">{t('Итого')}:&nbsp;<span
          className="price">{totalAmount}&nbsp;{appointment && appointment.currency}</span></p>
        <hr className="block-line"/>

        <p className="staff-block-title">{t('Мастер')}</p>
        <div className="staff-block">
          <span className="img-container">
            <img
              src={activeStaff && activeStaff.imageBase64
                ? 'data:image/png;base64,' + activeStaff.imageBase64
                : `${process.env.CONTEXT}public/img/avatar.svg`
              }
              className="rounded-circle"
              alt="staff image"
            />
          </span>

          <p className="name-staff">{workingStaffElement.firstName} {
            workingStaffElement.lastName ? workingStaffElement.lastName : ''
          }
          </p>
        </div>

        {appointment.description &&
        <p className="visit-note"><p className="bold-text">{t('Заметка')}:</p>&nbsp;{appointment.description}</p>}
        {access(15) && isWeekBefore && (
          <div className="msg-inner-buttons">
            <div
              onClick={startMovingVisit}
              className="msg-inner-button-wrapper"
            >
              <div className="msg-inner-button-wrapper-1">
                <img style={{ width: '20px' }} src={`${process.env.CONTEXT}public/img/appointment_move.svg`} alt=""/>
                {t('Перенести')}
              </div>
              {/* <span className="move-white"/>*/}
            </div>
            <div
              onClick={() => changeTime(currentTime, workingStaffElement, numbers, true, currentAppointments)}
              className="msg-inner-button-wrapper"
            >
              <div className="msg-inner-button-wrapper-2">
                <img style={{ width: '20px' }} src={`${process.env.CONTEXT}public/img/appointment_edit.svg`} alt=""/>
                {t('Изменить')}
              </div>
              {/* <span className="move-white"/>*/}
            </div>
            <div
              className="msg-inner-button-wrapper"
              data-toggle="modal"
              data-target=".delete-notes-modal"
              onClick={() => updateAppointmentForDeleting({
                ...appointment,
                staffId: workingStaffElement.staffId,
              })}
            >
              <div className="msg-inner-button-wrapper-3">
                <img style={{ width: '17px' }} src={`${process.env.CONTEXT}public/img/appointment_delete.svg`} alt=""/>
                {t('Удалить')}
              </div>
              {/* <span className="cancel-white"/>*/}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function getCurrentAppointmentStatus(appointment) {
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

function getCurrentAppointmentStatusToString(status) {
  console.log(status);
  switch (status) {
    case 'clientNotCome':
      return "Клиент не пришел";
    case 'clientIsCome':
      return "Клиент пришел";
    case 'waitClient':
      return "Ожидание клиента";
    case 'clientConfirmed':
      return "Клиент подтвердил";
  }
}

function mapStateToProps(state) {
  const {
    company: {
      settings,
    },
    staff: { staff },
  } = state;

  return {
    settings,
    staff,
  };
}

export default connect(mapStateToProps)(withTranslation('common')(React.memo(CellAppointmentModal)));
