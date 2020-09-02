import React, { useState } from 'react';
import moment from 'moment';
import { appointmentActions, calendarActions } from '../../../_actions';
import { access } from '../../../_helpers/access';
import { connect } from 'react-redux';

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
  } = props;

  const activeStaff = staff && staff.find((item) => workingStaffElement.staffId === item.staffId);

  const companyTypeId = settings && settings.companyTypeId;

  const [isOpenDropdownSelectClientStatus, setOpenDropdown] = useState();
  const [dropdownSelectedItem, setSelectedItem] = useState(appointment.clientConfirmed);


  const handleOpenSelectDropdown = () => {
    setOpenDropdown(true);
  };

  const handleCloseSelectDropdown = () => {
    setOpenDropdown(false);
  };

  return (!isStartMovingVisit &&
    <div onMouseDown={(e) => e.preventDefault()} className="cell msg-client-info">
      <div className={'cell msg-inner' + (appointment.clientId ? '' : ' pt-0')}>
        <p>
          <p className="new-text">Запись&nbsp;
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

        {appointment.clientId &&
        <div className="dropdown-client-container">
          <p
            onClick={isOpenDropdownSelectClientStatus ? handleCloseSelectDropdown : handleOpenSelectDropdown}
            className={'dropdown-selected-item' + (isOpenDropdownSelectClientStatus ? ' opened' : '') +
            (appointment.clientNotCome
              ? ' clientNotCome'
              : (appointment.clientConfirmed ? ' clientConfirmed' : ' default')
            )}
          >
            {(appointment.clientNotCome
              ? 'Клиент не пришел'
              : (appointment.clientConfirmed ? 'Клиент подтвержден' : 'Ожидание клиента')
            )}
          </p>

          {isOpenDropdownSelectClientStatus &&
          <div className="dropdown-selected">
            {(appointment.clientNotCome || appointment.clientConfirmed) &&
            <p className="dropdown-item" onClick={() => {
              setSelectedItem(true);
              const params = currentAppointments.map((item) => {
                return {
                  ...item,
                  clientNotCome: false,
                  clientConfirmed: false,
                };
              });
              dispatch(calendarActions.editAppointment2(JSON.stringify(params), currentAppointments[0].appointmentId));

              handleCloseSelectDropdown();
            }
            }>
              Ожидание клиента
            </p>
            }


            {appointment.clientConfirmed === false &&
            <p className="dropdown-item" onClick={() => {
              setSelectedItem('clientConfirm');
              const newClientNotCome = false;
              const params = currentAppointments.map((item) => {
                return {
                  ...item,
                  clientNotCome: newClientNotCome,
                  clientConfirmed: true,
                };
              });
              dispatch(calendarActions.editAppointment2(JSON.stringify(params), currentAppointments[0].appointmentId));
              handleCloseSelectDropdown();
            }
            }>
              Клиент подтвердил
            </p>}

            {appointment.clientNotCome !== true &&
            <p className="dropdown-item" onClick={() => {
              setSelectedItem('clientNotCome');
              const newClientNotCome = true;
              const params = currentAppointments.map((item) => {
                return {
                  ...item,
                  clientNotCome: newClientNotCome,
                  clientConfirmed: 'false',
                };
              });
              dispatch(calendarActions.editAppointment2(JSON.stringify(params), currentAppointments[0].appointmentId));
              handleCloseSelectDropdown();
            }}>
              Клиент не пришел
            </p>}
          </div>
          }
        </div>
        }

        <p
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          className="client-name-book"
        >
          <span className="client-title">Клиент:</span>
        </p>

        {!appointment.clientId &&
        <p className="name">Без клиента</p>}

        {appointment.clientId &&
          <p
            data-target=".client-detail"
            onClick={(e) => {
              $('.client-detail').modal('show');
              handleUpdateClient(appointment.clientId);
            }}
            className="name"
          >
            {appointment.clientFirstName
              ? (appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : ''))
              : 'Без клиента'
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
              Безналичный расчет
              <input
                className="form-check-input" type="checkbox"
                checked={!appointment.cashPayment}
                onChange={()=> {
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
              Наличный расчет
              <input
                className="form-check-input" type="checkbox"
                checked={appointment.cashPayment}
                onChange={()=> {
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

        <p className="client-name-book">{appointmentServices.length > 1 ? 'Список услуг:' : 'Услуга:'}</p>
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
                    ? 'Скидка клиента'
                    : 'Единоразовая скидка'
                  }: ${service.discountPercent}%`
                  }
                </span>
              }
            </p>
          );
        })
        }

        <p className="all-price">Итого:&nbsp;<span className="price">{totalAmount}&nbsp;BYN</span></p>
        <hr className="block-line"/>

        <p className="staff-block-title">Мастер</p>
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
        <p className="visit-note"><p className="bold-text">Заметка:</p>&nbsp;{appointment.description}</p>}
        {isWeekBefore && (
          <div className="msg-inner-buttons">
            <div
              onClick={() => startMovingVisit()}
              className="msg-inner-button-wrapper"
            >
              <div className="msg-inner-button-wrapper-1">
                <img style={{ width: '20px' }} src={`${process.env.CONTEXT}public/img/appointment_move.svg`} alt=""/>
                Перенести
              </div>
              {/* <span className="move-white"/>*/}
            </div>
            <div
              onClick={() => changeTime(currentTime, workingStaffElement, numbers, true, currentAppointments)}
              className="msg-inner-button-wrapper"
            >
              <div className="msg-inner-button-wrapper-2">
                <img style={{ width: '20px' }} src={`${process.env.CONTEXT}public/img/appointment_edit.svg`} alt=""/>
                Изменить
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
                Удалить
              </div>
              {/* <span className="cancel-white"/>*/}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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

export default connect(mapStateToProps)(CellAppointmentModal);
