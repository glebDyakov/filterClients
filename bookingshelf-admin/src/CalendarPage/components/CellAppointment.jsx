import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { appointmentActions, calendarActions } from '../../_actions';
import { access } from '../../_helpers/access';

import moment from 'moment';
import { isMobile } from 'react-device-detect';
import Box from '../../_components/dragAndDrop/Box';
import { getNearestAvailableTime } from '../../_helpers/available-time';
import { getCurrentCellTime } from '../../_helpers';
import Popover from '../../_components/Popover';

const CellAppointment = (props) => {
  const {
    company,
    dispatch,
    moveVisit,
    movingVisit,
    numberKey,
    staffKey,
    appointment,
    appointments,
    reservedTime,
    timetable,
    blickClientId,
    isStartMovingVisit,
    numbers,
    selectedNote,
    isClientNotComeLoading,
    workingStaffElement,
    handleUpdateClient,
    services,
    changeTime,
    selectedDays,
    selectedDaysKey,
    time,
    staff,
    updateAppointmentForDeleting,
  } = props;

  const [isOpenDropdownSelectClientStatus, setOpenDropdown] = useState();
  const [dropdownSelectedItem, setSelectedItem] = useState(appointment.clientConfirmed);


  const handleOpenSelectDropdown = () => {
    setOpenDropdown(true);
  };

  const handleCloseSelectDropdown = () => {
    setOpenDropdown(false);
  };

  let totalDuration = appointment.duration;
  const appointmentServices = [];
  let totalCount = 0;
  let totalPrice = appointment.price;
  let totalAmount = appointment.totalAmount;
  const currency = appointment.currency;
  const currentAppointments = [appointment];
  const currentTime = getCurrentCellTime(selectedDays, selectedDaysKey, time);
  const activeService = services && services.servicesList && services.servicesList.find((service) => service.serviceId === appointment.serviceId);
  appointmentServices.push({
    ...activeService,
    discountPercent: appointment.discountPercent,
    totalAmount: appointment.totalAmount,
    price: appointment.price,
    serviceName: appointment.serviceName,
    serviceId: appointment.serviceId,
  });

  const activeStaff = staff && staff.find((item) => workingStaffElement.staffId === item.staffId);

  if (appointment.hasCoAppointments) {
    appointments.forEach((staffAppointment) => staffAppointment.appointments.forEach((currentAppointment) => {
      if (!currentAppointment.coappointment && (currentAppointment.coAppointmentId === appointment.appointmentId)) {
        totalDuration += currentAppointment.duration;
        const activeCoService = services && services.servicesList && services.servicesList.find((service) => service.serviceId === currentAppointment.serviceId);
        appointmentServices.push({
          ...activeCoService,
          discountPercent: currentAppointment.discountPercent,
          totalAmount: currentAppointment.totalAmount,
          serviceName: currentAppointment.serviceName,
          price: currentAppointment.price,
          serviceId: currentAppointment.serviceId,
        });
        totalCount++;
        totalPrice += currentAppointment.price;
        totalAmount += currentAppointment.totalAmount;

        currentAppointments.push(currentAppointment);
      }
    }));
  }

  const companyTypeId = company.settings && company.settings.companyTypeId;

  const { booktimeStep } = company.settings;
  const cellHeight = 25;
  const step = booktimeStep / 60;
  const resultTextAreaHeight = ((totalDuration / 60 / step) - 1) * cellHeight;

  let extraServiceText;
  switch (totalCount) {
    case 0:
      extraServiceText = '';
      break;
    case 1:
      extraServiceText = 'и ещё 1 услуга';
      break;
    case 2:
    case 3:
    case 4:
      extraServiceText = `и ещё ${totalCount} услуги`;
      break;
    default:
      extraServiceText = `и ещё 5+ услуг`;
  }
  const serviceDetails = services && services.servicesList && (services.servicesList.find((service) => service.serviceId === appointment.serviceId) || {}).details;
  const minTextAreaHeight = ((currentAppointments.length - 1) ? cellHeight * (currentAppointments.length - 1) : 0);

  const staffList = appointments && appointments.filter((item) => item.appointments && item.appointments.some((localAppointment) => localAppointment.appointmentId === appointment.appointmentId));

  const timetableItems = timetable && timetable
    .filter((item) => item.staffId === workingStaffElement.staffId || (appointment.coStaffs && staffList.some((coStaff) => coStaff.staff.staffId === item.staffId)));

  const isOwnInterval = (i) => appointment.appointmentTimeMillis <= i && (appointment.appointmentTimeMillis + (totalDuration * 1000)) > i;
  const nearestAvailableMillis = getNearestAvailableTime(appointment.appointmentTimeMillis, appointment.appointmentTimeMillis, timetableItems, appointments, reservedTime, staff, isOwnInterval);
  const maxTextAreaCellCount = (nearestAvailableMillis - (appointment.appointmentTimeMillis + (step * 60000))) / 1000 / 60 / step;
  const maxTextAreaHeight = maxTextAreaCellCount * cellHeight;

  const textAreaId = `${appointment.appointmentId}-${numberKey}-${staffKey}-textarea-wrapper`;

  const startMovingVisit = (movingVisit, totalDuration, prevVisitStaffId, draggingAppointmentId) => {
    dispatch(appointmentActions.togglePayload({
      movingVisit,
      movingVisitDuration: totalDuration,
      prevVisitStaffId,
      draggingAppointmentId,
      isStartMovingVisit: true,
    }));
  };
  const content = (
    <div
      onMouseEnter={() => {
        if (appointment.clientId) {
          let clientAppointmentsCount = 0;
          appointments.forEach((item) => {
            item.appointments && item.appointments.forEach((currentAppointment) => {
              if (currentAppointment.clientId === appointment.clientId && !currentAppointment.coappointment && !currentAppointment.coAppointmentId) {
                clientAppointmentsCount++;
              }
            });
          });
          if (clientAppointmentsCount > 1) {
            dispatch(appointmentActions.toggleBlickedClientId(appointment.clientId));
          }
        }
      }}
      onMouseLeave={() => {
        if (appointment.clientId) {
          dispatch(appointmentActions.toggleBlickedClientId(null));
        }
      }}
      className={'cell notes ' + appointment.appointmentId + ' ' + (parseInt(moment(currentTime + appointment.duration * 1000).format('H')) >= 20 && 'notes-bottom' + ' ' + (parseInt(moment(currentTime).format('H')) === 23 && ' last-hour-notes'))
            + ((appointment.appointmentId === selectedNote && !appointment.coappointment) ? ' selected hovered' : '')
            + (blickClientId === appointment.clientId ? ' custom-blick-div' : '')
      }
      id={
        appointment.coappointment
          ? ''
          : (appointment.appointmentId + '_' + workingStaffElement.staffId + '_' + appointment.duration + '_' + appointment.appointmentTimeMillis + '_' + moment(appointment.appointmentTimeMillis, 'x').add(appointment.duration, 'seconds').format('x'))
      }
    >
      <p className={`notes-title${appointment.clientNotCome ? ' client-not-come-background' : (appointment.clientConfirmed ? ' client-confirmed-background' : '')} ${appointment.duration === 900 ? ' notes-title-bordered' : ''}`}
        onClick={() => dispatch(appointmentActions.toggleSelectedNote(appointment.appointmentId === selectedNote ? null : appointment.appointmentId))}
        style={{
          borderRadius: (resultTextAreaHeight === 0 ? '5px' : ''),
        }}>
        <span className="notes-buttons-container">
          {appointment.online && <Popover props={{ className: 'globus', title: 'Онлайн-запись' }}/>}

          {!!appointment.discountPercent && <Popover props={{
            className: 'percentage',
            title: `${appointment.discountPercent}%`,
            minWidth: '30px',
          }}/>}

          {!appointment.clientId &&
                    <Popover props={{ className: 'no-client-icon', title: 'Визит от двери', minWidth: '55px' }}/>}

          {!appointment.online && <Popover props={{ className: 'pen', title: 'Запись через журнал' }}/>}


          {appointment.hasCoAppointments &&
                    <Popover props={{ className: 'super-visit', title: 'Мультивизит' }}/>}


          {appointment.cashPayment ? (
            <Popover props={{ className: 'cash-payment', title: 'Оплата наличными', minWidth: '55px' }}/>
          ) : (
            <Popover props={{ className: 'no-cash-payment', title: 'Оплата картой', minWidth: '55px' }}/>
          )}

          {!appointment.coappointment && (
            <React.Fragment>
              <Popover props={{
                'className': 'delete',
                'data-toggle': 'modal',
                'data-target': '.delete-notes-modal',
                'title': 'Отменить встречу',
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
          {moment(appointment.appointmentTimeMillis, 'x').format('HH:mm')}&nbsp;-&nbsp;{moment(appointment.appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}
        </span>

      </p>
      <p onMouseDown={(e) => e.preventDefault()} id={textAreaId}
        className={`notes-container ${appointment.color.toLowerCase() + '-color'}`}
        style={{
          minHeight: minTextAreaHeight + 'px',
          maxHeight: maxTextAreaHeight + 'px',
          height: resultTextAreaHeight + 'px',
          padding: (resultTextAreaHeight === 0 ? '0px' : ''),
        }}>
        <span className="notes-container-message w-100">
          <span onClick={() => {
            console.log(appointment.clientFirstName ? ('Клиент: ' + appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')) + '\n' : 'Без клиента');
          }}
          className="w-100 d-flex justify-content-between"><span className="client-name">{appointment.clientFirstName ? ('Клиент: ' + appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')) + '\n' : 'Без клиента'}</span> <span className="text-right client-name">{appointment.totalAmount} {appointment.currency}</span></span>
          <ul>
            <li className="service">{appointment.serviceName} {serviceDetails ? `(${serviceDetails})` : ''}</li>
          </ul>
          {appointment.description.length > 0 && <p className="service client-name">Заметка: {appointment.description}</p>}
          <p className="service"></p>
          {extraServiceText}
          {/* {('\nЦена: ' + totalPrice + ' ' + appointment.currency)} ${totalPrice !== totalAmount ? ('(' + totalAmount.toFixed(2) + ' ' + appointment.currency + ')') : ''} ${appointment.description ? `\nЗаметка: ${appointment.description}` : ''}`;*/}

        </span>
      </p>
      {!isStartMovingVisit && <div onMouseDown={(e) => e.preventDefault()} className="cell msg-client-info">
        <div className={'cell msg-inner' + (appointment.clientId ? '' : ' pt-0')}>
          <p>
            <p className="new-text">Запись&nbsp;<p
              className="visit-time">{moment(appointment.appointmentTimeMillis, 'x').format('HH:mm')}&nbsp;-&nbsp;{moment(appointment.appointmentTimeMillis, 'x').add(totalDuration, 'seconds').format('HH:mm')}</p>
            </p>
            <button type="button" onClick={() => {
              dispatch(appointmentActions.toggleSelectedNote(null));
              dispatch(appointmentActions.toggleStartMovingVisit(false));
            }} className="close"/>
          </p>

          {appointment.clientId &&
                    <div className="dropdown-client-container">
                      <p onClick={isOpenDropdownSelectClientStatus ? handleCloseSelectDropdown : handleOpenSelectDropdown}
                        className={'dropdown-selected-item' + (isOpenDropdownSelectClientStatus ? ' opened' : '') + (appointment.clientNotCome ? ' clientNotCome' : (appointment.clientConfirmed ? ' clientConfirmed' : ' default'))}>{(appointment.clientNotCome ? 'Клиент не пришел' : (appointment.clientConfirmed ? 'Клиент подтвержден' : 'Ожидание клиента'))}</p>

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

          <p style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            className="client-name-book">
            <span className="client-title">Клиент:</span>
          </p>

          {!appointment.clientId &&
                    <p className="name">Без клиента</p>}

          {appointment.clientId &&
                    <p data-target=".client-detail" onClick={(e) => {
                      $('.client-detail').modal('show');
                      handleUpdateClient(appointment.clientId);
                    }}
                    className="name">{appointment.clientFirstName ? (appointment.clientFirstName + (appointment.clientLastName ? ` ${appointment.clientLastName}` : '')) : 'Без клиента'}</p>}
          {access(12) && appointment.clientId && <p>{appointment.clientPhone}</p>}
          {companyTypeId === 2 && appointment.carBrand
                    && <p><strong>Марка авто: </strong>
                      {appointment.carBrand}
                    </p>
          }
          {companyTypeId === 2 && appointment.carNumber
                    && <p><strong>Гос. номер: </strong>
                      {appointment.carNumber}
                    </p>
          }

          <div className="cash-choice">
            <div style={{ position: 'relative' }} className="check-box">
              <label>
                                    Безналичный расчет
                {0
                  ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }} className="loader"><img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>
                  : <React.Fragment>
                    <input className="form-check-input" type="checkbox"
                      checked={!appointment.cashPayment}
                      onChange={()=> {
                        const cashPayment = !currentAppointments[0].cashPayment;
                        const params = currentAppointments.map((item) => {
                          return {
                            ...item,
                            cashPayment: cashPayment,
                          };
                        });
                        dispatch(calendarActions.editAppointment2(JSON.stringify(params), currentAppointments[0].appointmentId ));
                      }}
                      // onChange={() => this.setBookingCode('left', true)}
                    />
                    <span className="check-box-circle"/>
                  </React.Fragment>
                }
              </label>
            </div>
            <div style={{ position: 'relative' }} className="check-box">
              <label>
                                    Наличный расчет
                {0
                  ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }} className="loader"><img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>
                  : <React.Fragment>
                    <input className="form-check-input" type="checkbox"
                      checked={appointment.cashPayment}
                      onChange={()=> {
                        const cashPayment = !currentAppointments[0].cashPayment;
                        const params = currentAppointments.map((item) => {
                          return {
                            ...item,
                            cashPayment: cashPayment,
                          };
                        });
                        dispatch(calendarActions.editAppointment2(JSON.stringify(params), currentAppointments[0].appointmentId ));
                      }}
                      // checked={!booking.bookingCode.includes('left')} onChange={() => this.setBookingCode('right', true)}
                    />
                    <span className="check-box-circle"/>
                  </React.Fragment>
                }
              </label>
            </div>
          </div>


          {/* <div className="check-box calendar-client-checkbox red-text">*/}
          {/*    <p className="title mb-3">Интервал онлайн-записи</p>*/}
          {/*    <div style={{ position: 'relative' }} className="check-box">*/}
          {/*        <label>*/}
          {/*            {0*/}
          {/*              ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }} className="loader"><img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>*/}
          {/*              : <React.Fragment>*/}
          {/*                  <input className="form-check-input" type="checkbox" checked={!1} onChange={() => this.handleServiceCheckboxChange('serviceIntervalOn')}/>*/}
          {/*                  <span className="check"/>*/}
          {/*              </React.Fragment>*/}
          {/*            }*/}
          {/*            15 минут*/}
          {/*        </label>*/}
          {/*    </div>*/}
          {/*    <div style={{ position: 'relative' }} className="check-box">*/}
          {/*        <label>*/}
          {/*            {0*/}
          {/*              ? <div style={{ position: 'absolute', left: '-10px', width: 'auto' }} className="loader"><img style={{ width: '40px' }} src={`${process.env.CONTEXT}public/img/spinner.gif`} alt=""/></div>*/}
          {/*              : <React.Fragment>*/}
          {/*                  <input className="form-check-input" type="checkbox" checked={1} onChange={() => this.handleServiceCheckboxChange('serviceIntervalOn')}/>*/}
          {/*                  <span className="check"/>*/}
          {/*              </React.Fragment>*/}
          {/*            }*/}
          {/*            Равен времени услуги*/}
          {/*        </label>*/}
          {/*    </div>*/}

          {/* </div>*/}

          {appointment.clientId && <hr className="block-line"/>}

          <p className="client-name-book">{appointmentServices.length > 1 ? 'Список услуг:' : 'Услуга:'}</p>
          {appointmentServices.map((service) => {
            const details = services && services.servicesList && (services.servicesList.find((service) => service.serviceId === appointment.serviceId) || {}).details;
            return <p className="service-name">

              {service.serviceName} {details ? `(${details})` : ''}

              <span style={{ display: 'inline-block', textAlign: 'left' }}>
                {String(service.price) ? service.price : service.priceFrom} {service.currency} {!!service.discountPercent &&
                            <span style={{
                              display: 'inline',
                              textAlign: 'left',
                              color: 'rgb(212, 19, 22)',
                            }}>
                                                                ({service.totalAmount} {service.currency})
                            </span>}
              </span>
              {!!service.discountPercent && <span style={{
                textAlign: 'left',
                fontSize: '13px',
                color: 'rgb(212, 19, 22)',
              }}>{`${(service.discountPercent === (appointment && appointment.clientDiscountPercent)) ? 'Скидка клиента' : 'Единоразовая скидка'}: ${service.discountPercent}%`}</span>}


            </p>;
          })
          }

          <p className="all-price">Итого:&nbsp;<span className="price">{totalAmount}&nbsp;{currency}</span></p>

          <hr className="block-line"/>


          <p className="staff-block-title">Мастер</p>

          <div className="staff-block">
            <span className="img-container">
              <img
                src={activeStaff && activeStaff.imageBase64 ? 'data:image/png;base64,' + activeStaff.imageBase64 : `${process.env.CONTEXT}public/img/avatar.svg`}
                className="rounded-circle" alt="staff image"/>
            </span>

            <p className="name-staff">{workingStaffElement.firstName} {workingStaffElement.lastName ? workingStaffElement.lastName : ''}</p>
          </div>

          {appointment.description &&
                    <p className="visit-note"><p className="bold-text">Заметка:</p>&nbsp;{appointment.description}</p>}
          {currentTime >= parseInt(moment().subtract(1, 'week').format('x')) && (
            <div className="msg-inner-buttons">
              <div
                onClick={() => startMovingVisit(appointment, totalDuration, workingStaffElement.staffId)}
                className="msg-inner-button-wrapper"
              >
                <div className="msg-inner-button-wrapper-1">
                  <img style={{ width: '20px' }}
                    src={`${process.env.CONTEXT}public/img/appointment_move.svg`} alt=""/>
                                    Перенести
                </div>
                {/* <span className="move-white"/>*/}
              </div>
              <div
                onClick={() => changeTime(currentTime, workingStaffElement, numbers, true, currentAppointments)}
                className="msg-inner-button-wrapper"
              >
                <div className="msg-inner-button-wrapper-2">
                  <img style={{ width: '20px' }}
                    src={`${process.env.CONTEXT}public/img/appointment_edit.svg`} alt=""/>
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
                  <img style={{ width: '17px' }}
                    src={`${process.env.CONTEXT}public/img/appointment_delete.svg`} alt=""/>
                                    Удалить
                </div>
                {/* <span className="cancel-white"/>*/}
              </div>

            </div>)
          }
        </div>
      </div>}
    </div>
  );


  const wrapperClassName = 'cell default-width ' + (currentTime <= moment().format('x') && currentTime >= moment().subtract(step, 'minutes').format('x') ? 'present-time ' : '') + (appointment.appointmentId === selectedNote ? 'selectedNote' : '');

  const dragVert = ((movingVisit && movingVisit.appointmentId) !== appointment.appointmentId) && currentTime >= parseInt(moment().subtract(1, 'week').format('x')) && (
    <p onMouseDown={(e) => {
      e.preventDefault();
      dispatch(appointmentActions.togglePayload({
        minTextAreaHeight,
        maxTextAreaHeight,
        textAreaId,
        currentTarget: e.currentTarget,
        changingVisit: { ...appointment, staffId: workingStaffElement.staffId },
        changingPos: e.pageY,
        offsetHeight: document.getElementById(textAreaId).offsetHeight,
      }));
    }} style={{
      cursor: 'ns-resize',
      height: '8px',
      position: 'absolute',
      bottom: -(resultTextAreaHeight - 2) + 'px',
      width: '100%',
      zIndex: 9990,
    }}>
      <span className="drag-vert"/>
    </p>
  );


  if (isMobile || appointment.coappointment) {
    return <div style={{ display: 'block', width: '100%', overflow: 'visible', position: 'relative' }}>
      <div className={wrapperClassName}>{content}</div>
      {dragVert}
    </div>;
  }

  return <div style={{ display: 'block', width: '100%', overflow: 'visible', position: 'relative' }}>
    <Box
      moveVisit={moveVisit}
      appointmentId={appointment.appointmentId}
      dragVert={dragVert}
      startMoving={() => startMovingVisit(appointment, totalDuration, workingStaffElement.staffId, appointment.appointmentId)}
      content={content}
      wrapperClassName={wrapperClassName}
    />
    {appointment.appointmentId && dragVert}
  </div>;
};

function mapStateToProps(state) {
  const {
    company,
    calendar: {
      appointments,
      reservedTime,
      isClientNotComeLoading,
    },
    staff: { timetable, staff },
    appointment: {
      blickClientId,
      movingVisit,
      selectedNote,
      isStartMovingVisit,
      draggingAppointmentId,
    },
    cell: { selectedDays },
  } = state;

  return {
    company,
    staff,
    appointments,
    reservedTime,
    timetable,
    isClientNotComeLoading,
    blickClientId,
    movingVisit,
    selectedNote,
    isStartMovingVisit,
    draggingAppointmentId,
    selectedDays,
  };
}

export default connect(mapStateToProps)(CellAppointment);
