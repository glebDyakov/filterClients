import React, {PureComponent} from 'react';
import { connect } from 'react-redux';
import StarRatings from "react-star-ratings";
import {staffActions} from "../../_actions";


class TabOne extends  PureComponent{
    constructor(props) {
        super(props)
        this.state = {
            staff: null
        }
        this.handleStaffCommentsClick = this.handleStaffCommentsClick.bind(this);
        this.handleSelectStaff = this.handleSelectStaff.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const { movingVisit } = newProps
        if (newProps.services && newProps.isStartMovingVisit && movingVisit && (JSON.stringify(this.props.services) !== JSON.stringify(newProps.services))) {
            movingVisit && movingVisit.forEach(visit => {
                this.props.selectService({target: { checked: true} }, newProps.services.find(service => service.serviceId === visit.serviceId))

            })
            //this.props.refreshTimetable()
        }
    }

    handleStaffCommentsClick(staff) {
        this.props.setStaffComments(staff);
        this.props.setScreen('staff-comments');
    }

    randomInteger(min, max) {
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    handleNoStaffClick() {
        const { setScreen, isStartMovingVisit, forceUpdateStaff, selectedTime: time, timetableAvailable, staffs } = this.props;

        const updatedState = {};

        const selectedStaffFromTimetableList = timetableAvailable.filter(timetableItem =>
            timetableItem.availableDays.some(avDayItem => avDayItem.availableTimes.some(avTimeItem => {
                return avTimeItem.startTimeMillis <= time && time <= avTimeItem.endTimeMillis
            })));
        const randomStaffIndex = this.randomInteger(0, (selectedStaffFromTimetableList.length - 1));
        const selectedStaffFromTimetable = selectedStaffFromTimetableList[randomStaffIndex];

        updatedState.selectedStaff = staffs.find(item => item.staffId === selectedStaffFromTimetable.staffId);
        forceUpdateStaff(updatedState.selectedStaff)
        if (isStartMovingVisit) {
            this.setState({ staff: updatedState.selectedStaff })
        } else {
            setScreen(5);
        }
    }

    handleSelectStaff(e, staff) {
        const { selectStaff, forceUpdateStaff, flagAllStaffs, setScreen, isStartMovingVisit } = this.props;
        if (isStartMovingVisit && flagAllStaffs) {
            forceUpdateStaff(staff)
            this.setState({ staff })
        } else if (e.target.className !== 'staff-comments') {
            selectStaff(staff)
            if (flagAllStaffs) {
                setScreen(5)
            }
        }
    }

    render() {
        const {staffId, handleMoveVisit, handleDayClick, newAppointments, staffs, selectedTime: time, timetableAvailable, isStartMovingVisit, setDefaultFlag, selectedServices, flagAllStaffs, movingVisit, services, subcompanies, history, match, clearStaff, nearestTime, selectStaff, info, setScreen, refreshTimetable, roundDown} = this.props;

        return(
            <div className="service_selection screen1">
                <div className="title_block n">
                    {((isStartMovingVisit && newAppointments && !!newAppointments.length) || (flagAllStaffs || (subcompanies.length > 1))) && (
                        <span className="prev_block" onClick={() => {
                            if (flagAllStaffs) {
                                setScreen(4);
                            } else if (isStartMovingVisit && newAppointments && newAppointments.length) {
                                setScreen(6);
                            } else {
                                clearStaff();
                                setDefaultFlag();
                                setScreen(0);
                                let {company} = match.params;
                                let url = company.includes('_') ? company.split('_')[0] : company
                                history.push(`/${url}`)
                            }
                        }}><span className="title_block_text">Назад</span></span>
                    )}
                    <p className="modal_title">{info.template === 1 ? 'Выбор сотрудника' : 'Выбор рабочего места'}</p>
                    {staffId &&
                    <span className="next_block" onClick={() => {
                        setScreen(isStartMovingVisit ? 3 : 2);
                            refreshTimetable();
                    }}><span className="title_block_text">Далее</span></span>}
                </div>
                {!this.state.staff && (
                    <React.Fragment>
                        <ul className={`desktop-visible staff_popup ${staffs && staffs.length <= 3 ? "staff_popup_large" : ""} ${staffs && staffs.length === 1 ? "staff_popup_one" : ""}`}>
                        {flagAllStaffs && (
                            <li className={'nb'}
                                onClick={() => {
                                    this.handleNoStaffClick()
                                }}
                            >
                                <span className="staff_popup_item">
                                    <div style={{ width: '100%' }} className="img_container">

                                        <span className="staff_popup_name no-staff">Сотрудник не важен<br/>


                                        </span>

                                    </div>

                                </span>
                            </li>
                        )}
                        {staffs && staffs.length > 0 && staffs
                            .filter(staff => {
                                const activeServices = movingVisit ? services.filter(item => movingVisit.some(visit=> item.serviceId ===visit.serviceId)) : [];
                                return flagAllStaffs || (movingVisit ? (activeServices && activeServices.every(item => (item.staffs && item.staffs.some(localStaff => localStaff.staffId === staff.staffId)))) : true)
                            })
                            .filter(staff => {
                                return isStartMovingVisit || (flagAllStaffs ? selectedServices.some(selectedServ => selectedServ.staffs && selectedServ.staffs.some(selectedServStaff => selectedServStaff.staffId === staff.staffId)) : true)
                            })
                            .filter(staff => {
                                if (flagAllStaffs) {
                                    return timetableAvailable.filter(timetableItem =>
                                        timetableItem.availableDays.some(avDayItem => avDayItem.availableTimes.some(avTimeItem => {
                                            return avTimeItem.startTimeMillis <= time && time <= avTimeItem.endTimeMillis
                                        })))
                                        .some(item => item.staffId === staff.staffId);
                                }
                                return true
                            })
                            .map((staff, idStaff) =>


                            <li className={(staffId && staffId === staff.staffId && 'selected') + ' nb'}
                                onClick={(e) => this.handleSelectStaff(e, staff)}
                                key={idStaff}
                            >
                                <span className="staff_popup_item">
                                    <div className="img_container">
                                        <div className="img_container_block">
                                            <div>
                                                <img
                                                    style={{ marginRight: staffs.length <= 3 ? 'auto': 0 }}
                                                    src={staff.imageBase64 ? "data:image/png;base64," + staff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                                    alt=""/>
                                            </div>
                                            <div style={{ textAlign: 'center', width: '70px' }}>
                                            {staff.rating ? (
                                                <StarRatings
                                                    rating={staff.rating}
                                                    starHoverColor={'#ff9500'}
                                                    starRatedColor={'#ff9500'}
                                                    starDimension="14px"
                                                    starSpacing="0"
                                                />
                                            ) : <p style={{ fontSize: '12px'}}>Нет отзывов</p>}
                                            </div>


                                        </div>


                                     <span className="staff_popup_name">{staff.firstName} {staff.lastName ? staff.lastName : ''}<br/>
                                            {staff.description && <p style={{ fontSize: "13px", maxWidth: '240px', margin: staffs.length <= 3 ? 'auto' : '0' }}>{staff.description} <br/></p>}

                                            {nearestTime && nearestTime.map((time, id)=>
                                                time.staffId===staff.staffId && time.availableDays.length!==0 &&
                                                <React.Fragment>
                                                    <div className="mobile-visible" key={'time'+id}>
                                                        <span>Ближ. запись</span>
                                                        <div className="stars" style={{textTransform: 'capitalize'}}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                                    </div>
                                                    <div className="desktop-visible" key={'time'+id}>


                                                        <span style={{ fontSize: '11px'}} className="nearest_appointment">Ближайшая запись - {roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</span>
                                                    </div>
                                                </React.Fragment>

                                            )}


                                            {nearestTime && !nearestTime.some((time, id)=>
                                                time.staffId===staff.staffId && time.availableDays.length!==0

                                            ) && <div className="">
                                                <span style={{fontWeight: 'bold', fontSize: '11px'}}>Нет записи</span>
                                            </div>
                                            }

                                        </span>

                                    </div>

                                    <div className="mobile_block mobile-visible">
                                        <img className="staff-comments" onClick={() => this.handleStaffCommentsClick(staff)} style={{ height: '25px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                                        />
                                    </div>
                                    <div className="mobile_block desktop-visible">

                                        <img className="staff-comments" onClick={() =>this.handleStaffCommentsClick(staff)} style={{ height: '25px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                                        />
                                    </div>

                                </span>
                            </li>
                        )}
                    </ul>
                    <ul className={`mobile-visible staff_popup ${staffs && staffs.length <= 50 ? "staff_popup_large" : ""} ${staffs && staffs.length === 1 ? "staff_popup_one" : ""}`}>
                      {flagAllStaffs && (
                          <li className={'nb'}
                              onClick={() => {
                                  this.handleNoStaffClick()
                              }}
                          >
                                <span className="staff_popup_item">
                                    <div style={{ width: '100%' }} className="img_container">
                                        <span className="staff_popup_name no-staff">Сотрудник не важен<br/>
                                        </span>
                                    </div>
                                </span>
                          </li>
                      )}
                      {staffs && !!staffs.length && staffs
                        .filter(staff => {
                            const activeServices = movingVisit ? services.filter(item => movingVisit.some(visit=> item.serviceId ===visit.serviceId)) : [];
                            return flagAllStaffs || (movingVisit ? (activeServices && activeServices.every(item => (item.staffs && item.staffs.some(localStaff => localStaff.staffId === staff.staffId)))) : true)
                        })
                        .filter(staff => {
                            return isStartMovingVisit || (flagAllStaffs ? selectedServices.some(selectedServ => selectedServ.staffs && selectedServ.staffs.some(selectedServStaff => selectedServStaff.staffId === staff.staffId)) : true)
                        })

                          .filter(staff => {
                              if (flagAllStaffs) {
                                  return timetableAvailable.filter(timetableItem =>
                                      timetableItem.availableDays.some(avDayItem => avDayItem.availableTimes.some(avTimeItem => {
                                          return avTimeItem.startTimeMillis <= time && time <= avTimeItem.endTimeMillis
                                      })))
                                      .some(item => item.staffId === staff.staffId);
                              }
                              return true
                          })
                        .map((staff, idStaff) =>


                      <li className={(staffId && staffId === staff.staffId && 'selected') + ' nb'}
                          onClick={(e) => this.handleSelectStaff(e, staff)}
                          key={idStaff}
                      >
                                <span className="staff_popup_item">
                                    <div className="img_container">
                                        <img
                                          src={staff.imageBase64 ? "data:image/png;base64," + staff.imageBase64 : `${process.env.CONTEXT}public/img/image.png`}
                                          alt=""/>
                                        <span className="staff_popup_name">{staff.firstName} {staffs && staffs.length <= 3 ? staff.lastName : <React.Fragment><br/>{staff.lastName}</React.Fragment>}<br/>
                                            <span style={{ fontSize: "13px"}}>{staff.description}</span>
                                        </span>
                                    </div>


                                  {nearestTime && nearestTime.map((time, id)=>
                                    time.staffId===staff.staffId && time.availableDays.length!==0 &&
                                    <React.Fragment>
                                      <div className="mobile_block mobile-visible" key={'time'+id}>
                                        <span>Ближ. запись</span>
                                        <div className="stars" style={{textTransform: 'capitalize'}}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                      </div>
                                      <div className="mobile_block desktop-visible" key={'time'+id}>
                                        <span className="nearest_appointment">Ближайшая запись</span>
                                        <div className="stars" style={{textTransform: 'capitalize'}}>{roundDown(parseInt(time.availableDays[0].availableTimes[0].startTimeMillis))}</div>
                                      </div>
                                    </React.Fragment>

                                  )}

                                  {nearestTime && !nearestTime.some((time, id)=>
                                    time.staffId===staff.staffId && time.availableDays.length!==0

                                  ) && <div className="mobile_block">
                                    <span style={{fontWeight: 'bold'}}>Нет записи</span>
                                  </div>


                                  }

                                  <div style={{ textAlign: 'center', width: '90px', margin: '0 auto' }}>
                                            <img className="staff-comments" onClick={() => this.handleStaffCommentsClick(staff)} style={{ height: '19px', marginRight: '4px' }} src={`${process.env.CONTEXT}public/img/client-verification.svg`}
                                            />
                                            {staff.rating ? (
                                                <StarRatings
                                                    rating={staff.rating}
                                                    starHoverColor={'#ff9500'}
                                                    starRatedColor={'#ff9500'}
                                                    starDimension="14px"
                                                    starSpacing="0"
                                                />
                                            ) : <span style={{ fontSize: '12px' }}>Нет отзывов</span>}
                                  </div>



                                </span>
                      </li>)}
                    </ul>
                    </React.Fragment>
                )}

                {!!this.state.staff && (
                    <React.Fragment>
                        <p className="modal_title">Перенести визит?</p>
                        <div className="approveF">

                            <button className="approveFYes"  onClick={()=>{
                                selectStaff(this.state.staff)
                                handleMoveVisit()
                                setDefaultFlag()
                                this.setState({staff: null})
                            }}>Да
                            </button>
                            <button className="approveFNo" onClick={()=>{
                                const activeStaff=staffs.find(staff => staff.staffId === (movingVisit && movingVisit[0] && movingVisit[0].staffId))
                                selectStaff(activeStaff)
                                handleDayClick(movingVisit && movingVisit[0] && movingVisit[0].appointmentTimeMillis)
                                this.props.dispatch(staffActions.toggleStartMovingVisit(false))
                                this.props.dispatch(staffActions.toggleMovedVisitSuccess(true))
                                setScreen(6)
                                setDefaultFlag()
                                this.setState({staff: null})
                            }}>Нет
                            </button>
                        </div>
                    </React.Fragment>
                )}
                {!flagAllStaffs && info.template === 1 && <p className="skip_employee" onClick={() => selectStaff([])}>Пропустить выбор сотрудника</p>}
            </div>
        );
    }
}
export default connect()(TabOne);