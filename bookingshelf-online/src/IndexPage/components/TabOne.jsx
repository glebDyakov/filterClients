import React, {PureComponent} from 'react';


class TabOne extends  PureComponent{
    componentDidMount() {

    }

    render() {

        const {staffId,staffs: staffsFromProps, subcompanies, history, match, selectedServiceGroup, clearStaff, nearestTime, selectStaff, info, setScreen, refreshTimetable, roundDown} = this.props;

        let staffs = staffsFromProps
        if (selectedServiceGroup.serviceGroupId && staffsFromProps && staffsFromProps.length > 0) {
            staffs = staffsFromProps.filter(staff => selectedServiceGroup.services.some(service => (service.staffs || []).some(serviceStaff => serviceStaff.staffId === staff.staffId)))
        }

        return(
            <div className="service_selection screen1">
                <div className="title_block n">
                    {subcompanies.length > 1 && (
                        <span className="prev_block" onClick={() => {
                            clearStaff()
                            setScreen(0.5);

                        }}>Назад</span>
                    )}
                    <p className="modal_title">{info.template === 1 ? 'Выбор сотрудника' : 'Выбор рабочего места'}</p>
                    {staffId &&
                    <span className="next_block" onClick={() => {
                        setScreen(2);
                        refreshTimetable();
                    }}>Вперед</span>}
                </div>
                <ul className={`desktop-visible staff_popup ${staffs && staffs.length <= 3 ? "staff_popup_large" : ""} ${staffs && staffs.length === 1 ? "staff_popup_one" : ""}`}>
                    {staffs && staffs.length > 0 && staffs.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((staff, idStaff) =>


                        <li className={(staffId && staffId === staff.staffId && 'selected') + ' nb'}
                            onClick={() => selectStaff(staff)}
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



                            </span>
                        </li>
                    )}
                </ul>
              <ul className={`mobile-visible staff_popup ${staffs && staffs.length <= 50 ? "staff_popup_large" : ""} ${staffs && staffs.length === 1 ? "staff_popup_one" : ""}`}>
                {staffs && staffs.length && staffs.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((staff, idStaff) =>


                  <li className={(staffId && staffId === staff.staffId && 'selected') + ' nb'}
                      onClick={() => selectStaff(staff)}
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



                            </span>
                  </li>
                )}
              </ul>
                {info.template === 1 && <p className="skip_employee" onClick={() => selectStaff([])}>Пропустить выбор сотрудника</p>}
            </div>
        );
    }
}
export default TabOne;